# Design

## Summary

SpecForge v0.1 will remain a repository-native protocol, but the harness will gain better rules, templates, command cards, and local scripts.

## Boundary Commitments

### Allowed Write Scope

- `.specforge/`
- `docs/`
- `.specforge/tools/`
- `.specforge/registry.yaml`
- `.specforge/project/`
- Current change workspace
- `package.json`

### Forbidden Scope

- External repositories.
- Full npm package release.
- Runtime-specific adapter directories.

## File Structure Plan

| Path | Ownership | Notes |
|---|---|---|
| `.specforge/rules/` | Static workflow discipline | Boundary, context, gate, quality rules |
| `.specforge/templates/` | Reusable phase artifacts | More explicit SDD fields |
| `.specforge/commands/` | Command cards | Human and agent-readable command contracts |
| `.specforge/tools/` | Local utilities | No external dependencies |
| `docs/research/` | Source synthesis | Captures external influence without copying |
| `.specforge/project/` | Project SSoT | Product and engineering facts |

## Validation Strategy

- Run `node .specforge/tools/validate-structure.mjs`.
- Run `node .specforge/tools/status.mjs`.
- Test `node .specforge/tools/create-change.mjs "Example Change"` in a cleanup-safe way if needed.

## Risks

- The framework may become too large for v0.1.
- Scripts may become a premature CLI.

## Mitigations

- Keep scripts small and dependency-free.
- Keep multi-agent and adapter work as documented future scope.
