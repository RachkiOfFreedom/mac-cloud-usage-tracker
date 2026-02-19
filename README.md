# mac-cloud-usage-tracker

## PR Merge Order

The table below lists the open pull requests, their base branches, and dependencies.

| PR | Title | Base branch | Depends on |
|----|-------|-------------|------------|
| [#1](https://github.com/RachkiOfFreedom/mac-cloud-usage-tracker/pull/1) | feat: add typed usage-record normalization foundation | `main` | — |
| [#2](https://github.com/RachkiOfFreedom/mac-cloud-usage-tracker/pull/2) | ci: add GitHub Actions pipeline and prevent test artifact emission | `main` | PR #1 (logical: CI wraps the project introduced in #1) |
| [#3](https://github.com/RachkiOfFreedom/mac-cloud-usage-tracker/pull/3) | Enforce strict ISO 8601 timestamp validation | PR #2's branch | **PR #2 (hard git dependency)** |
| [#4](https://github.com/RachkiOfFreedom/mac-cloud-usage-tracker/pull/4) | Add GitHub Merge Queue support *(draft)* | `main` | — |
| [#5](https://github.com/RachkiOfFreedom/mac-cloud-usage-tracker/pull/5) | Consolidate PRs 1–3 *(draft)* | `docs/copilot-code-review-instructions` | PRs #1, #2, #3 |

### Which PR must be merged first?

**PR #2 must be merged before PR #3.**

PR #3's base branch is `codex/establish-coding-guidelines-for-precision-engineered-code-d6c5wd`,
which is the head branch of PR #2. This is a hard git dependency: merging PR #3 into `main`
requires that PR #2 land first (or PR #3 be rebased onto `main`).

Recommended merge sequence for the non-draft PRs:

1. **PR #1** — establishes the TypeScript project, types, and normalization foundation.
2. **PR #2** — adds the GitHub Actions CI pipeline and tightens the TypeScript compiler config; depends on the project structure from PR #1.
3. **PR #3** — enforces strict ISO 8601 timestamp validation; its base branch is PR #2's branch, so it cannot be merged until PR #2 has landed.