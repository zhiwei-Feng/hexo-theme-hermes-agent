---
title: LLM Inference · From Chain-of-Thought to Planner
date: 2026-04-21 09:00:00
tags: [ai, llm]
categories: [ai]
math: true
description: Why planning-based inference dominates CoT at long horizons.
---

## Motivation

CoT degrades on problems requiring backtracking. Given a task horizon $h$, the failure rate grows as

$$
P(\text{fail}) = 1 - (1 - p)^h
$$

where $p$ is the per-step error rate.

## Planner Formulation

A planner maintains a tree of candidate continuations and expands the most promising branch by UCB1 score.
