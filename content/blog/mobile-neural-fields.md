---
timestamp: "2025-03-24T00:00:00Z"
title: 'NeRFs for Panoramic Scene Reconstruction from Scratch'
imageUrl: '/images/blog/blog-3.png'
github: 'https://github.com/tharunkumartk/nerf-implementation'
blogSlug: 'mobile-neural-fields'
tags:
  - Neural Rendering
  - Computer Vision
  - PyTorch
  - NeRF
summary: 'Reimplementation and experimentation with Neural Light Spheres (NeuLS), exploring mobile neural fields for implicit panoramic image stitching and view synthesis.'
---

The humble panorama has evolved from carefully stitched photographs into interactive experiences powered by neural rendering. Recently, I implemented and experimented with **Neural Light Spheres** (NeuLS), based on [this 2024 SIGGRAPH Asia paper](https://light.princeton.edu/wp-content/uploads/2024/09/neuls_paper.pdf) from Princeton's Computational Imaging Lab that proposes a _mobile neural field_ for implicit panoramic image stitching and view synthesis. This blog post documents my implementation journey, the key algorithmic components I built from scratch, and the insights gleaned from experimenting with various model features.

## Why model panoramic scenes on a sphere?

The NeuLS model treats a panoramic video as rays emanating from the camera and intersecting a unit sphere. Each ray intersection is corrected by a learned **ray-offset** model that encodes parallax, lens distortion and smooth scene motion, and a **view-dependent color** model that captures occluded content, reflections and dynamic color changes. By embedding the scene on a sphere rather than in a 3-D volume, NeuLS avoids the sparse sampling problem that volumetric radiance fields face for outward-facing panoramas. Rays always intersect the sphere, so even with little view disparity the model sees every part of the scene. Crucially, the authors do not convert intersection points into spherical coordinates; instead they store them directly in a multi-resolution hash grid on the sphere's surface. This sidesteps the non-linear projection and singularity issues associated with spherical UV maps. Because only surface intersections are stored, the hash table's memory footprint scales with the surface area of the sphere rather than its volume, making the representation compact (~80 MB per scene) and fast to render (~50 FPS at 1920×1080).

I started by implementing the core **sphere intersection** routine. For each camera ray (origin `o` and direction `d`), we solve a quadratic equation to find the distance `t` at which the ray hits the unit sphere. The intersection point is then `p = o + t · d`. In PyTorch this can be written as:

```python
@torch.jit.script
def solve_sphere_crossings(ray_origins, ray_directions):
    a = torch.sum(ray_directions * ray_directions, dim=-1)  # d·d
    b = 2.0 * torch.sum(ray_origins * ray_directions, dim=-1)  # 2(o·d)
    c = torch.sum(ray_origins * ray_origins, dim=-1) - 1.0  # o·o - 1
    discriminant = b * b - 4.0 * a * c
    t = (-b + torch.sqrt(discriminant)) / (2.0 * a)
    intersections = ray_origins + t.unsqueeze(-1) * ray_directions
    return intersections
```

After computing the intersection, the position and view direction are encoded via multi-resolution hash grids. The position is normalized to the [0, 1] cube (`intersections*0.5 + 0.5`) and fed through `encoding_offset_position`, while the 2-D angle (image coordinates) is passed to `encoding_offset_angle`. These encodings feed the ray-offset network `h_r` and view-dependent color network `h_c` to predict corrected positions and colors.

### Lens distortion

Real mobile cameras exhibit radial and tangential lens distortion. During training, NeuLS applies a polynomial distortion model to the normalized camera coordinates `(x, y)`:

```python
x_distorted = x * (1 + kappa1 * r2 + kappa2 * r4 + kappa3 * r6) + \
              2 * kappa4 * x * y + kappa5 * (r2 + 2 * x * x)
y_distorted = y * (1 + kappa1 * r2 + kappa2 * r4 + kappa3 * r6) + \
              kappa4 * (r2 + 2 * y * y) + 2 * kappa5 * x * y
```

The distortion can be formulated compactly as:

$$\text{dist} = (1 + \kappa_1 r^2 + \kappa_2 r^4 + \kappa_3 r^6)$$

This distortion model is applied to ray coordinates, also compensating for rolling-shutter skew. Correcting for distortion ensures that straight lines remain straight in the reconstructed panorama; if omitted, radial curvature becomes obvious at the edges.

## Two-stage training

When I first trained the neural field end-to-end, the reconstruction quickly overfit high-frequency textures and produced ghosting artifacts. After researching various training strategies, I implemented a **two-stage training** approach: freeze the ray-offset and view-dependent color networks for the first stage so the model learns coarse camera poses and a spherical "color map," then unfreeze all networks for joint optimization. This prevents early spurious motion and color estimates from corrupting the reconstruction. Through experimentation, I found that single-stage training duplicates scene elements and creates discontinuities, whereas the staged approach produces smooth results. My implementation confirmed this behavior: the two-stage process converged faster and avoided duplicated content.

## Experiments and visualizations

I tested my NeuLS implementation on an outdoor street video captured with a mobile phone. The following figure shows rendered views under different settings (the images used here are low-resolution screenshots; high-quality versions will be attached later):

![Renderings for different parameters](/images/blog/mobile-nerfs/renderings.png)

- **Default** (top left) shows the baseline reconstruction. The scene appears coherent, with correct proportions and minimal artifacts.  
- **Varying time** (top right) simulates an intermediate stage of training; dynamic objects like the orange bus appear partially transparent because the model has not yet explained their motion.  
- **Increasing the field-of-view (FOV scale 1.50)** (bottom left) widens the camera frustum. Since the spherical representation encodes rays on the sphere rather than fixed image planes, the model naturally supports such FOV changes. However, at extreme scales the sphere's low-resolution regions become visible, causing blurred peripheries.  
- **Vertical offset -0.40** (bottom right) moves the virtual camera upward relative to the capture trajectory. The sphere geometry ensures consistent projection even when the virtual camera deviates from the original path, but too large an offset results in missing geometry because parts of the scene were never observed.

### Toggling model components

The NeuLS representation decomposes the scene into view-dependent color and ray-offset components. To understand their contributions, I rendered the same scene while enabling and disabling the following features. **Time, FOV and offsets were held constant** so that differences arise solely from the toggled component. 

1. **Ray offset** - This module learns per-ray shifts that capture parallax and local motion. When enabled, nearby objects (cars, pedestrians) exhibit parallax relative to the background, creating depth and spatial coherence. When disabled, the scene appears _flat_; moving objects smear and align incorrectly because there is no per-ray correction. This matches the paper's findings that ray offsets model smooth motion and parallax.

2. **View-dependent color** - This network captures occlusions, reflections and dynamic appearance changes. With view color enabled, specular highlights and occluded textures appear and disappear depending on the virtual viewpoint. Disabling it removes these effects, resulting in dull, more uniform colors. In my experiment the reflections on windows and car surfaces disappeared and the shading on the brick building became constant.

3. **Lens distortion correction** - With distortion enabled, straight edges (road lines, building edges) remain straight across the image. When I disabled distortion, radial curvature became noticeable, especially near the corners. Lines bow outward and the scene appears warped; the default rendering looked like a poor panoramic stitch. I found that while the ray-offset model can compensate for rolling-shutter skew, explicit distortion correction still improves realism.

### Where the model breaks down

The NeuLS framework performs impressively well for most scenes, but certain conditions still challenge it. In my experiments:

- **Thin occluders and fine details** - Tree branches and power lines become blurry. The model's compact hash grid cannot represent extremely fine structures, and the ray-offset network may misclassify them as noise. In the right panel below, the edges of a leafless tree blur into the building, and the brick texture is missing.  
- **Fast moving objects** - Dynamic occluders like buses or pedestrians are only observed in a few frames; the network struggles to disambiguate them from static background. In the left panel below, the yellow road sign and nearby objects are distorted, and the tree lacks fine detail.  
- **Under-observed regions** - If the camera does not sufficiently cover a region (e.g., purely horizontal panning), the model cannot infer vertical parallax. Consequently, vertical details like window frames or brick courses may disappear.

![Examples of failure cases](/images/blog/mobile-nerfs/failure-modes.png)


These breakdowns highlight areas for future improvement in my implementation, such as incorporating layered depth priors or hybrid representations to handle thin structures and dynamic occlusions.

## Learnings

Building the NeuLS pipeline from scratch offered deep insights into modern panoramic scene reconstruction. Modeling a panorama on a sphere with ray-offset and view-dependent color networks provides a flexible and efficient representation that handles parallax, lens distortion and dynamic effects. The multi-resolution hash grid avoids the singularity issues of spherical UV mapping and makes it practical to store high-resolution data on a mobile device. A two-stage training strategy stabilizes learning by first fitting camera poses and coarse appearance before introducing view-dependent effects. 

The experiments reveal both the strengths and limitations of my implementation. The NeuLS approach enables interactive exploration of wide-field panoramas and outperforms traditional stitching methods under moderate motion and varying lighting. Yet it struggles with thin occluders, very fine textures and extremely dynamic scenes, highlighting areas for future development. 


This project underscores how thoughtful neural field design and training procedures can bring neural rendering closer to real-time mobile applications.