import { exists, readText } from "./specforge.mjs";

const sourcePaths = [
  "01-spec/requirements.md",
  "01-spec/gap-report.md",
  "01-spec/research.md",
  "01-spec/ui-design.md",
  "01-spec/technical-design.md",
  "04-code-review/code-review-v1.md",
];

const verificationPaths = ["05-verification/test-cases.md", "05-verification/report.md"];
const idPattern = /\b(?:REQ|AC|NFR|GAP|UI|TD|REVIEW|TC|PW)-\d{3}\b/g;
const taskPattern = /^\s*[-*]\s+\[[ xX]\]\s+(T\d{3})\b(.+)$/;
const fieldPattern = /^\s*_(Trace|Verification|TestCase):_\s*(.+)$/i;
const placeholderPattern = /\.\.\.|xxx|待补充|示例|example/i;
const validPolicyModes = new Set(["off", "advisory", "strict"]);

const defaultPolicy = {
  mode: "advisory",
  enforced_gates: [],
  severities: {
    uncovered_sources: "P2",
    tasks_missing_trace: "P2",
    tasks_missing_verification: "P2",
    tasks_without_testcase: "P3",
  },
};

function unique(values) {
  return [...new Set(values)].sort();
}

function idsIn(text) {
  return unique([...String(text ?? "").matchAll(idPattern)].map((match) => match[0]));
}

function readIfExists(workItemBase, path) {
  const fullPath = `${workItemBase}/${path}`;
  return exists(fullPath) ? readText(fullPath) : "";
}

function collectSourceItems(workItemBase) {
  const byId = new Map();
  for (const path of sourcePaths) {
    const content = readIfExists(workItemBase, path);
    if (!content) continue;
    const lines = content.split(/\r?\n/);
    for (const [index, line] of lines.entries()) {
      if (placeholderPattern.test(line)) continue;
      for (const id of idsIn(line)) {
        if (/^(TC|PW)-/.test(id)) continue;
        if (!byId.has(id)) byId.set(id, { id, path, line: index + 1, text: line.trim().slice(0, 220) });
      }
    }
  }
  return [...byId.values()].sort((a, b) => a.id.localeCompare(b.id));
}

function collectTasks(workItemBase) {
  const path = "01-spec/tasks.md";
  const content = readIfExists(workItemBase, path);
  if (!content) return [];

  const tasks = [];
  let current = null;
  for (const [index, line] of content.split(/\r?\n/).entries()) {
    const taskMatch = line.match(taskPattern);
    if (taskMatch) {
      current = {
        id: taskMatch[1],
        title: taskMatch[2].trim(),
        path,
        line: index + 1,
        trace_ids: [],
        verification_ids: [],
        testcase_ids: [],
        has_trace_field: false,
        has_verification_field: false,
      };
      tasks.push(current);
      continue;
    }
    if (!current) continue;
    const fieldMatch = line.match(fieldPattern);
    if (!fieldMatch) continue;
    const field = fieldMatch[1].toLowerCase();
    const value = fieldMatch[2];
    if (field === "trace") {
      current.has_trace_field = true;
      current.trace_ids = idsIn(value);
    } else if (field === "verification") {
      current.has_verification_field = true;
      current.verification_ids = idsIn(value);
    } else if (field === "testcase") {
      current.testcase_ids = idsIn(value).filter((id) => /^(TC|PW)-/.test(id));
    }
  }

  return tasks;
}

function collectVerificationItems(workItemBase) {
  const byId = new Map();
  for (const path of verificationPaths) {
    const content = readIfExists(workItemBase, path);
    if (!content) continue;
    const lines = content.split(/\r?\n/);
    for (const [index, line] of lines.entries()) {
      if (placeholderPattern.test(line)) continue;
      for (const id of idsIn(line).filter((value) => /^(TC|PW)-/.test(value))) {
        if (!byId.has(id)) byId.set(id, { id, path, line: index + 1, text: line.trim().slice(0, 220) });
      }
    }
  }
  return [...byId.values()].sort((a, b) => a.id.localeCompare(b.id));
}

export function traceabilitySummary(workItemBase) {
  const sourceItems = collectSourceItems(workItemBase);
  const tasks = collectTasks(workItemBase);
  const verificationItems = collectVerificationItems(workItemBase);
  const tracedIds = new Set(tasks.flatMap((task) => task.trace_ids));
  const testcaseIds = new Set([
    ...tasks.flatMap((task) => task.testcase_ids),
    ...verificationItems.map((item) => item.id),
  ]);

  const uncoveredSources = sourceItems.filter((item) => !tracedIds.has(item.id));
  const tasksMissingTrace = tasks.filter((task) => !task.has_trace_field || task.trace_ids.length === 0);
  const tasksMissingVerification = tasks.filter((task) => !task.has_verification_field);
  const tasksWithoutTestCase = tasks.filter((task) => task.testcase_ids.length === 0);

  return {
    summary: {
      source_items: sourceItems.length,
      tasks: tasks.length,
      verification_items: verificationItems.length,
      uncovered_sources: uncoveredSources.length,
      tasks_missing_trace: tasksMissingTrace.length,
      tasks_missing_verification: tasksMissingVerification.length,
      tasks_without_testcase: tasksWithoutTestCase.length,
    },
    source_items: sourceItems,
    tasks,
    verification_items: verificationItems,
    gaps: {
      uncovered_sources: uncoveredSources,
      tasks_missing_trace: tasksMissingTrace,
      tasks_missing_verification: tasksMissingVerification,
      tasks_without_testcase: tasksWithoutTestCase,
      verification_ids: unique([...testcaseIds]),
    },
  };
}

export function normalizeTraceabilityPolicy(schema = {}) {
  const configured = schema.traceability_policy ?? {};
  const mode = validPolicyModes.has(configured.mode) ? configured.mode : defaultPolicy.mode;
  const enforcedGates = Array.isArray(configured.enforced_gates)
    ? configured.enforced_gates.filter((gate) => typeof gate === "string" && gate.trim())
    : defaultPolicy.enforced_gates;
  return {
    mode,
    enforced_gates: enforcedGates,
    severities: {
      ...defaultPolicy.severities,
      ...(configured.severities && typeof configured.severities === "object" && !Array.isArray(configured.severities)
        ? configured.severities
        : {}),
    },
  };
}

export function traceabilityGapChecks(traceability, policy = defaultPolicy) {
  if (!traceability || policy.mode === "off") return [];
  const summary = traceability.summary;
  const checks = [];
  if (summary.source_items > 0 && summary.tasks > 0 && summary.uncovered_sources > 0) {
    checks.push({
      key: "uncovered_sources",
      count: summary.uncovered_sources,
      severity: policy.severities.uncovered_sources,
      route: "sf-tasking",
      owner_artifact: "tasks",
      path: "01-spec/tasks.md",
      message: `traceability 有 ${summary.uncovered_sources} 个源项未被 tasks 的 _Trace:_ 覆盖，后续实现可能漏需求。`,
    });
  }
  if (summary.tasks > 0 && summary.tasks_missing_trace > 0) {
    checks.push({
      key: "tasks_missing_trace",
      count: summary.tasks_missing_trace,
      severity: policy.severities.tasks_missing_trace,
      route: "sf-tasking",
      owner_artifact: "tasks",
      path: "01-spec/tasks.md",
      message: `tasks.md 有 ${summary.tasks_missing_trace} 个任务缺少 _Trace:_ 来源 ID，code review 难以判断任务是否对应需求。`,
    });
  }
  if (summary.tasks > 0 && summary.tasks_missing_verification > 0) {
    checks.push({
      key: "tasks_missing_verification",
      count: summary.tasks_missing_verification,
      severity: policy.severities.tasks_missing_verification,
      route: "sf-tasking",
      owner_artifact: "tasks",
      path: "01-spec/tasks.md",
      message: `tasks.md 有 ${summary.tasks_missing_verification} 个任务缺少 _Verification:_ 验证方式，verification 阶段容易补证困难。`,
    });
  }
  if (summary.tasks > 0 && summary.tasks_without_testcase > 0) {
    checks.push({
      key: "tasks_without_testcase",
      count: summary.tasks_without_testcase,
      severity: policy.severities.tasks_without_testcase,
      route: "sf-verify",
      owner_artifact: "verification",
      path: "05-verification/test-cases.md",
      message: `tasks.md 有 ${summary.tasks_without_testcase} 个任务尚未关联 _TestCase:_，进入 verification 前建议补齐 TC/PW ID。`,
    });
  }
  return checks;
}
