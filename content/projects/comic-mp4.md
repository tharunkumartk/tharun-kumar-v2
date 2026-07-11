---
timestamp: "2024-12-10T00:00:00Z"
title: 'Comic.mp4: Turning Webtoons into Anime with Generative AI'
imageUrl: 'images/project/comicmp4/comicmp4-hero.png'
previewImageUrl: 'images/project/comicmp4/comicmp4-preview.png'
featured: true
github: 'https://comic-mp4-web.vercel.app/'
blogSlug: 'comic-mp4'
tags:
  - Generative AI
  - Computer Vision
  - Video Generation
  - Animation
  - Agentic Systems
summary: 'Building an agentic generative AI pipeline to automatically convert static webcomics into animated anime, and what happened along the way.'
---

What if webtoon creators could turn their comics into anime automatically? **No animation studio required.** [Kris Selberg](https://www.krisselberg.com/) and I built Comic.mp4, an automated pipeline that generates full anime episodes from webtoon comics (and almost took it through YC). Here's a kick-ass demo, how we built it, and what we learned.

[Comic.mp4 demo video](https://ydfksaipdlqazgcsrdlm.supabase.co/storage/v1/object/public/demo-videos/comicmp4-demo.mp4)
---

## Introduction

Comic books have been the backbone of creative storytelling for over a century. But the way people consume them has changed dramatically—today, the dominant format is **webtoons**: mobile-first, vertically-scrolling digital comics designed to be read with your thumb.

The format originated in South Korea in the early 2000s, born from the ashes of the country's print comics industry. The innovation was simple: instead of paginated layouts, webtoons use a single continuous vertical strip optimized for phone screens. The Korean term for these comics is "manhwa," and the format exploded globally when Naver launched LINE Webtoon internationally in 2014.

The numbers are staggering. WEBTOON has approximately **170 million monthly active users** across 150+ countries. In 2024, WEBTOON Entertainment generated **\$1.35 billion in revenue**. The broader webtoon market is valued at over \$7 billion and growing at nearly 30% annually. Meanwhile, the anime industry sits at roughly **\$30–35 billion globally**—and the audience overlap is massive. Almost every webtoon reader I've met also watches anime.

When I talked to readers about why they read webtoons, one big reason kept surfacing:

**Anime took too long to release.** These readers care about plot progression and consume webtoons at their own pace—often finishing 100+ chapters in a weekend. They love the immersion of anime, but there's just not enough content. In fact, they want the immersive experience so badly that they listen to music that fits the mood of each chapter while reading.

Video generation, image generation, audio generation, and voice generation were all rapidly getting better... what if we put all of these technolgies together to turn these webtoons into immersive anime?

## Technical Details

The technical problem is pretty clean to state and but tediously difficult to do well.

**Given a chapter-length vertical scroll webtoon, generate a horizontal anime episode that preserves plot, intent, character identity, and the original art style while minimizing the amount of new training required**

We took an engineering-first approach. No new foundation model training. Just a pipeline that chains existing models together, with an agent in the middle whose only job is to keep things from drifting into garbage.

The big constraint is consistency. If the main character’s face changes every shot, nothing else matters. If the framing is wrong, it feels like a slideshow. If the audio cadence is off, it stops feeling like anime and starts feeling like “AI demo”.

So we treated the comic as the source of truth and built around it.

#### Key frame extraction

A webtoon chapter isn’t a storyboard. It’s a scrolling experience. The author controls pacing with panel size, spacing, and reveals.

The first step is turning the vertical scroll into “beats” that should become shots. After first manually extracting beats from the vertical scroll, we found some high-level patterns in the manual process. We used a mix of image heuristics and simple structure detection to cut the chapter into segments that matched our manual process. 

All of the plot and dialogue was embedded in text bubbles and captions on the vertical scroll. To extract and remove the text and bubbles, we ran a detection step to find bubbles and their masks, OCR’d the text, and stored it as structured dialogue tied to each beat. Then we inpainted the bubble regions using Flux 1.dev to match the rest of the scene. This tended to work pretty reliably, so we built a nice automated pipeline where I can highlight the part of each frame that I want to inpaint, and it automatically fixed it up. 

The final major key-frame step is to convert the vertical beats into horizontal shot by extending the canvas and filling missing regions via Stable Diffusion outpainting.

Early on, we did this manually by choosing crops and judging what looked cinematic. Later, we automated a lot of it with a small agent loop: propose a crop, render a preview, critique it, and retry until it looks like an actual shot instead of a broken frame.

We experimented with multiple inpainting/outpainting models. The main issues we faced were that the models would randomly add irrelevant details to the shot, and prompt guidance was quite poor (this was before Google Nanobanana). However, we found that Flux 1.dev and Adobe Firefly performed quite well for these tasks. 

#### Animation Generation

Once we had clean, widescreen keyframes, we generated short clips per shot by conditioning on the first frame. This required heavy prompt-engineering, and back and forth between the model to generate exactly what we wanted. 

We automated an LLM agent to generate a diverse set of prompts to batch generate the videos we needed. Then, we manually picked the videos we should use (this part could definitely be automated by an LLM, but we wanted to start with a manual process to maximize episode quality).

(Demo coming soon)

#### Voices and sound

We used ElevenLabs-style TTS to generate voices per character and laid the dialogue onto the shot timeline. In theory you can automate speaker assignment by reading bubble tails and panel context. In practice, webtoons are messy. Sometimes the bubble tail is ambiguous. Sometimes there is no tail. Sometimes the speaker is implied by the previous beat.

We could automate a lot of the image extraction and video generation, but picking the right voice and sound is extremely aesthetic that AI didn't understand very well. As a resule, we became audio engineers and manually generated voices and sounds to fit the episodes' scenes.


#### Stitching it all into an episode

This part was also primarily manual, because we needed to make sure that the shots and timings of the audio + video was coherent. This required a largely human touch, but only took about an hour of manual editing per 2 minute episode. We used Adobe Premiere Pro.

By the end, we produced two full-length episodes for roughly \$25 each in compute costs, mostly because we were careful about shot length and we didn’t try to generate long continuous sequences.

---

## User Interviews

The two audiences were readers and creators, and their reactions were almost opposite.

Readers cared about one thing: “does it feel bingeable?”

They were skeptical until they saw a clip, then immediately asked for more. They didn’t care if the animation wasn’t perfect. They cared if the pacing was right and the characters stayed recognizable. The moment the output felt like an episode instead of an AI slideshow, they were in.

Creators were allergic to it.

A lot of them saw it as theft by default, even if the technical framing was “this helps creators scale.” The vibe was less “cool tool” and more “this will be used against us.” One creator whose work we referenced publicly reached out and threatened legal action. 

We found that most readers didn't care too much for how the content was made, but the artists were extremely against using AI because it used other creators' work illegally. This was an uphill battle to fight, because we couldn't use their comics without their permission.

However, there were a few smaller comic creators who didn't mind, as long as they were appropriately credited and full control over how their comic was executed into video. This was another issue though; as you saw in the demo, the video wasn't perfect, and by no means modern animation study level. Many artists didn't't want "good-enough" content to rperesent their work, they wanted to produce the highest quality. 

So we needed to find artists who were both okay with AI, and okay with mediocre animations representing their work. This was honestly very difficult to find, and in the two weeks of outreach we did, we couldn't find anyone. 

## Clients and YC

After the creator backlash, we started thinking about how we could pivot: what if these tools could be used by the larger comic creation platforms? This would solve our distribution problem immediately.

We landed a sales call with a Webtoon competitor that was interested in using the pipeline to generate promo clips, and was intersted in partnering with us. This was huge news to us! But, at this point we accepted a job offer to work at a differnt early-stage startup (UniversalAGI), so we dropped the project.

We also applied to YC W25 because the deadline was basically right after we started, and we had enough of a demo to make it legible. We shipped a clip, wrote the story, applied, and got an interview!

## Conclusion

This space is going to happen. The only open question is who gets there first and what the distribution looks like.

Video models have already improved since we built Comic.mp4, and they’re still improving fast. The pattern we used is still the correct shape of a solution even if every individual model changes.

I’m not open-sourcing the repo because most of the external APIs we used changed quickly enough that the code is dated, but the ideas seem to be a common pattern used in other fields.

If someone builds this as a real product, the hard part won’t be making motion.

It’ll be making something that stays consistent, feels watchable, and doesn’t put creators in a position where their only reaction is to lawyer up.