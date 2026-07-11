---
timestamp: "2024-10-15T00:00:00Z"
title: 'Contextual Bandits for Realtime News Personalization '
imageUrl: '/images/project/brainfeed/brainfeed-logo.png'
github: 'https://github.com/tharunkumartk/brainfeed-ios'
blogSlug: 'brainfeed'
featured: true
tags:
  - Machine Learning
  - Recommendation Algorithms
  - SwiftUI
  - Typescript/NodeJS
  - Firestore/GCP
  - Pinecone
  - Data Pipelines
summary: "Hyper-personalized news summaries from reputable sources powered by a multi-armed bandit recommendation system. It's on TestFlight!"
---
Twitter has been my go-to source for tech and startup news for the last two years. Not because it’s perfect, but because it’s fast — the recommendation algorithm catches things in near real-time, and you get not just the facts, but also people’s raw reactions. For a while, that was exactly what I wanted.

Then I started noticing I was getting… annoyed.
The more I scrolled, the less I actually learned.

The problem wasn’t a lack of content — it was that the content was wrapped in noise. Ten-tweet threads that could’ve been one sentence, contrarian hot-takes posted only to farm replies, vague hints of news with no links or context. And it’s not an accident. Twitter’s incentives, the content creators’ incentives, and my incentives as a reader are all misaligned. I want concise, unbiased, truthful updates. Creators want to trigger engagement to game the algorithm. Twitter wants me scrolling as long as possible.

Concise truth just isn’t rewarded.

After one too many nights of scrolling through filler and feeling like I’d wasted my time, I realized I would *pay* for something that just fed me high-quality, summarized news targeted to my interests. Imagine a bunch of bite-sized newsletters — but generated in real time, hyper-personalized, and without any fluff. That’s how Brainfeed was born.

Brainfeed is an iOS app that scrapes multiple sources, filters out the junk, summarizes the rest with GPT-4o, and serves them in a clean, scrolling feed. No clickbait, no filler — just the key points, with the option to go deeper if I want. Under the hood, it runs on a semantic search engine and a multi-armed bandit recommendation system, all packaged into a SwiftUI app that’s under 1 MB. I built the first version in a weekend.

![Brainfeed system diagram](/images/project/brainfeed/brainfeed-sys-diagram.png)


The data pipeline starts with a few reliable sources I picked after asking friends who also hate the noise:

* BizToc
* Hacker News
* Product Hunt
* Twitter (coming soon)

Each source is scraped daily. Then I feed every post to GPT-4o with a prompt that does two things:
(1) throw away anything that’s all fluff, and
(2) distill the rest into a compact “Post” object with only the essentials.

I embed each post’s text using OpenAI embeddings, store the vectors in Pinecone, and keep the raw post in Firestore.

That’s the easy part. The interesting part is the recommendation system.

Most recommendation systems for news have to handle a cold start problem — they know almost nothing about a new user, but still have to make good suggestions. My solution was to give each user **10 profile embeddings**,

$$
\{p_1, p_2, \dots, p_{10}\}
$$

initialized to the embeddings of random posts at signup.

When it’s time to recommend something:

* **70% of the time**, pick one of the 10 profiles at random, find the nearest unseen post embedding $x$ in Pinecone by cosine similarity, and recommend it.
* **30% of the time**, serve a totally random post to explore new topics.

If the user engages — likes it or lingers — update the profile embedding:

$$
p_i \leftarrow \frac{p_i + \alpha \cdot x}{\|p_i + \alpha \cdot x\|}
$$

where $\alpha$ is a constant learning rate (larger for likes than passive reads), and the vector is re-normalized so cosine similarity stays meaningful. Over time, these embeddings drift toward the actual “centers” of what the user likes, and recommendations naturally improve.

On top of that, there’s a semantic search feature — type in *AI chip shortages* and the app will return posts whose embeddings are closest to that query. It makes diving into specific topics frictionless.

The frontend is barebones by design: a vertical scroll like Twitter, but every post is short, sourced, and to the point. You can like, share, or tap for the original article.

[Brainfeed demo video](https://ydfksaipdlqazgcsrdlm.supabase.co/storage/v1/object/public/demo-videos/brainfeed-demo.mp4)


When I started using Brainfeed myself, I noticed something unexpected: after five minutes of scrolling, I felt *done*. Not “done for now,” not “done until I check back” — actually done. I had the day’s updates, zero filler, and could move on. Friends testing it on TestFlight said the same thing.

A few observations stood out:

* Likes were a much stronger signal than read-time. People often skim content they enjoy.
* Hacker News posts were consistently higher signal than most other sources, but variety mattered for long-term engagement.
* Engagement dropped sharply when summaries went over \~200 characters.

And the **70/30 exploration/exploitation split** worked beautifully. With even a few likes, the feed started to feel personalized without getting stuck in a bubble.

Keeping it running was the harder part. School picked up, my scrapers broke, and without constant maintenance, the feed degraded. Monetizing it didn’t make sense without reliable infrastructure. But as a weekend build, it worked — I’d made a complete pipeline: scrapers, embeddings, recommendations, semantic search, API, and an iOS client — all in under a week.

You can find the [iOS source code on GitHub](https://github.com/tharunkumartk/brainfeed-ios).

You can find the [data scraping source code on GitHub](https://github.com/tharunkumartk/brainfeed-scraper).

You can find the [recommendation algorithm/api server source code on GitHub](https://github.com/tharunkumartk/brainfeed-api-server).

The main thing I learned is that you don’t need an overly complex recommendation algorithm to make something *feel* personalized — you just need a system that adapts quickly and balances exploration with exploitation. And that LLMs, when paired with clean data pipelines, are amazing at stripping away human-written fluff and leaving just the signal.

Brainfeed might not be running now, but I’d still pay for an app that does exactly what it did.