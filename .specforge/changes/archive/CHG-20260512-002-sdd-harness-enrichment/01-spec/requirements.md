# Requirements

## Boundary

### Owns

- `.specforge/` rules, skills, command cards, and templates.
- `docs/` reference and architecture notes.
- `.specforge/tools/` lightweight local utilities.
- `.specforge/project/` SSoT updates.

### Does Not Own

- Full CLI packaging.
- External agent runtime integration.
- Full schema or checker framework.

## Functional Requirements

- WHEN a user starts new work, THE SYSTEM SHALL provide discovery guidance that routes the work to the right workflow.
- WHEN a change is specified, THE SYSTEM SHALL make ownership boundaries, dependencies, non-goals, and acceptance criteria explicit.
- WHEN tasks are generated, THE SYSTEM SHALL include task-local boundary and dependency annotations.
- WHEN validation runs, THE SYSTEM SHALL check both required structure and approved gate evidence.
- WHEN users need current state, THE SYSTEM SHALL provide a local status command.

## Non-functional Requirements

- The enrichment must remain file-native and dependency-light.
- The workflow must preserve the v0.1 scope and avoid premature multi-agent runtime work.
- The templates must be readable enough for human phase-gate review.

## Out of Scope

- Branch automation.
- Remote CI setup.
- JSON schema enforcement.
- Adapters for Kiro, Claude Code, Cursor, or OpenCode.

## Acceptance Criteria

| Criterion | Verification |
|---|---|
| Rules include boundary, context, gate, and spec-quality guidance | Files exist under `.specforge/rules/` |
| Templates include boundary, EARS, task dependency, and review checklists | Template inspection |
| Reference synthesis exists | `docs/research/sdd-reference-synthesis.md` |
| Project SSoT records positioning and validation model | `.specforge/project/product/positioning.md`, `.specforge/project/engineering/validation-model.md` |
| Local commands exist | `node .specforge/tools/validate-structure.mjs`, `node .specforge/tools/status.mjs`, `npm run new:change` |
| Validation passes | `node .specforge/tools/validate-structure.mjs` |
