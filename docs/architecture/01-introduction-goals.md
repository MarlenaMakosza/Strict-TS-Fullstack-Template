# 1. Introduction and goals

## Purpose

A template for TypeScript backends on Node.js: a small HTTP API with Hono that a frontend can
call. It sets up a strict
toolchain and quality gates, so a new project starts with professional-quality checks instead of
adding them later.

## Users

- Developers who start a new TypeScript project and want strict checks from the first commit.
- Developers who let AI agents write code and want automated checks to decide what gets in.

## Quality goals

| Priority | Goal          | What it means                                                              |
| -------- | ------------- | -------------------------------------------------------------------------- |
| 1        | Correctness   | Code that passes the gates is tested, typed and checked for known traps    |
| 2        | Fast feedback | Fast gates run in about a minute; slow ones run before the merge and in CI |
| 3        | Adaptability  | Every tool can be turned off or replaced, and the AI setup removed         |
