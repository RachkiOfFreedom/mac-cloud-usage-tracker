# Copilot Coding Instructions

## Stack

The intended stack for this project is:
- TypeScript (strict mode), Node.js 20+
- Vitest for testing
- No runtime dependencies unless explicitly approved

> If the repository does not yet have a `package.json` or `tsconfig.json`, establish these before applying the standards below.

## Code Standards
- Types/interfaces are the source of truth — define them first
- No `any` types. Use `unknown` + type guards where needed
- Functions must validate inputs at the boundary, trust types internally
- Round numbers deterministically — never rely on floating point equality

## PR Standards
- One concern per PR. If a change touches >3 files, split it
- PR title must follow conventional commits: `feat:`, `fix:`, `ci:`, `refactor:`, `test:`, `docs:`
- PR body must clearly cover three areas: **Motivation** (why), **Description** (what/how), and **Testing** (how it was verified).
  - Prefer markdown sections named `Motivation`, `Description`, and `Testing`
  - Equivalent headings (e.g., `Why`, `What changed`, `New files`, `How was this tested?`) are acceptable as long as all three areas are present

## Testing
- Test core business logic and edge cases
- Do not test trivial getters/setters or type-only code
- All tests must be deterministic — no Date.now(), no Math.random() without seeding
