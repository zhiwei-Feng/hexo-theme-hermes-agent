---
title: Hermes Agent Teardown · How Nous Builds a CLI Agent
date: 2026-04-27 14:30:00
tags: [tech, ai]
categories: [tech]
description: A walkthrough of the agentic loop, prompt compression strategies, and tool-use closures inside the Hermes CLI.
featured: true
---

## 01 · Architecture Overview

The agent loop is an incrementally-compressed prompt. Each tool call folds the observation back into context while preserving the key reasoning path.

### Core Loop

Three stages repeat until completion:

1. **Plan** — the model emits a plan in structured tokens
2. **Act** — one tool invocation per step
3. **Compress** — observation folded into a rolling summary

```bash
$ hermes run --task "refactor the auth middleware"
→ [1/3] reading src/middleware/auth.ts
→ [2/3] identifying refactor targets
→ [3/3] applying changes...
```

> An agent is not a chatbot with tools — it is a system that refines its own plan.

## 02 · Prompt Folding

| Stage | Context size | Retention |
|-------|--------------|-----------|
| Plan  | 8k           | full      |
| Act   | 16k          | last 3    |
| Recap | 4k           | summary   |

## 03 · Tool-Use Closure

Details on how tool calls bind back to the plan object go here.
