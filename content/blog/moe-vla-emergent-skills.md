---
timestamp: "2026-07-11T00:00:00Z"
title: 'Emergent Compositional Skills in Mixture-of-Experts VLAs'
imageUrl: '/images/blog/moe-vla-emergent-skills/cover.png'
blogSlug: 'moe-vla-emergent-skills'
badge: "ICML CompLearn '26"
tags:
  - Robotics
  - VLAs
  - Mixture-of-Experts
  - ICML 2026
summary: 'A VLA with a simple Mixture-of-Experts action head learns to break manipulation tasks into reusable skills like grasp, transport, and release, with no skill labels or hierarchy. Accepted at the CompLearn Workshop at ICML 2026.'
---

Vision-language-action models (VLAs) can perform a wide range of robotic manipulation tasks, but they are trained and deployed as monolithic policies. That makes it hard to identify reusable skills, compose behaviors hierarchically, or adapt one part of the policy without touching the whole model. Yet most manipulation tasks decompose naturally into behavioral modes like reaching, grasping, and placing. The question we asked: can a VLA learn that modular structure directly from demonstration data, without any pre-specified task decomposition, skill library, or sub-task labels?

Our paper, [Emergent Compositional Skills in Mixture-of-Experts VLAs](https://openreview.net/forum?id=PfUF22tb6X), accepted at the **CompLearn Workshop at ICML 2026**, shows that the answer is yes, and that it takes surprisingly little machinery. We replace the feed-forward layers of the VLA's action expert with a simple Mixture-of-Experts (MoE) and train with standard imitation learning. The experts specialize into distinct, reusable low-level skills, the router learns to sequence them like a high-level planner, and task performance matches the dense finetuned baseline. This was joint work with Shlok Shah, Rhiaan Jhaveri, Chirayu Nimonkar, and Ishaan Javali (equal contribution), advised by Dhruv Shah at Princeton.

## The approach: a LoRA Mixture-of-Experts action head

We build on two pretrained flow-matching VLA backbones, $\pi_0$ and SmolVLA. Both consist of a vision-language module that encodes camera views and language into context tokens, and an action expert (a transformer decoder) that processes a proprioceptive state token and a noised action chunk. Our method is backbone-agnostic.

![LoRA Mixture-of-Experts architecture. The router makes a single decision per forward pass from the VLM context, selecting one expert applied at every action-expert layer. Attention is shared; only the FFN gets a routed LoRA adapter.](/images/blog/moe-vla-emergent-skills/architecture_figure.png)

Two design choices define the architecture, both visible in the figure above. First, the MoE replaces **only the FFN sublayer** of each action-expert layer; self-attention is shared across all experts:

$$\mathrm{FFN}_\ell(x) = \mathrm{FFN}^{\text{base}}_\ell(x) + \sum_{e \in \mathcal{R}} w_e \bigl(\mathrm{FFN}^{(e)}_\ell(x) - \mathrm{FFN}^{\text{base}}_\ell(x)\bigr)$$

where $\mathcal{R}$ is the routed expert set with renormalized weights $w_e$, and each expert differs from the base only through rank-16 LoRA deltas $\Delta W = (\alpha/r)\,BA$. The $B$ matrices are zero-initialized, so at step zero every expert is identical to the base FFN and the policy reproduces the pretrained backbone exactly. Specialization emerges around a strong prior rather than from scratch.

## Routing once per forward pass

The second design choice is where the routing happens. Standard MoE transformers route per token, per layer. We route **once per forward pass** and share that decision across all action-expert layers. A single (indices, weights) pair applied through the full depth turns each expert into a coherent end-to-end behavior, a skill, rather than a pile of unrelated layer-wise decisions.

A small MLP router takes a context vector summarizing what the robot sees and where it is:

$$c = \bigl[\,\mathrm{MeanPool}\bigl(\mathrm{VLM}(I, \ell, s)\bigr)\;\Vert\;W_s\, s\,\bigr]$$

where $I$ are the camera observations, $\ell$ is the instruction, $s$ is the proprioceptive state, and $W_s$ is the state projection shared with the action expert. The router emits logits over $E$ experts, we take the top-$k$ and renormalize their softmax weights, and the selection is applied at every MoE FFN. At inference, the router fires once per action chunk.

The training objective is just the backbone's flow-matching behavior-cloning loss plus a standard load-balancing term to prevent the router from collapsing onto one expert:

$$\mathcal{L} = \mathcal{L}_{\text{FM}} + \lambda_{\text{LB}}\, \mathcal{L}_{\text{LB}}$$

with $\lambda_{\text{LB}} = 0.01$. No skill labels, no diversity discriminator, no orthogonality penalty. The compositional structure below emerges from this alone.

## The experts learn real skills

Training on LIBERO-10, the router selects experts that correspond to qualitatively distinct phases of manipulation. Three representative ones:

![Expert A places a grasped object at its final position](/images/blog/moe-vla-emergent-skills/expert1_skill_figure.png)

**Expert A** handles the final transport phase. It activates once an object is already grasped and carries it to its target, across three otherwise unrelated tasks (placing a moka pot on a stove, dropping a mug into a caddy, putting a mug in a microwave).

![Expert B releases an item and retracts upward](/images/blog/moe-vla-emergent-skills/expert5_skill_figure.png)

**Expert B** captures release-and-retract. It fires after a drop-off to lift the gripper back to a raised pose.

![Expert C approaches and grasps thin handled items](/images/blog/moe-vla-emergent-skills/expert8_skill_figure.png)

**Expert C** is selected during approach-to-grasp on objects with thin handles, like moka pot and mug handles.

Two properties stand out. First, the same expert is reused across very different tasks and scenes, so the experts encode phase-level skills rather than task-specific policies. Second, these three experts together cover a natural manipulation cycle of approach, transport, and release, which the router stitches into full trajectories by switching experts over time. The model also discards capacity it does not need: of the 16 experts we train, 6 are largely never dispatched.

## Reusable vs task-specific experts

Looking at how often each expert fires across LIBERO-10 reveals two distinct roles:

![Selection frequency of four representative experts across LIBERO-10 tasks](/images/blog/moe-vla-emergent-skills/expert_reuse.png)

**Reusable experts** fire at 35-45% frequency on five different tasks and near zero on the rest, and the router alternates between them within single trajectories. This is the signature of a phase-level skill that recurs across structurally similar tasks. **Task-specific experts** concentrate on one task each (67% of selections on task T5 for one, 66% on T2 for another). These plausibly absorb idiosyncratic behaviors that only one task demands, which keeps the reusable experts crisp by sparing them the long tail of edge cases.

## Composing skills to solve longer tasks

![Example trajectories labeled by top expert used at each step](/images/blog/moe-vla-emergent-skills/expert_switch_figure_crop.png)

On longer-horizon LIBERO-10 tasks, the router sequences primitives to reach the goal. On task 5, Expert C grasps the book, then Expert A places it in its final position. On task 2, Expert C grasps the stove dial and Expert A moves the arm onto the handle.

Task 4 shows something more interesting: the policy fails to complete the task, but it fails interpretably. It repeatedly invokes the same pair of primitives to approach the cup, attempt a grasp, move, and release, sequencing them more than five times across the trajectory. The compositional structure turns failures into a readable story of known primitives misapplied, rather than arbitrary degenerate behavior.

## Do the experts cause the skills?

There is a lurking confound in everything above. Maybe the experts all share overlapping capabilities and the router just consistently dispatches them the same way, so the apparent expert-to-skill mapping is an artifact of the router's policy. And even if experts do specialize, their skills might not transfer to contexts where the router would never select them.

We tested both by **manually overriding the router** for a single action chunk within a trajectory:

![Manual router substitution for two action chunks](/images/blog/moe-vla-emergent-skills/manual_routing_comparison.png)

If experts genuinely differ, swapping one in should visibly change the action. If a skill is truly reusable, forcing its expert in a new context should still trigger the behavior. We observe both. On task 4, Expert C displays grasping behavior even though the router never used it on that task, and commanding other experts in the same chunk does not produce it. In a more striking example, we recovered from a failed grasp (the gripper had moved past the object) by manually re-selecting the grasp expert, producing a successful grasp on the second attempt. The learned primitives are valuable on their own: manual routing achieved better skill stitching than the router itself, which suggests room for out-of-distribution generalization the current router leaves on the table.

## Performance and takeaways

On LIBERO, the MoE policy matches the dense finetuned baseline on both $\pi_0$ and SmolVLA, with both initialized from the same checkpoint and finetuned for 20K steps under identical optimization. Skill specialization comes at no cost to task competence.

The broader takeaway is that hierarchical, skill-based robot learning may not require extra machinery like high-level planners, options, or pre-trained skill libraries. A simple MoE action head plus standard imitation learning was enough for modular, interpretable structure to emerge from demonstration data alone. The honest limitations: many learned skills remain task-specific and hard to interpret, experts sometimes act outside their associated primitive, and our preliminary router failed to deliver compositional generalization on its own. Future work is about understanding which components enable the compositionality and how to push it further, especially using these primitives to generalize to longer-horizon tasks.

---

This paper was accepted at the [2nd Workshop on Compositional Learning (CompLearn)](https://compositional-learning.github.io/) at ICML 2026 (July 11, 2026, Seoul), which focuses on how AI systems construct and reason about complex concepts from reusable components.
