# Runtime Hooks

Hooks are lifecycle extension points. Defaults are noop so core tools remain stable; business projects may override hook files after onboard.

`core/hooks/events/` is the single hook mother copy. Starter generation
copies these files to `.specforge/core/hooks/events/`; business projects customize
hooks by editing those generated files in place. There is no separate
source-workspace hook overlay.

## Interface

Each hook exports both `run(payload)` and a default function. Returning `{ ok: false, message }` blocks pre hooks. Post hook failures are warnings unless the tool is run in strict mode.

## Hooks

- `pre-gate.mjs`: called by `tools/gate.mjs` before a gate update.
- `post-gate.mjs`: called by `tools/gate.mjs` after a gate update.
- `pre-implement.mjs`: reserved for implementation runners before implementation starts.
- `post-implement.mjs`: reserved for implementation runners after implementation evidence is written.
- `pre-close.mjs`: called by `tools/archive-work.mjs` before archive.
- `on-close.mjs`: called by `tools/archive-work.mjs` after archive.
