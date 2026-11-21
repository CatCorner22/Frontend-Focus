# First message for a new chat

**What this is.** A new chat remembers nothing of an earlier one. It reads this repository, and `CLAUDE.md` orders it to read `PLAN.md`, `PROGRESS.md`, and `DECISIONS.md` before it does anything else. So your first message needs to say only one thing: what you want today. Below are three ready messages. Copy the one that fits, paste it, and send it.

**Why three.** The project waits at a fork: milestone M4 closes only after your own trial of the Studio. What the chat should do first depends on whether you have done that trial.

**What can go wrong.** If the new chat does not tell you where the project stands within its first few minutes, send this sentence: `Read PROGRESS.md, section "Start here", and tell me where the project stands.`

## A. You did the trial

```
I did the trial in docs/trial-guide.md. My ten answers are below. Log each problem I name in redteam/FINDINGS.md with the source "the owner's trial", tell me which ones you judge serious and why, and repair those. Do not close M4 until I say so.

1.
2.
3.
4.
5.
6.
7.
8.
9.
10.
```

## B. You have not done the trial, and want the open findings worked on

```
I have not done the trial yet. Work on the open findings of 2026-11-14 in redteam/FINDINGS.md. Start with C4-F18 (a change can be lost when several tabs close in the same instant): first tell me what you would do and what it costs, then wait for my go-ahead. After that, have a reviewer look at the repairs of 2026-11-14, which no reviewer has seen.
```

## C. You want to settle the open decisions first

```
Before any new work: list every decision that waits for me (PROGRESS.md, "Waiting on the owner", and decisions D53 and D54) in plain words, one at a time, each with what you recommend and why. Ask me for each answer and record my answers in DECISIONS.md.
```

## What you may add to any of the three

- A limit on helpers, for example: `Use no helper agents without asking me first.` The reviews of 2026-11-14 used about 3.2 million tokens in helpers.
- A model or effort setting, if you chose one in the app: the chat does not need to be told; the app applies it.
