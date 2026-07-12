---
timestamp: "2026-07-10T00:00:00Z"
title: 'Mechanistic Capability Probes as a Cheap Screen for New Architectures'
imageUrl: '/images/blog/mech-probes-architecture-screen/cover.svg'
blogSlug: 'mech-probes-architecture-screen'
badge: "ICML MechInterp '26"
tags:
  - Mechanistic Interpretability
  - Language Models
  - Architectures
  - ICML 2026
summary: 'Can tiny 1M-parameter models trained on synthetic probes predict which sequence-mixer architecture wins at 1B scale? Our paper at the ICML 2026 Mechanistic Interpretability Workshop says yes.'
---

Comparing a new sequence-mixer architecture against a well-tuned Transformer is expensive. At the scale where architectural differences actually matter (1B+ parameters, 10B+ training tokens), a single training run costs multiple GPU-days. Most academic labs cannot afford to run that experiment more than a handful of times, which means most new architectures never get a fair comparison at all.

Our paper, [Mechanistic Capability Probes as a Cheap Screen for Sequence-Mixer Architectures](https://openreview.net/forum?id=oNKk2qEIOe), accepted at the **Mechanistic Interpretability Workshop at ICML 2026**, asks a simple question: can we predict which architecture will win at scale using tiny models trained on synthetic tasks? The mechanistic interpretability community has spent years building probes like induction, associative recall, copy, and finite-state tracking to characterize what architectures can and cannot do. These probes have been used to explain capability gaps after the fact, but not to predict pretraining loss in advance. We turn them into a screening tool, and it works: aggregate probe accuracy at the 1M-parameter scale predicts 150M-parameter language model cross-entropy at Spearman $\rho = -0.80$ and Pearson $r = -0.97$ on a held-out set of architectures.

## The core hypothesis: retrieval and aggregation

The screen rests on one hypothesis. Downstream language modeling performance for a sequence mixer is determined by mastery of two computational primitives and their composition:

- **Retrieval**: locate and emit a token given a positional or content cue.
- **Aggregation**: maintain and update a running summary over a stream of tokens.

An autoregressive next-token decision reduces to finding the relevant context (retrieval), summarizing it under some invariant (aggregation), and composing the two. This is not an arbitrary decomposition. Circuit-level analyses of trained Transformers in the interpretability literature, such as induction heads, name-mover heads, and content-addressing circuits, factor along exactly these axes.

## The probe suite

We collected synthetic probes from the mechanistic interpretability literature and parameterized them along the axes that appear in real downstream tasks: sequence length, vocabulary, hop depth, state-machine size, key cardinality, and distractor density. The result is a headline suite of **27 tasks** (extended to 62 with multi-hop, grid, video, and continuous variants) grouped into three families:

- **Basic (8 tasks)**: each isolates a single primitive. Copy, induction, associative recall, needle-in-a-haystack, and selective copy on the retrieval side; counting, parity, and 4-state DFA tracking on the aggregation side.
- **Compound (3 tasks)**: force both primitives in the same sequence, such as copy + count and state + retrieve. These expose how an architecture allocates capacity when the two primitives compete.
- **Diagnostic (16 tasks)**: stress tests and calibration pairs like multi-induction, skip-induction, longest run, sort, and threshold.

To make every probe a controlled experiment, all tasks share a fixed token convention (vocabulary 64, sequence length 256, shared special tokens), loss is scored only at task-defined critical positions so filler patterns cannot inflate accuracy, and every task is generated deterministically from a fixed seed.

## Architectures and the screening protocol

All architectures are dense (every parameter active on every token) and share the same backbone: RMSNorm, SwiGLU MLPs, RoPE on attention heads, and tied embeddings. Only the sequence-mixing block changes. We evaluate four mixer primitives (attention, Mamba-1, Mamba-2, and the spectral STU) under three composition modes:

- **Single-mixer**: one primitive everywhere.
- **Alternating-layer**: interleave blocks, such as attention and Mamba on alternating layers.
- **Mixed-head**: split primitives across heads within a single layer.

The screening protocol scales the same architecture definition across four levels:

1. **1M parameters**: train each architecture independently on every probe task. The per-task accuracy matrix is the screening signal.
2. **10M parameters**: repeat the sweep with a larger model dimension to confirm that low 1M scores reflect architectural limits rather than under-capacity.
3. **50M and 150M parameters**: train each architecture as a real language model to Chinchilla-optimal compute (9 architectures at 50M for robustness, 4 held-out architectures at 150M for the headline correlation).
4. **1B parameters**: a directional check at production scale on OLMo-Mix-1124.

For each architecture, the screening statistic is the mean of per-task token accuracy with task-family reweighting. We evaluate the cross-architecture **rank ordering** against downstream training cross-entropy, since ranking is the decision a compute-constrained lab actually has to make.

## Results

### Where architectures actually differ

![Per-family accuracy across probe-scale architectures](/images/blog/mech-probes-architecture-screen/mechanistic_summary.png)

The per-family profiles at the 1M scale are sharp. Pure-spectral mixers collapse on retrieval: STU reaches 40% and the STU sandwich just 13%, against 92% or more for every architecture that contains an attention component. Aggregation accuracies, on the other hand, are bunched within about 5 percentage points across all architectures. The takeaway is that architectural choice differentiates the field on **retrieval and the compound tasks**, not on aggregation.

### The suite predicts downstream cross-entropy

![Suite-mean accuracy vs downstream training cross-entropy at 150M and 1B](/images/blog/mech-probes-architecture-screen/rank_correlation.png)

On a four-architecture set held out from suite design, each trained as a 150M-parameter language model to Chinchilla-optimal compute, aggregate suite accuracy at the 1M probe scale predicts the 150M cross-entropy ranking at Spearman $\rho = -0.80$ and Pearson $r = -0.97$:

| Architecture | Suite-mean (1M) | c4_en CE (150M) | Avg. eval |
| --- | --- | --- | --- |
| STU sandwich | 0.50 | 3.67 | 0.398 |
| Mamba | 0.74 | 2.82 | 0.411 |
| Alt attention + Mamba | 0.78 | 2.81 | 0.416 |
| Attention | 0.80 | 2.81 | 0.416 |

The suite-mean ordering matches the cross-entropy ordering and is consistent with zero-shot evals (PIQA, HellaSwag), so the screen's pick is not specific to the pretraining loss surface. A larger nine-architecture fit at 50M gives $\rho = -0.88$ against wikitext-103 cross-entropy.

## Hydra: what the profiles told us to build

The per-family profiles show that no single mixer dominates. Attention handles retrieval, Mamba is competitive on aggregation and finite-state tracking, and STU is efficient on long-range smoothing but collapses on retrieval. So we built **Hydra**, a multi-head block that places all three mixer types as parallel heads inside a single layer. Each layer can route capacity to the primitive that suits the local computation rather than committing to one mixer for the whole network.

![The Hydra block architecture](/images/blog/mech-probes-architecture-screen/hydra-arch.png)

The 1B configuration uses 4 attention, 4 STU, and 4 Mamba heads per block, with outputs combined by weighted average. We trained Hydra and a parameter-matched OLMo-2 attention baseline on OLMo-Mix-1124 for ~13k steps at sequence length 4,096:

| Metric | Hydra | Attention baseline |
| --- | --- | --- |
| Train CE | **2.880** | 2.934 |
| Train PPL | **17.82** | 18.80 |
| Zero-shot avg. (15 tasks) | **0.540** | 0.529 |

Hydra has the higher 1M suite mean (0.81 vs 0.76) and reaches the lower cross-entropy at 1B, preserving the direction of the small-scale ranking. It wins on 8 of 15 zero-shot tasks (with one tie), trailing mainly on the MMLU subdomains. With $n = 2$ this is a directional check rather than a second correlation point, but the suite ranking, the pretraining loss ranking, and the eval ranking all agree at production scale.

## Robustness

A fair worry is that a single task family carries the whole signal. We tested this by recomputing the suite-mean with each primitive deleted and refitting the rank correlation on the nine-architecture 50M set:

![Drop-primitive ablation at 50M](/images/blog/mech-probes-architecture-screen/q1_drop_family_ablation.png)

The correlation stays negative and statistically significant under every drop. The screen also survives more aggressive perturbations. Restricting it to only the multimodal probes (6 grid and video tasks) still predicts the 50M ranking at $\rho = -0.73$, and restricting it to a three-task autoencoding subset (noisy copy, compress, reverse copy) gives $\rho = -0.83$:

![Multimodal-only probes predict the same ranking](/images/blog/mech-probes-architecture-screen/q3_multimodal.png)

Rankings at low compositional depth also predict rankings at higher depth ($\rho = 0.67$ between hop depth 2 and 4), so the screen is not tied to one difficulty level.

## Limitations and takeaways

The honest caveats: the headline fit uses four architectures at 150M (nine at 50M, two at 1B), all runs are single-seed due to compute constraints, and the claim is restricted to **dense** architectures. Mixture-of-experts models are excluded on purpose, since their per-token compute is decoupled from parameter count and they show scale-dependent capability emergence that small-scale probes cannot capture. A more compelling fit would span 20+ architectures across families we do not yet cover (H3, Hyena, RWKV, RetNet).

Still, the result is practical. Training all 27 probes at the 1M scale takes a few GPU-hours, versus GPU-days for a single at-scale comparison. The suite gives compute-constrained labs a structured way to compare new mixer architectures before committing to large-scale pretraining, and the per-family breakdowns tell you not just which architecture is better but why. In our case, that "why" led directly to a new architecture that beat the baseline.

---

This paper was accepted at the [Mechanistic Interpretability Workshop](https://mechinterpworkshop.com/) at ICML 2026 (July 10, 2026, Seoul), the leading venue for research on understanding the internal weights and activations of neural networks.
