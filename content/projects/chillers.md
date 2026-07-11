---
timestamp: "2023-08-05T00:00:00Z"
title: 'An app to meet chillers'
imageUrl: '/images/project/chillers/chillers-logo.png'
github: 'https://github.com/tharunkumartk/chillers-ios'
blogSlug: 'chillers'
tags:
  - SwiftUI
  - Supabase
summary: 'iOS app for connecting verified "chillers" through curated parties and community-driven filtering, actually launched with great initial traction.'
---
This is the story of how I made an app to meet chillers.

I went to an intern party here in Seattle and found it kind of disappointing for a few reasons. First, **half of the people were “Linkedin maxxers”** (a term I coined)—they talked and subtly flexed about their internships, past experiences, and the schools they attended. It felt more like they were there to network than to have fun. Another quarter  were just guys who were looking for girls to talk to with no intention of having a good time/making friends. But, the remaining quarter—whom my roommate and I called “chillers”—were actually pretty cool to talk to, and seemed interested in making friends and having a good time.

Interestingly, this wasn't just my experience. My roommate, who attended the party with me, noticed the same phenomenon. The next party we went to, we intentionally sought out other “chillers” and asked if they'd faced similar issues. It turned out they had, and we bonded a lot over the fact that it was SO hard to find these chillers.

This sparked an idea:

**Imagine an app exclusively for “chillers,” where newcomers create profiles with some basic questions and pictures**. However, they're not immediately allowed into the app; instead, existing users have to swipe right, indicating the newcomers are “chillers.” Only then are they allowed to join this exclusive group. Members of the app could then throw parties and invite only fellow chillers. Admittedly, this was judgmental—but it was also a fascinating social experiment. My roommate and I saw striking parallels with fraternities, Princeton's eating clubs, and other exclusive social groups. **Interestingly, beyond the concept of chillers-only events, people seemed drawn to the idea of exclusivity itself**.

As we recalled what made each person "chill", we realized some initial ways to filter chillers from non-chillers:

* See if they have strong opinions about anything.
* See if they understand the difference between chillers and non-chillers.
* Check if they catch general pop culture references like blunt rotations or sports.

If they're willing to talk about any of the above things with any sort of excitement, they're usually a "chiller". 

The following week, inspired by our findings, my roommate and I decided to actually create the app. On a Friday night after work, from 5pm to 10pm, we built it. 

### Implementation 

We used Supabase to host the database and user profiles, Twilio for phone authentication, Apple Push Notifications to handle push notifications, and SwiftUI to build the actual application. Here's a concise system diagram:

![Chillers system diagram](/images/project/chillers/chillers-sys-diagram.png)

We focused heavily on the onboarding part of the application to minimize churn in the actual account creation process (since we viewed this as the easiest wall for users to hit). Here's a quick demo of the onboarding form we landed on:


[Onboarding demo video](https://ydfksaipdlqazgcsrdlm.supabase.co/storage/v1/object/public/demo-videos/chillers-demo.mp4)

All source code can be found on [GitHub](https://github.com/tharunkumartk/chillers-ios).


### Learnings

By 11pm, we headed to another party to pitch the app to people. Our "go-to-market" strategy was straightforward: throw a massive, insanely hype party, get everyone to download the app, and then use it to filter guests for future parties. Essentially, we aimed to solve the cold-start problem by incentivizing users with the best party they've been to. (see a quick onboarding onto the app below)


Throwing our first party was nerve-wracking. From 9pm to 10:30pm, literally no one showed up. It was terrifying—people would peek in, see just five brown guys around a DJ set in an empty room, and leave. Realizing we had to take action, we began directly engaging with anyone who stepped through the door, offering drinks and conversation. It was the most extroverted I'd ever been, but it worked.

Eventually, the party got packed and was genuinely popping. We enthusiastically promoted the app to everyone, and they actually showed interest! We managed about 80 downloads and 30 account creations, with people actively swiping within the app. It felt incredible.

From this experience, we learned a lot about what incentivizes people, why they download apps, and what draws them to parties. However, we also discovered significant obstacles. Very few attendees were willing to organize gatherings the following week. Plus, after meeting at our initial event, users found there wasn't much to keep them engaged on the app. Friendships typically form over repeated interactions, which our app didn't facilitate. That's precisely why college friendships often develop among people physically nearby, like dorm mates.

We attempted several pivots to boost retention and potentially scale, but ultimately realized the app's nature limited its growth and monetization potential.

I will say, though—it makes for a pretty sick story.
