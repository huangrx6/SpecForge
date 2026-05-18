# Runtime Hooks

Hooks are lifecycle extension points. Defaults are noop so core tools remain stable; business projects may override hook files after onboard.

`core/hooks/events/` is the default hook mother copy. Starter generation copies
these files to `.specforge/core/hooks/events/`. Business projects put overrides
in `.specforge/hooks/local/` so local integrations do not modify core runtime files.

## Interface

Each hook exports both `run(payload)` and a default function. Returning `{ ok: false, message }` blocks pre hooks. Post hook failures are warnings unless the tool is run in strict mode.

## Hooks

- `pre-gate.mjs`: called by `scripts/gate.mjs` before a gate update.
- `post-gate.mjs`: called by `scripts/gate.mjs` after a gate update.
- `pre-implement.mjs`: reserved for implementation runners before implementation starts.
- `post-implement.mjs`: reserved for implementation runners after implementation evidence is written.
- `pre-close.mjs`: called by `scripts/archive-work.mjs` before archive.
- `on-close.mjs`: called by `scripts/archive-work.mjs` after archive.
