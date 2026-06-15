---
name: test-design
description: Deprecated compatibility alias for SpecForge test engineering. Use quality/test-engineering instead whenever verification needs test cases, automation, Playwright flows, project startup, auth planning, or evidence packaging.
---

# Test Design Alias

Deprecated: use `core/skills/quality/test-engineering/SKILL.md`.

This directory remains only for compatibility with older SpecForge artifacts that mention `test-design`. New workflows should read `quality/test-engineering` and write new test engineering artifacts under `05-verification/test-engineering/`.

## Compatibility mapping

| Old concept | New location |
| --- | --- |
| Test design tree | `test-engineering/transforms/spec-to-test-plan.md` and `05-verification/test-engineering/test-design-tree.md` |
| Automation matrix | `test-engineering/references/output-contract.md` and `automation-plan.md` |
| XMind export | Optional sketch only; export Markdown / JSON into `05-verification/test-engineering/` |
| TC / PW matrix | `05-verification/test-cases.md` plus `test-engineering/contracts/*.schema.json` |

## Rule

If an agent reaches this skill, it should immediately switch to `core/skills/quality/test-engineering/SKILL.md` unless it is reading an old artifact that explicitly references `05-verification/test-design/`.
