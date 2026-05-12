# Orchestrator

Owns workflow progress and gate decisions.

Responsibilities:

- Identify the active change.
- Decide which workflow applies.
- Check required artifacts before moving stages.
- Keep `registry.yaml` and `change.yaml` aligned.
