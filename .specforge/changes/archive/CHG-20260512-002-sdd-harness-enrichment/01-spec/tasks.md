# Tasks

## Parallel Waves

| Wave | Goal | Tasks |
|---|---|---|
| P0 | Research and rules | T001-T003 |
| P1 | Templates and scripts | T004-T007 |
| P2 | SSoT and verification | T008-T010 |

## Task List

- [x] T001 [P0] Capture external SDD reference synthesis.
  _Boundary:_ `docs/research/`
  _Depends:_ none
  _Verification:_ synthesis file exists and lists adopted/deferred ideas.

- [x] T002 [P0] Add boundary, context, gate, and spec-quality rules.
  _Boundary:_ `.specforge/rules/`
  _Depends:_ T001
  _Verification:_ rules index links all new rules.

- [x] T003 [P0] Expand discovery and add planning/status skills.
  _Boundary:_ `.specforge/skills/`
  _Depends:_ T002
  _Verification:_ skills describe inputs, outputs, and completion criteria.

- [x] T004 [P1] Strengthen templates for EARS, boundaries, dependencies, and review checklists.
  _Boundary:_ `.specforge/templates/`
  _Depends:_ T002
  _Verification:_ templates include explicit sections for the new rules.

- [x] T005 [P1] Add command cards.
  _Boundary:_ `.specforge/commands/`
  _Depends:_ T003
  _Verification:_ command cards describe reads, writes, and stop conditions.

- [x] T006 [P1] Add local status and change scaffolding scripts.
  _Boundary:_ `.specforge/tools/`, `package.json`
  _Depends:_ T004
  _Verification:_ `node .specforge/tools/status.mjs` works.

- [x] T007 [P1] Enrich validation script.
  _Boundary:_ `.specforge/tools/validate-structure.mjs`
  _Depends:_ T004
  _Verification:_ `node .specforge/tools/validate-structure.mjs` checks required paths and gate evidence.

- [x] T008 [P2] Update project SSoT.
  _Boundary:_ `.specforge/project/`
  _Depends:_ T001-T007
  _Verification:_ positioning, validation model, architecture, feature list, and ADRs updated.

- [x] T009 [P2] Run validation and status commands.
  _Boundary:_ `05-verification/`
  _Depends:_ T006-T008
  _Verification:_ reports record command output.

- [x] T010 [P2] Complete review and SSoT sync records.
  _Boundary:_ `04-code-review/`, `06-closure/`
  _Depends:_ T009
  _Verification:_ change gates are updated.
