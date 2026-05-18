# Starter Snapshot

This directory intentionally contains the generated `.specforge/` snapshot used
when initializing a business project. The payload is hidden by name, so a plain
directory listing may look empty.

Inspect it with:

```bash
find starter/.specforge -maxdepth 2 -print
```

Do not edit this snapshot by hand. Update `core/` or
`core/starter.manifest.json`, then run:

```bash
npm run sync:starter
```
