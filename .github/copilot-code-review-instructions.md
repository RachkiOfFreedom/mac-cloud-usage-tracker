# Code Review Instructions

Focus review on:

1. **Type safety**: Flag any `any`, unchecked casts, or missing null handling
2. **Edge cases**: Verify boundary conditions (empty arrays, zero values, NaN, Infinity)
3. **Determinism**: Flag Date.now(), Math.random(), or locale-dependent operations without explicit handling
4. **Error handling**: Ensure errors are typed and messages are actionable
5. **Test quality**: Tests must assert behavior, not implementation details
6. **PR scope**: Flag PRs that mix concerns or touch more than 3 files without justification
7. **Conventional commits**: PR title must start with feat:, fix:, ci:, refactor:, test:, or docs:
8. **Input validation**: All public-facing functions must validate inputs at the boundary
9. **Floating-point arithmetic**: Flag direct equality checks on floats; require deterministic rounding
10. **No runtime dependencies**: Flag any new dependency additions — must be explicitly approved

Do NOT flag:

- Missing comments on self-documenting code
- Style preferences already handled by linting
- Import ordering (handled by tooling)
- Minor naming bikeshedding when intent is clear
