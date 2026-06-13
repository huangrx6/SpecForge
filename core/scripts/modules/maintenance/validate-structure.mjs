import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { effectiveSchema, layout, parseRegistryEntries, parseField, templateByOutput, validateSchema } from "../../lib/specforge.mjs";

const root = process.cwd();
const errors = [];
const workflowIds = ["standard", "feature", "lite", "bugfix", "issue", "refactor", "discovery"];

const sourceRequiredPaths = [
  "skills/sf-router/SKILL.md",
  "skills/sf-onboard/SKILL.md",
  "skills/sf-steering/SKILL.md",
  "skills/sf-intake/SKILL.md",
  "skills/sf-brainstorm/SKILL.md",
  "skills/sf-discovery/SKILL.md",
  "skills/sf-prd/SKILL.md",
  "skills/sf-requirements/SKILL.md",
  "skills/sf-ui-design/SKILL.md",
  "skills/sf-tech-design/SKILL.md",
  "skills/sf-tasking/SKILL.md",
  "skills/sf-spec-review/SKILL.md",
  "skills/sf-implement/SKILL.md",
  "skills/sf-code-review/SKILL.md",
  "skills/sf-verify/SKILL.md",
  "skills/sf-wiki/SKILL.md",
  "skills/sf-close/SKILL.md",
  "skills/sf-doctor/SKILL.md",
  "skills/sf-work/SKILL.md",
  "skills/sf-report/SKILL.md",
  "skills/README.md",
  "skills/catalog.json",
  "skills/sf-brainstorm/skill-package.json",
  "skills/sf-brainstorm/commands.json",
  "skills/sf-close/skill-package.json",
  "skills/sf-close/commands.json",
  "skills/sf-code-review/skill-package.json",
  "skills/sf-code-review/commands.json",
  "skills/sf-discovery/skill-package.json",
  "skills/sf-discovery/commands.json",
  "skills/sf-doctor/skill-package.json",
  "skills/sf-doctor/commands.json",
  "skills/sf-implement/skill-package.json",
  "skills/sf-implement/commands.json",
  "skills/sf-intake/skill-package.json",
  "skills/sf-intake/commands.json",
  "skills/sf-onboard/skill-package.json",
  "skills/sf-onboard/commands.json",
  "skills/sf-prd/skill-package.json",
  "skills/sf-prd/commands.json",
  "skills/sf-requirements/skill-package.json",
  "skills/sf-requirements/commands.json",
  "skills/sf-router/skill-package.json",
  "skills/sf-router/commands.json",
  "skills/sf-spec-review/skill-package.json",
  "skills/sf-spec-review/commands.json",
  "skills/sf-steering/skill-package.json",
  "skills/sf-steering/commands.json",
  "skills/sf-tasking/skill-package.json",
  "skills/sf-tasking/commands.json",
  "skills/sf-tech-design/skill-package.json",
  "skills/sf-tech-design/commands.json",
  "skills/sf-ui-design/skill-package.json",
  "skills/sf-ui-design/commands.json",
  "skills/sf-verify/skill-package.json",
  "skills/sf-verify/commands.json",
  "skills/sf-wiki/skill-package.json",
  "skills/sf-wiki/commands.json",
  "skills/sf-work/skill-package.json",
  "skills/sf-work/commands.json",
  "skills/sf-report/skill-package.json",
  "skills/sf-report/commands.json",
  "skills/sf-brainstorm/stages/brainstorm/SKILL.md",
  "skills/sf-close/stages/closure/SKILL.md",
  "skills/sf-code-review/stages/code-review/SKILL.md",
  "skills/sf-discovery/stages/discovery/SKILL.md",
  "skills/sf-discovery/stages/gap-report/SKILL.md",
  "skills/sf-discovery/stages/research/SKILL.md",
  "skills/sf-doctor/stages/status/SKILL.md",
  "skills/sf-implement/stages/implementation/SKILL.md",
  "skills/sf-requirements/stages/requirements/SKILL.md",
  "skills/sf-spec-review/stages/spec-review/SKILL.md",
  "skills/sf-steering/stages/steering/SKILL.md",
  "skills/sf-tasking/stages/task-planning/SKILL.md",
  "skills/sf-tech-design/stages/technical-design/SKILL.md",
  "skills/sf-ui-design/stages/ui-design/SKILL.md",
  "skills/sf-verify/stages/verification/SKILL.md",
  "skills/sf-wiki/stages/wiki-sync/SKILL.md",
  "skills/sf-tech-design/stages/technical-design/frontend-design.md",
  "skills/sf-tech-design/stages/technical-design/backend-design.md",
  "skills/sf-tech-design/stages/technical-design/domain-design.md",
  "skills/sf-tech-design/stages/technical-design/api-design.md",
  "skills/sf-tech-design/stages/technical-design/data-design.md",
  "skills/sf-tech-design/stages/technical-design/nfr-design.md",
  "skills/sf-tech-design/references/architecture-contract.md",
  "skills/sf-router/workflow/README.md",
  "skills/sf-router/workflow/drift-rules.json",
  "skills/sf-router/workflow/eval-fixtures.json",
  "skills/sf-router/workflow/score-rubric.json",
  "core/AGENTS.md",
  "core/README.md",
  "core/manifest.yaml",
  "core/starter.manifest.json",
  "core/scripts/README.md",
  "core/scripts/modules/README.md",
  "core/scripts/modules/routing/README.md",
  "core/scripts/modules/authoring/README.md",
  "core/scripts/modules/quality/README.md",
  "core/scripts/modules/gates/README.md",
  "core/scripts/modules/reporting/README.md",
  "core/scripts/modules/code-intelligence/README.md",
  "core/scripts/modules/maintenance/README.md",
  "core/scripts/modules/archive/README.md",
  "core/standards/index.md",
  "core/standards/README.md",
  "core/standards/workflow.md",
  "core/standards/operating-model.md",
  "core/standards/product.md",
  "core/standards/design.md",
  "core/standards/engineering.md",
  "core/standards/code-intelligence.md",
  "core/standards/ai-toolkit.md",
  "core/standards/stage-playbook.md",
  "core/standards/wiki.md",
  "core/profiles/README.md",
  "core/profiles/frontend/react-vite-tailwind-ts.md",
  "core/profiles/frontend/next-app-router-tailwind-ts.md",
  "core/profiles/frontend/vue-vite-tailwind-ts.md",
  "core/profiles/backend/python-fastapi.md",
  "core/profiles/backend/spring-boot-java.md",
  "core/profiles/backend/golang-standard.md",
  "core/profiles/backend/next-api-routes.md",
  "core/profiles/database/rdbms-postgresql.md",
  "core/profiles/database/rdbms-mysql.md",
  "core/profiles/database/embedded-sqlite.md",
  "core/profiles/capabilities/processing-ai-jobs.md",
  "core/profiles/capabilities/architecture-patterns.md",
  "core/profiles/capabilities/security.md",
  "core/profiles/capabilities/observability.md",
  "core/profiles/capabilities/testing.md",
  "core/workflows/definitions/standard.yaml",
  "core/workflows/README.md",
  "core/workflows/definitions/feature.yaml",
  "core/workflows/definitions/lite.yaml",
  "core/workflows/definitions/bugfix.yaml",
  "core/workflows/definitions/issue.yaml",
  "core/workflows/definitions/refactor.yaml",
  "core/workflows/definitions/discovery.yaml",
  "core/artifacts/schemas/standard.json",
  "core/artifacts/schemas/feature.json",
  "core/artifacts/schemas/lite.json",
  "core/artifacts/schemas/bugfix.json",
  "core/artifacts/schemas/issue.json",
  "core/artifacts/schemas/refactor.json",
  "core/artifacts/schemas/discovery.json",
  "core/artifacts/templates/brief.md",
  "core/artifacts/templates/brainstorm.md",
  "core/artifacts/templates/prd.md",
  "core/artifacts/templates/work.yaml",
  "core/artifacts/templates/original-request.md",
  "core/artifacts/templates/gap-report.md",
  "core/artifacts/templates/research.md",
  "core/artifacts/templates/requirements.md",
  "core/artifacts/templates/ui-design.md",
  "core/artifacts/templates/technical-design.md",
  "core/artifacts/templates/tasks.md",
  "core/artifacts/templates/spec-review.md",
  "core/artifacts/templates/implementation-plan.md",
  "core/artifacts/templates/implementation-report.md",
  "core/artifacts/templates/changed-files.md",
  "core/artifacts/templates/code-review.md",
  "core/artifacts/templates/test-cases.md",
  "core/artifacts/templates/verification-report.md",
  "core/artifacts/templates/ci-result.md",
  "core/artifacts/templates/wiki-sync.md",
  "core/artifacts/templates/release.md",
  "core/artifacts/templates/rollback.md",
  "core/scripts/lib/specforge.mjs",
  "core/scripts/lib/diagnostics.mjs",
  "core/scripts/lib/test-case-quality.mjs",
  "core/scripts/archive-work.mjs",
  "core/scripts/artifact-graph-status.mjs",
  "core/scripts/artifact-quality.mjs",
  "core/scripts/codebase-index.mjs",
  "core/scripts/codebase-map.mjs",
  "core/scripts/closure-quality.mjs",
  "core/scripts/create-work.mjs",
  "core/scripts/create-artifact.mjs",
  "core/scripts/decision-checkpoints.mjs",
  "core/scripts/decision-brief.mjs",
  "core/scripts/decision-quality.mjs",
  "core/scripts/evidence-summary.mjs",
  "core/scripts/framework-audit.mjs",
  "core/scripts/instructions.mjs",
  "core/scripts/gate.mjs",
  "core/scripts/gate-preflight.mjs",
  "core/scripts/handoff-summary.mjs",
  "core/scripts/implementation-quality.mjs",
  "core/scripts/quality-suite.mjs",
  "core/scripts/test-case-quality.mjs",
  "core/scripts/doctor.mjs",
  "core/scripts/render-work-report.mjs",
  "core/scripts/self-test.mjs",
  "core/scripts/source-quality.mjs",
  "core/scripts/status.mjs",
  "core/scripts/stage-contract.mjs",
  "core/scripts/sync-wiki.mjs",
  "core/scripts/wiki-quality.mjs",
  "core/scripts/traceability-summary.mjs",
  "core/scripts/workflow-audit.mjs",
  "core/scripts/workflow-health.mjs",
  "core/scripts/workflow-package.mjs",
  "core/scripts/sync-starter.mjs",
  "core/scripts/update-skills.mjs",
  "core/scripts/validate-external-skills.mjs",
  "core/scripts/validate-skills.mjs",
  "core/scripts/validate-structure.mjs",
  "core/scripts/lib/artifact-quality.mjs",
  "core/scripts/lib/artifact-summary.mjs",
  "core/scripts/lib/action-board.mjs",
  "core/scripts/lib/closure-quality.mjs",
  "core/scripts/lib/decision-quality.mjs",
  "core/scripts/lib/evidence.mjs",
  "core/scripts/lib/implementation-quality.mjs",
  "core/scripts/lib/quality-suite.mjs",
  "core/scripts/lib/test-case-quality.mjs",
  "core/scripts/lib/source-quality.mjs",
  "core/scripts/lib/stage-contracts.mjs",
  "core/scripts/lib/traceability.mjs",
  "core/scripts/lib/wiki-quality.mjs",
  "core/scripts/lib/gate-preflight.mjs",
  "core/scripts/lib/workflow-health.mjs",
  "core/skills/README.md",
  "core/skills/ORCHESTRATION.md",
  "core/skills/VETTING.md",
  "core/skills/registry.json",
  "core/hooks/events/README.md",
  "core/hooks/events/pre-gate.mjs",
  "core/hooks/events/post-gate.mjs",
  "core/hooks/events/pre-close.mjs",
  "core/hooks/events/on-close.mjs",
  "starter/.specforge/wiki/00-index.md",
  "starter/.specforge/wiki/01-project-overview.md",
  "starter/.specforge/wiki/03-architecture.md",
  "starter/.specforge/work/inbox",
  "starter/.specforge/work/active",
  "starter/.specforge/work/archive",
  "starter/README.md",
  "starter/.specforge/AGENTS.md",
  "starter/.specforge/core/standards/index.md",
  "starter/.specforge/core/standards/workflow.md",
  "starter/.specforge/core/standards/operating-model.md",
  "starter/.specforge/core/standards/product.md",
  "starter/.specforge/core/standards/design.md",
  "starter/.specforge/core/standards/engineering.md",
  "starter/.specforge/core/standards/code-intelligence.md",
  "starter/.specforge/core/standards/ai-toolkit.md",
  "starter/.specforge/core/standards/stage-playbook.md",
  "starter/.specforge/core/standards/wiki.md",
  "starter/.specforge/core/scripts/modules/README.md",
  "starter/.specforge/core/scripts/modules/routing/README.md",
  "starter/.specforge/core/scripts/modules/authoring/README.md",
  "starter/.specforge/core/scripts/modules/quality/README.md",
  "starter/.specforge/core/scripts/modules/gates/README.md",
  "starter/.specforge/core/scripts/modules/reporting/README.md",
  "starter/.specforge/core/scripts/modules/code-intelligence/README.md",
  "starter/.specforge/core/scripts/modules/maintenance/README.md",
  "starter/.specforge/core/scripts/modules/archive/README.md",
  "starter/.specforge/core/profiles/README.md",
  "starter/.specforge/core/profiles/frontend/react-vite-tailwind-ts.md",
  "starter/.specforge/core/profiles/frontend/next-app-router-tailwind-ts.md",
  "starter/.specforge/core/profiles/frontend/vue-vite-tailwind-ts.md",
  "starter/.specforge/core/profiles/backend/python-fastapi.md",
  "starter/.specforge/core/profiles/backend/spring-boot-java.md",
  "starter/.specforge/core/profiles/backend/golang-standard.md",
  "starter/.specforge/core/profiles/backend/next-api-routes.md",
  "starter/.specforge/core/profiles/database/rdbms-postgresql.md",
  "starter/.specforge/core/profiles/database/rdbms-mysql.md",
  "starter/.specforge/core/profiles/database/embedded-sqlite.md",
  "starter/.specforge/core/profiles/capabilities/processing-ai-jobs.md",
  "starter/.specforge/core/profiles/capabilities/architecture-patterns.md",
  "starter/.specforge/core/profiles/capabilities/security.md",
  "starter/.specforge/core/profiles/capabilities/observability.md",
  "starter/.specforge/core/profiles/capabilities/testing.md",
  "starter/.specforge/core/artifacts/templates/requirements.md",
  "starter/.specforge/core/artifacts/templates/brainstorm.md",
  "starter/.specforge/core/artifacts/templates/prd.md",
  "starter/.specforge/core/artifacts/templates/ui-design.md",
  "starter/.specforge/core/artifacts/templates/technical-design.md",
  "starter/.specforge/core/artifacts/templates/test-cases.md",
  "starter/.specforge/core/artifacts/templates/gap-report.md",
  "starter/.specforge/core/artifacts/templates/research.md",
  "starter/.specforge/skills/catalog.json",
  "starter/.specforge/skills/sf-router/skill-package.json",
  "starter/.specforge/skills/sf-router/workflow/README.md",
  "starter/.specforge/skills/sf-router/workflow/drift-rules.json",
  "starter/.specforge/skills/sf-router/workflow/eval-fixtures.json",
  "starter/.specforge/skills/sf-router/workflow/score-rubric.json",
  "starter/.specforge/skills/sf-brainstorm/stages/brainstorm/SKILL.md",
  "starter/.specforge/skills/sf-tech-design/stages/technical-design/SKILL.md",
  "starter/.specforge/skills/sf-tech-design/stages/technical-design/frontend-design.md",
  "starter/.specforge/skills/sf-tech-design/stages/technical-design/backend-design.md",
  "starter/.specforge/skills/sf-tech-design/references/architecture-contract.md",
  "starter/.specforge/core/scripts/doctor.mjs",
  "starter/.specforge/core/scripts/codebase-index.mjs",
  "starter/.specforge/core/scripts/codebase-map.mjs",
  "starter/.specforge/core/scripts/create-work.mjs",
  "starter/.specforge/core/scripts/framework-audit.mjs",
  "starter/.specforge/core/scripts/validate-external-skills.mjs",
  "starter/.specforge/core/skills/ORCHESTRATION.md",
  "cli/specforge.mjs",
];

const projectRequiredPaths = [
  ".specforge/AGENTS.md",
  ".specforge/core/README.md",
  ".specforge/manifest.yaml",
  ".specforge/registry.yaml",
  ".specforge/core/standards/index.md",
  ".specforge/core/standards/README.md",
  ".specforge/core/standards/workflow.md",
  ".specforge/core/standards/operating-model.md",
  ".specforge/core/standards/product.md",
  ".specforge/core/standards/design.md",
  ".specforge/core/standards/engineering.md",
  ".specforge/core/standards/code-intelligence.md",
  ".specforge/core/standards/ai-toolkit.md",
  ".specforge/core/standards/stage-playbook.md",
  ".specforge/core/standards/wiki.md",
  ".specforge/core/profiles/README.md",
  ".specforge/core/profiles/frontend/react-vite-tailwind-ts.md",
  ".specforge/core/profiles/frontend/next-app-router-tailwind-ts.md",
  ".specforge/core/profiles/frontend/vue-vite-tailwind-ts.md",
  ".specforge/core/profiles/backend/python-fastapi.md",
  ".specforge/core/profiles/backend/spring-boot-java.md",
  ".specforge/core/profiles/backend/golang-standard.md",
  ".specforge/core/profiles/backend/next-api-routes.md",
  ".specforge/core/profiles/database/rdbms-postgresql.md",
  ".specforge/core/profiles/database/rdbms-mysql.md",
  ".specforge/core/profiles/database/embedded-sqlite.md",
  ".specforge/core/profiles/capabilities/processing-ai-jobs.md",
  ".specforge/core/profiles/capabilities/architecture-patterns.md",
  ".specforge/core/profiles/capabilities/security.md",
  ".specforge/core/profiles/capabilities/observability.md",
  ".specforge/core/profiles/capabilities/testing.md",
  ".specforge/core/workflows/definitions/standard.yaml",
  ".specforge/core/workflows/README.md",
  ".specforge/core/workflows/definitions/feature.yaml",
  ".specforge/core/workflows/definitions/lite.yaml",
  ".specforge/core/workflows/definitions/bugfix.yaml",
  ".specforge/core/workflows/definitions/issue.yaml",
  ".specforge/core/workflows/definitions/refactor.yaml",
  ".specforge/core/workflows/definitions/discovery.yaml",
  ".specforge/core/artifacts/schemas/standard.json",
  ".specforge/core/artifacts/schemas/feature.json",
  ".specforge/core/artifacts/schemas/lite.json",
  ".specforge/core/artifacts/schemas/bugfix.json",
  ".specforge/core/artifacts/schemas/issue.json",
  ".specforge/core/artifacts/schemas/refactor.json",
  ".specforge/core/artifacts/schemas/discovery.json",
  ".specforge/core/artifacts/templates/brief.md",
  ".specforge/core/artifacts/templates/brainstorm.md",
  ".specforge/core/artifacts/templates/prd.md",
  ".specforge/core/artifacts/templates/work.yaml",
  ".specforge/core/artifacts/templates/original-request.md",
  ".specforge/core/artifacts/templates/requirements.md",
  ".specforge/core/artifacts/templates/ui-design.md",
  ".specforge/core/artifacts/templates/technical-design.md",
  ".specforge/core/artifacts/templates/tasks.md",
  ".specforge/core/artifacts/templates/gap-report.md",
  ".specforge/core/artifacts/templates/research.md",
  ".specforge/core/artifacts/templates/spec-review.md",
  ".specforge/core/artifacts/templates/implementation-plan.md",
  ".specforge/core/artifacts/templates/implementation-report.md",
  ".specforge/core/artifacts/templates/changed-files.md",
  ".specforge/core/artifacts/templates/code-review.md",
  ".specforge/core/artifacts/templates/test-cases.md",
  ".specforge/core/artifacts/templates/verification-report.md",
  ".specforge/core/artifacts/templates/ci-result.md",
  ".specforge/core/artifacts/templates/wiki-sync.md",
  ".specforge/core/artifacts/templates/release.md",
  ".specforge/core/artifacts/templates/rollback.md",
  ".specforge/skills/catalog.json",
  ".specforge/skills/sf-report/SKILL.md",
  ".specforge/skills/sf-report/skill-package.json",
  ".specforge/skills/sf-report/commands.json",
  ".specforge/skills/sf-router/skill-package.json",
  ".specforge/skills/sf-router/workflow/README.md",
  ".specforge/skills/sf-router/workflow/drift-rules.json",
  ".specforge/skills/sf-router/workflow/eval-fixtures.json",
  ".specforge/skills/sf-router/workflow/score-rubric.json",
  ".specforge/skills/sf-brainstorm/stages/brainstorm/SKILL.md",
  ".specforge/skills/sf-discovery/stages/discovery/SKILL.md",
  ".specforge/skills/sf-discovery/stages/gap-report/SKILL.md",
  ".specforge/skills/sf-discovery/stages/research/SKILL.md",
  ".specforge/skills/sf-requirements/stages/requirements/SKILL.md",
  ".specforge/skills/sf-ui-design/stages/ui-design/SKILL.md",
  ".specforge/skills/sf-tech-design/stages/technical-design/SKILL.md",
  ".specforge/skills/sf-tech-design/stages/technical-design/frontend-design.md",
  ".specforge/skills/sf-tech-design/stages/technical-design/backend-design.md",
  ".specforge/skills/sf-tech-design/stages/technical-design/domain-design.md",
  ".specforge/skills/sf-tech-design/stages/technical-design/api-design.md",
  ".specforge/skills/sf-tech-design/stages/technical-design/data-design.md",
  ".specforge/skills/sf-tech-design/stages/technical-design/nfr-design.md",
  ".specforge/skills/sf-tech-design/references/architecture-contract.md",
  ".specforge/skills/sf-tasking/stages/task-planning/SKILL.md",
  ".specforge/skills/sf-spec-review/stages/spec-review/SKILL.md",
  ".specforge/skills/sf-implement/stages/implementation/SKILL.md",
  ".specforge/skills/sf-code-review/stages/code-review/SKILL.md",
  ".specforge/skills/sf-verify/stages/verification/SKILL.md",
  ".specforge/skills/sf-wiki/stages/wiki-sync/SKILL.md",
  ".specforge/skills/sf-close/stages/closure/SKILL.md",
  ".specforge/skills/sf-doctor/stages/status/SKILL.md",
  ".specforge/skills/sf-steering/stages/steering/SKILL.md",
  ".specforge/core/scripts/archive-work.mjs",
  ".specforge/core/scripts/README.md",
  ".specforge/core/scripts/modules/README.md",
  ".specforge/core/scripts/modules/routing/README.md",
  ".specforge/core/scripts/modules/authoring/README.md",
  ".specforge/core/scripts/modules/quality/README.md",
  ".specforge/core/scripts/modules/gates/README.md",
  ".specforge/core/scripts/modules/reporting/README.md",
  ".specforge/core/scripts/modules/code-intelligence/README.md",
  ".specforge/core/scripts/modules/maintenance/README.md",
  ".specforge/core/scripts/modules/archive/README.md",
  ".specforge/core/scripts/artifact-graph-status.mjs",
  ".specforge/core/scripts/artifact-quality.mjs",
  ".specforge/core/scripts/codebase-index.mjs",
  ".specforge/core/scripts/codebase-map.mjs",
  ".specforge/core/scripts/closure-quality.mjs",
  ".specforge/core/scripts/create-artifact.mjs",
  ".specforge/core/scripts/create-work.mjs",
  ".specforge/core/scripts/decision-checkpoints.mjs",
  ".specforge/core/scripts/decision-brief.mjs",
  ".specforge/core/scripts/decision-quality.mjs",
  ".specforge/core/scripts/evidence-summary.mjs",
  ".specforge/core/scripts/framework-audit.mjs",
  ".specforge/core/scripts/test-case-quality.mjs",
  ".specforge/core/scripts/doctor.mjs",
  ".specforge/core/scripts/gate.mjs",
  ".specforge/core/scripts/gate-preflight.mjs",
  ".specforge/core/scripts/handoff-summary.mjs",
  ".specforge/core/scripts/implementation-quality.mjs",
  ".specforge/core/scripts/quality-suite.mjs",
  ".specforge/core/scripts/instructions.mjs",
  ".specforge/core/scripts/render-work-report.mjs",
  ".specforge/core/scripts/lib/artifact-quality.mjs",
  ".specforge/core/scripts/lib/artifact-summary.mjs",
  ".specforge/core/scripts/lib/action-board.mjs",
  ".specforge/core/scripts/lib/closure-quality.mjs",
  ".specforge/core/scripts/lib/decision-quality.mjs",
  ".specforge/core/scripts/lib/evidence.mjs",
  ".specforge/core/scripts/lib/implementation-quality.mjs",
  ".specforge/core/scripts/lib/quality-suite.mjs",
  ".specforge/core/scripts/lib/test-case-quality.mjs",
  ".specforge/core/scripts/lib/source-quality.mjs",
  ".specforge/core/scripts/lib/stage-contracts.mjs",
  ".specforge/core/scripts/lib/traceability.mjs",
  ".specforge/core/scripts/lib/wiki-quality.mjs",
  ".specforge/core/scripts/lib/gate-preflight.mjs",
  ".specforge/core/scripts/lib/workflow-health.mjs",
  ".specforge/core/scripts/lib/specforge.mjs",
  ".specforge/core/scripts/lib/diagnostics.mjs",
  ".specforge/core/scripts/self-test.mjs",
  ".specforge/core/scripts/source-quality.mjs",
  ".specforge/core/scripts/status.mjs",
  ".specforge/core/scripts/stage-contract.mjs",
  ".specforge/core/scripts/sync-wiki.mjs",
  ".specforge/core/scripts/wiki-quality.mjs",
  ".specforge/core/scripts/traceability-summary.mjs",
  ".specforge/core/scripts/workflow-audit.mjs",
  ".specforge/core/scripts/workflow-health.mjs",
  ".specforge/core/scripts/workflow-package.mjs",
  ".specforge/core/scripts/update-skills.mjs",
  ".specforge/core/scripts/validate-external-skills.mjs",
  ".specforge/core/scripts/validate-structure.mjs",
  ".specforge/core/skills/README.md",
  ".specforge/core/skills/ORCHESTRATION.md",
  ".specforge/core/skills/VETTING.md",
  ".specforge/core/skills/registry.json",
  ".specforge/core/hooks/events/README.md",
  ".specforge/core/hooks/events/pre-gate.mjs",
  ".specforge/core/hooks/events/post-gate.mjs",
  ".specforge/core/hooks/events/pre-close.mjs",
  ".specforge/core/hooks/events/on-close.mjs",
  ".specforge/work/inbox",
  ".specforge/work/active",
  ".specforge/work/archive",
];

const requiredPaths = layout.kind === "source" ? sourceRequiredPaths : projectRequiredPaths;
const requiredAnyPathGroups =
  layout.kind === "project"
    ? [
        [".specforge/wiki/00-index.md", ".specforge/wiki/index.md"],
        [".specforge/wiki/01-project-overview.md", ".specforge/wiki/project-overview.md"],
        [".specforge/wiki/03-architecture.md", ".specforge/wiki/architecture.md"],
      ]
    : [];

function exists(relativePath) {
  return existsSync(join(root, relativePath));
}

function read(relativePath) {
  return readFileSync(join(root, relativePath), "utf8");
}

for (const path of requiredPaths) {
  if (!exists(path)) errors.push(`Missing required path: ${path}`);
}

for (const paths of requiredAnyPathGroups) {
  if (!paths.some((path) => exists(path))) errors.push(`Missing required path: ${paths.join(" or ")}`);
}

function loadSchema(workflow) {
  const schemaPath = `${layout.schemas}/${workflow}.json`;
  if (!exists(schemaPath)) {
    errors.push(`Missing workflow schema: ${schemaPath}`);
    return null;
  }
  try {
    return JSON.parse(read(schemaPath));
  } catch (error) {
    errors.push(`${schemaPath}: invalid JSON (${error.message})`);
    return null;
  }
}

function sectionExists(content, section) {
  const escaped = section.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`^#{1,6}\\s+.*${escaped}`, "im").test(content) || content.includes(section);
}

function validateQualityPolicyTemplates(schema, schemaPath) {
  for (const [index, check] of (schema.quality_policy?.section_checks ?? []).entries()) {
    if (!check?.path || !Array.isArray(check.sections)) continue;
    const templateName = templateByOutput.get(check.path);
    if (!templateName) continue;
    const templatePath = `${layout.templates}/${templateName}`;
    if (!exists(templatePath)) continue;
    const template = read(templatePath);
    const missing = check.sections.filter((section) => !sectionExists(template, section));
    if (missing.length > 0) {
      errors.push(
        `${schemaPath}: quality_policy.section_checks[${index}] references sections missing from template ${templatePath}: ${missing.join(", ")}`,
      );
    }
  }
}

function getGateBlock(yaml, gateName) {
  const markerMatch = yaml.match(new RegExp(`(?:^|\\r?\\n)  ${gateName}:\\r?\\n`));
  if (!markerMatch || markerMatch.index === undefined) return null;
  const rest = yaml.slice(markerMatch.index + markerMatch[0].length);
  const nextGate = rest.search(/\r?\n  [a-z_]+:\r?\n/);
  return nextGate === -1 ? rest : rest.slice(0, nextGate);
}

function outputsExist(relativeBase, outputs) {
  return outputs.every((output) => exists(`${relativeBase}/${output}`));
}

function anyOutputExists(relativeBase, outputs) {
  return outputs.some((output) => exists(`${relativeBase}/${output}`));
}

function artifactOutputsComplete(relativeBase, artifact) {
  return outputsExist(relativeBase, artifact.outputs);
}

function artifactOutputsPartial(relativeBase, artifact) {
  const hasAny = anyOutputExists(relativeBase, artifact.outputs);
  const hasAll = outputsExist(relativeBase, artifact.outputs);
  return hasAny && !hasAll;
}

function validateGates(relativeBase, yaml, schema, requireApproved) {
  for (const artifact of schema.artifacts.filter((item) => item.gate)) {
    const block = getGateBlock(yaml, artifact.gate);
    if (!block) {
      errors.push(`${relativeBase}: missing gate ${artifact.gate}`);
      continue;
    }
    const status = block.match(/status:\s*([A-Z_]+)/)?.[1];
    const evidence = block.match(/evidence:\s*(.+)/)?.[1]?.trim();
    if (!status) errors.push(`${relativeBase}: gate ${artifact.gate} is missing status`);
    if (requireApproved && status !== "APPROVED") {
      errors.push(`${relativeBase}: archived gate ${artifact.gate} must be APPROVED`);
    }
    if (status === "APPROVED") {
      if (!evidence || evidence === "null") {
        errors.push(`${relativeBase}: approved gate ${artifact.gate} has no evidence`);
      } else if (!exists(`${relativeBase}/${evidence}`)) {
        errors.push(`${relativeBase}: approved gate ${artifact.gate} evidence does not exist: ${evidence}`);
      }
    }
  }
}

function validateWorkItem(relativeBase, lifecycle) {
  if (!exists(`${relativeBase}/work.yaml`)) {
    errors.push(`${relativeBase}: missing work.yaml`);
    return;
  }

  const yaml = read(`${relativeBase}/work.yaml`);
  const workflow = parseField(yaml, "workflow") || "standard";
  const status = parseField(yaml, "status");
  const stage = parseField(yaml, "stage");
  const id = parseField(yaml, "id");
  const rawSchema = loadSchema(workflow);
  if (!rawSchema) return;
  const schema = effectiveSchema(rawSchema, yaml);

  if (!relativeBase.endsWith(id)) errors.push(`${relativeBase}: work.yaml id does not match directory name ${id}`);
  const stageSet = new Set(schema.artifacts.map((artifact) => artifact.stage));
  if (!stageSet.has(stage)) errors.push(`${relativeBase}: unknown stage ${stage}`);

  const isArchived = lifecycle === "archive" || status === "ARCHIVED";
  if (lifecycle === "active" && status === "ARCHIVED") errors.push(`${relativeBase}: active work item must not have ARCHIVED status`);
  if (lifecycle === "archive" && status !== "ARCHIVED") errors.push(`${relativeBase}: archived work item must have ARCHIVED status`);

  for (const artifact of schema.artifacts) {
    const hasAll = artifactOutputsComplete(relativeBase, artifact);
    const hasPartial = artifactOutputsPartial(relativeBase, artifact);
    if (isArchived && !hasAll) errors.push(`${relativeBase}: archived work item missing artifact ${artifact.id}`);
    else if (hasPartial && !hasAll) errors.push(`${relativeBase}: partially written artifact ${artifact.id}`);
  }

  validateGates(relativeBase, yaml, schema, isArchived);
}

const manifestPath = layout.kind === "source" ? `${layout.runtime}/manifest.yaml` : `${layout.workspace}/manifest.yaml`;
const manifest = exists(manifestPath) ? read(manifestPath) : "";
for (const workflowId of workflowIds) {
  if (!manifest.includes(`    - ${workflowId}`)) errors.push(`${manifestPath}: workflow.available missing ${workflowId}`);

  const workflowPath = `${layout.workflows}/${workflowId}.yaml`;
  if (exists(workflowPath)) {
    const workflowDescriptorId = parseField(read(workflowPath), "id");
    if (workflowDescriptorId !== workflowId) {
      errors.push(`${workflowPath}: id must be ${workflowId}, got ${workflowDescriptorId || "missing"}`);
    }
  }

  const schema = loadSchema(workflowId);
  if (!schema) continue;
  const schemaPath = `${layout.schemas}/${workflowId}.json`;
  if (schema.id !== workflowId) errors.push(`${schemaPath}: id must be ${workflowId}, got ${schema.id || "missing"}`);
  for (const error of validateSchema(schema, schemaPath)) errors.push(error);
  validateQualityPolicyTemplates(schema, schemaPath);
}

for (const kind of ["active", "archive"]) {
  const workItemsRoot = `${layout.workItems}/${kind}`;
  if (!exists(workItemsRoot)) continue;
  for (const entry of readdirSync(join(root, workItemsRoot), { withFileTypes: true })) {
    if (entry.isDirectory() && exists(`${workItemsRoot}/${entry.name}/work.yaml`)) {
      validateWorkItem(`${workItemsRoot}/${entry.name}`, kind);
    }
  }
}

const registry = exists(layout.registry) ? read(layout.registry) : "";

for (const match of registry.matchAll(/^\s*path:\s*(.+)$/gm)) {
  const registryPath = match[1].trim();
  if (!exists(registryPath)) errors.push(`registry path does not exist: ${registryPath}`);
}

for (const [sectionName, kind] of [["active", "active"], ["archive", "archive"]]) {
  const expectedSegment = `/${kind}/`;
  const entries = parseRegistryEntries(registry, sectionName);
  const seen = new Set();

  for (const entry of entries) {
    if (seen.has(entry.id)) errors.push(`registry ${sectionName} has duplicate id: ${entry.id}`);
    seen.add(entry.id);
    const expectedPath = `${layout.workItems}/${kind}/${entry.id}`;
    if (!entry.path.includes(expectedSegment)) {
      errors.push(`registry ${sectionName} entry points to wrong lifecycle path: ${entry.path}`);
    }
    if (entry.path !== expectedPath) {
      errors.push(`registry ${sectionName} entry path mismatch for ${entry.id}: expected ${expectedPath}, got ${entry.path}`);
    }
  }

  const directory = join(root, layout.workItems, kind);
  if (existsSync(directory)) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (entry.isDirectory() && exists(`${layout.workItems}/${kind}/${entry.name}/work.yaml`) && !seen.has(entry.name)) {
        errors.push(`registry ${sectionName} missing directory entry: ${entry.name}`);
      }
    }
  }
}

if (layout.kind === "source" && exists("starter")) {
  const syncCheck = spawnSync(process.execPath, [`${layout.tools}/sync-starter.mjs`, "--check"], {
    cwd: root,
    encoding: "utf8",
  });
  if (syncCheck.status !== 0) {
    const output = `${syncCheck.stdout ?? ""}${syncCheck.stderr ?? ""}`
      .split(/\r?\n/)
      .filter((line) => line.trim().length > 0);
    for (const line of output) errors.push(line);
  }
}

for (const output of templateByOutput.values()) {
  if (!exists(`${layout.templates}/${output}`)) errors.push(`template mapping target missing: ${layout.templates}/${output}`);
}

if (errors.length > 0) {
  console.error("SpecForge validation failed.");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("SpecForge validation passed.");
console.log(`Checked ${requiredPaths.length} required paths for ${layout.kind} layout, workflow schema, registry paths, and work item evidence.`);
