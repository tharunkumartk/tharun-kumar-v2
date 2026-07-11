---
timestamp: "2026-04-06T00:00:00Z"
title: ''
imageUrl: ''
github: ''
blogSlug: 'applied-synthetics'
tags:

summary: '.'
---
i see a future where the best r&d lab will be fully automated by AI

i want to build this future. to do this i will

1) hire the best researchers to work on whatever research they want, funding their research, etc
2) hire the best engineers to build tools to automate as much of their research process as possible with AI

writing code and experiments and stuff is already automated.

research in literature is already automated.

one open question is -- hwo do we get models to come up with novel interesting ideas?

its like a macro skill; its coming up with data that is out of distribution, which AI models definitively cannot do. but it is possible to learn the delta of old idea -> new idea that works, and use that to generate new ideas. however, this is a later stage problem.


so if i use human researchers to come up with ideas, then this part is automated.

then, scientific research is essentially automated! 

right now, i want to make it so that the human researchers come up with ideas with the aid of AI for literature research. then, let them easily let claude code (or whatever alternative) write all the code required to run experiments, with gpu access and everything, and provide the results in a report.

all of the ideation, failed experiments, failed code writing, etc will be very critical data for building a future ai scientist that can come up with new ideas. 

---

what does an MVP of this look like?

im imagining something like codex/claude/cursor agent, etc but there are specific modes that lets you easily view what the agents are doing. all the code, etc will be stored in the cloud, with terminal access to the sandbox environment. the model will be able to allocate gpus as necessary. 

the user will be able to view all the output of the model (files, train logs, claude logs, etc), as well as the current state of what is going on. they will also be able to see the cost of each of these experiments. 

claude should be able to surface intermediate results in a digestable format. perhaps in a research log that it continuously writes in? 

there has to be heavy arxiv research capabilities. 

it has to be snappy, and not buggy whatsoever. 

new tools required:
WriteReport       <- incremental summary output of experiment results, findings, etc as time passes
RequestGPUNode    <- provisions a GPU node, returns node_id and connection details
RunOnGPU          <- executes a command on a provisioned node by node_id (stateless per-call, no persistent SSH)
KillGPUNode       <- terminates a GPU node by node_id; confirms with researcher if active run detected
ProposeExperiment <- surfaces a UI to the researcher with: experiment details, estimated cost, base repo/sources, config summary. researcher approves/rejects/modifies before anything launches

the claude agent needs to be running somewhere with the capability of sshing into the modal gpu nodes and running commands. 
---

