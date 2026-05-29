# Runtime Hooks

Hooks are optional lifecycle extension points for project-specific policy and integrations. Defaults are noop so core tools remain stable; business projects may override hook files after onboard.

`core/hooks/events/` is the default hook mother copy. Starter generation copies
these files to `.specforge/core/hooks/events/`. Business projects put overrides
in `.specforge/hooks/local/` so local integrations do not modify core runtime files.

## Interface

Each hook exports both `run(payload)` and a default function. Returning `{ ok: false, message }` blocks pre hooks. Post hook failures are warnings unless the tool is run in strict mode.

## Active Hooks

- `pre-gate.mjs`: called by `scripts/gate.mjs` before a gate update.
- `post-gate.mjs`: called by `scripts/gate.mjs` after a gate update.
- `pre-close.mjs`: called by `scripts/archive-work.mjs` before archive.
- `on-close.mjs`: called by `scripts/archive-work.mjs` after archive.

## Payloads

`pre-gate.mjs` and `post-gate.mjs` receive:

```js
{
  workItem: "20260529-feature-001-example",
  workItemBase: ".specforge/work/active/20260529-feature-001-example",
  gate: "spec_review",
  status: "APPROVED",
  evidence: "02-spec-review/spec-review-v1.md"
}
```

`pre-close.mjs` receives the active path and target archive path:

```js
{
  workItem: "20260529-feature-001-example",
  workItemBase: ".specforge/work/active/20260529-feature-001-example",
  archiveBase: ".specforge/work/archive/20260529-feature-001-example",
  workflow: "standard"
}
```

`on-close.mjs` receives the same payload after archive, with `workItemBase` changed to the archive path.

## Useful Examples

- Block `APPROVED` gates unless a required evidence file exists or CI passed.
- Send gate changes to Slack, GitHub Issues, Linear, Jira, or an internal audit log.
- Prevent archive if a required release note, rollback note, or wiki sync evidence is missing.
- Copy archived work evidence to an internal compliance location.

Keep hooks small. They should enforce or notify; they should not replace SpecForge artifacts or rewrite work item content behind the user's back.
