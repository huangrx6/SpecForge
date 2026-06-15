import { exists, parseComponents, readText } from "./specforge.mjs";

const evidenceLevels = new Set(["claimed", "observed", "proven", "mocked", "manual-confirmed", "deferred", "missing"]);
const riskLevels = new Set(["critical", "high", "medium", "low"]);
const authStrategies = new Set(["none", "ui-login", "api-login", "storage-state", "manual"]);

function splitRow(line) {
  const trimmed = line.trim();
  if (!trimmed.startsWith("|") || !trimmed.endsWith("|")) return null;
  return trimmed
    .slice(1, -1)
    .split("|")
    .map((cell) => cell.trim());
}

function sectionLines(content, headingPattern) {
  const lines = content.split(/\r?\n/);
  const start = lines.findIndex((line) => headingPattern.test(line));
  if (start === -1) return [];
  const result = [];
  for (let index = start + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (/^#{1,3}\s+/.test(line)) break;
    result.push(line);
  }
  return result;
}

function isSeparator(cells) {
  return cells.every((cell) => /^:?-{3,}:?$/.test(cell.replaceAll(" ", "")));
}

function isChoiceOrPlaceholder(value) {
  return !String(value ?? "").trim() || /\//.test(String(value ?? "")) || /请输入内容|待填写|TBD/i.test(String(value ?? ""));
}

function parseTableRows(content, headingPattern, minCells, headerPattern) {
  const rows = [];
  for (const line of sectionLines(content, headingPattern)) {
    const cells = splitRow(line);
    if (!cells || cells.length < minCells) continue;
    if (isSeparator(cells)) continue;
    if (headerPattern.test(cells.join(" "))) continue;
    if (cells.every((cell) => !cell)) continue;
    rows.push(cells);
  }
  return rows;
}

function parseTestCases(content) {
  return parseTableRows(content, /^##\s+2\.\s+Test Case Matrix/i, 10, /ID|Type|Source|Preconditions/i).map((cells) => ({
    id: cells[0],
    type: cells[1],
    source: cells[2],
    preconditions: cells[3],
    steps: cells[4],
    assertions: cells[5],
    evidence_required: cells[6],
    evidence_strength_target: cells[7],
    automation: cells[8],
    risk: cells[9],
  }));
}

function parsePlaywrightCases(content) {
  return parseTableRows(content, /^##\s+3\.\s+Playwright Cases/i, 8, /ID|Page|Flow|Role/i).map((cells) => ({
    id: cells[0],
    flow: cells[1],
    role: cells[2],
    data: cells[3],
    steps: cells[4],
    assertions: cells[5],
    states: cells[6],
    evidence: cells[7],
  }));
}

function parseTestDesignArtifacts(content) {
  return parseTableRows(content, /^##\s+1\.1\s+Test Design Artifacts/i, 6, /Artifact|Format|Path|Derived/i).map((cells) => ({
    artifact: cells[0],
    format: cells[1],
    path: cells[2],
    derived_cases: cells[3],
    export_path: cells[4],
    status: cells[5],
  }));
}

function parseTestEngineeringArtifacts(content) {
  return parseTableRows(content, /^##\s+1\.2\s+Test Engineering Artifacts/i, 4, /Artifact|Path|Purpose|Status/i).map((cells) => ({
    artifact: cells[0],
    path: cells[1],
    purpose: cells[2],
    status: cells[3],
  }));
}

function parseAuthRuntime(content) {
  return parseTableRows(content, /^##\s+3\.1\s+Auth And Runtime/i, 5, /Item|Strategy|Source|Sensitive/i).map((cells) => ({
    item: cells[0],
    strategy: cells[1],
    source: cells[2],
    sensitive_data_handling: cells[3],
    cleanup: cells[4],
  }));
}

function parseEvidenceManifest(content) {
  return parseTableRows(content, /^##\s+3\.2\s+Evidence Manifest/i, 5, /Run ID|Command|Related/i).map((cells) => ({
    run_id: cells[0],
    command: cells[1],
    related: cells[2],
    evidence_path: cells[3],
    strength: cells[4],
  }));
}

function parseReportCaseIds(workItemBase) {
  const reportPath = `${workItemBase}/05-verification/report.md`;
  if (!exists(reportPath)) return new Set();
  const report = readText(reportPath);
  return new Set(
    parseTableRows(report, /^##\s+3\.1\s+测试用例索引/i, 7, /用例 ID|来源|类型/i)
      .map((cells) => cells[0])
      .filter((id) => /^TC-\d+/i.test(id)),
  );
}

function parseReportPlaywrightIds(workItemBase) {
  const reportPath = `${workItemBase}/05-verification/report.md`;
  if (!exists(reportPath)) return new Set();
  const report = readText(reportPath);
  return new Set(
    parseTableRows(report, /^###\s+Playwright E2E 用例与执行/i, 9, /用例 ID|页面|流程/i)
      .map((cells) => cells[0])
      .filter((id) => /^PW-\d+/i.test(id)),
  );
}

function readIfExists(path) {
  return exists(path) ? readText(path) : "";
}

function explicitTrue(value) {
  return ["true", "yes", "y", "1", "on"].includes(String(value ?? "").trim().toLowerCase());
}

function browserFlowRequired(workItemBase) {
  const workYaml = readIfExists(`${workItemBase}/work.yaml`);
  const components = parseComponents(workYaml);
  const hasUi = explicitTrue(components.has_ui) || exists(`${workItemBase}/01-spec/ui-design.md`);
  if (!hasUi) return false;

  const content = [
    readIfExists(`${workItemBase}/01-spec/requirements.md`),
    readIfExists(`${workItemBase}/01-spec/gap-report.md`),
    readIfExists(`${workItemBase}/01-spec/tasks.md`),
    readIfExists(`${workItemBase}/01-spec/ui-design.md`),
    readIfExists(`${workItemBase}/01-spec/technical-design.md`),
    readIfExists(`${workItemBase}/04-code-review/code-review-v1.md`),
  ].join("\n");

  return /页面|按钮|表单|上传|提交|审批|下载|权限|路由|错误提示|登录|点击|弹窗|抽屉|响应式|upload|submit|approve|download|permission|route|form|button|login|click|modal|drawer|responsive|error/i.test(content);
}

function runtimeCheckLikely(workItemBase) {
  const content = [
    readIfExists(`${workItemBase}/01-spec/requirements.md`),
    readIfExists(`${workItemBase}/01-spec/gap-report.md`),
    readIfExists(`${workItemBase}/01-spec/tasks.md`),
    readIfExists(`${workItemBase}/01-spec/technical-design.md`),
    readIfExists(`${workItemBase}/04-code-review/code-review-v1.md`),
  ].join("\n");

  return /启动|运行|健康检查|环境变量|配置|migration|migrate|docker|server|port|build|deploy|rollback|health check|env|startup|runtime/i.test(content);
}

function evidencePathCandidates(value) {
  return String(value ?? "")
    .split(/[,，\s]+/)
    .map((item) => item.trim().replace(/[).;，。]+$/, ""))
    .filter((item) => /^(05-verification\/|evidence\/).+/.test(item));
}

function classifyIssues(workItemBase, testCases, playwrightCases, designArtifacts, engineeringArtifacts, authRuntimeRows, evidenceManifestRows, reportCaseIds, reportPlaywrightIds) {
  const issues = [];

  if (testCases.length === 0) {
    issues.push({
      severity: "FAIL",
      code: "no-test-cases",
      message: "05-verification/test-cases.md 缺少可解析的 TC-* 测试用例。",
    });
  }

  if (browserFlowRequired(workItemBase) && playwrightCases.length === 0) {
    issues.push({
      severity: "FAIL",
      code: "browser-flow-without-playwright",
      message: "当前 work item 存在 UI / 浏览器流程信号，但 05-verification/test-cases.md 缺少 PW-* Playwright 用例。",
    });
  }

  const engineeringPaths = new Set(engineeringArtifacts.map((artifact) => artifact.path).filter(Boolean));
  const hasPlaywrightPlan = [...engineeringPaths].some((path) => /playwright-flows\.md$/.test(path));
  const hasRuntimeRunbook = [...engineeringPaths].some((path) => /runtime-runbook\.md$/.test(path));
  const hasAuthPlan = [...engineeringPaths].some((path) => /auth-plan\.md$/.test(path));

  if (browserFlowRequired(workItemBase) && !hasPlaywrightPlan) {
    issues.push({
      severity: "WARN",
      code: "missing-playwright-flow-plan",
      message: "当前 work item 存在 UI / 浏览器流程信号，建议在 05-verification/test-engineering/playwright-flows.md 规划 PW flow、locator、assertion 和 evidence。",
    });
  }

  if (runtimeCheckLikely(workItemBase) && !hasRuntimeRunbook) {
    issues.push({
      severity: "WARN",
      code: "missing-runtime-runbook",
      message: "当前 work item 存在启动 / 配置 / 运行信号，建议提供 05-verification/test-engineering/runtime-runbook.md。",
    });
  }

  for (const testCase of testCases) {
    if (!/^TC-\d+/i.test(testCase.id)) {
      issues.push({ severity: "FAIL", code: "invalid-test-id", message: `${testCase.id || "empty"} 不是有效 TC-* ID。` });
    }
    for (const [field, value] of Object.entries({
      source: testCase.source,
      steps: testCase.steps,
      assertions: testCase.assertions,
      evidence_required: testCase.evidence_required,
      automation: testCase.automation,
    })) {
      if (isChoiceOrPlaceholder(value)) {
        issues.push({
          severity: "FAIL",
          code: "incomplete-test-case",
          message: `${testCase.id || "unknown"} 缺少真实 ${field}。`,
        });
      }
    }
    if (!evidenceLevels.has(String(testCase.evidence_strength_target).trim())) {
      issues.push({
        severity: "FAIL",
        code: "invalid-evidence-strength",
        message: `${testCase.id || "unknown"} 的 Evidence Strength Target 必须是 proven / mocked / manual-confirmed / deferred / missing。`,
      });
    }
    if (!riskLevels.has(String(testCase.risk).trim())) {
      issues.push({
        severity: "WARN",
        code: "invalid-risk",
        message: `${testCase.id || "unknown"} 的风险等级建议使用 high / medium / low。`,
      });
    }
    if (reportCaseIds.size > 0 && !reportCaseIds.has(testCase.id)) {
      issues.push({
        severity: "WARN",
        code: "case-not-in-report",
        message: `${testCase.id} 未出现在 verification report 的测试用例索引中。`,
      });
    }
  }

  for (const playwrightCase of playwrightCases) {
    if (!/^PW-\d+/i.test(playwrightCase.id)) {
      issues.push({ severity: "FAIL", code: "invalid-playwright-id", message: `${playwrightCase.id || "empty"} 不是有效 PW-* ID。` });
    }
    if (isChoiceOrPlaceholder(playwrightCase.steps) || isChoiceOrPlaceholder(playwrightCase.assertions)) {
      issues.push({
        severity: "FAIL",
        code: "incomplete-playwright-case",
        message: `${playwrightCase.id || "unknown"} 缺少真实自动化步骤或断言。`,
      });
    }
    if (isChoiceOrPlaceholder(playwrightCase.evidence)) {
      issues.push({
        severity: "FAIL",
        code: "playwright-evidence-not-declared",
        message: `${playwrightCase.id || "unknown"} 尚未声明截图 / trace / 日志证据路径。`,
      });
    }
    if (reportPlaywrightIds.size > 0 && !reportPlaywrightIds.has(playwrightCase.id)) {
      issues.push({
        severity: "WARN",
        code: "playwright-case-not-in-report",
        message: `${playwrightCase.id} 未出现在 verification report 的 Playwright E2E 用例与执行表中。`,
      });
    }
    for (const evidencePath of evidencePathCandidates(playwrightCase.evidence)) {
      if (!exists(`${workItemBase}/${evidencePath}`)) {
        issues.push({
          severity: "WARN",
          code: "missing-playwright-evidence-path",
          message: `${playwrightCase.id || "unknown"} 声明的证据路径不存在：${evidencePath}`,
        });
      }
    }
  }

  for (const artifact of designArtifacts) {
    const format = artifact.format.toLowerCase();
    if (format.includes("xmind") && isChoiceOrPlaceholder(artifact.export_path)) {
      issues.push({
        severity: "FAIL",
        code: "xmind-without-export",
        message: `${artifact.artifact || "XMind"} 是 XMind 设计稿，但缺少 Markdown / JSON 导出路径。`,
      });
    }
    if (artifact.export_path && !isChoiceOrPlaceholder(artifact.export_path) && !exists(`${workItemBase}/${artifact.export_path}`)) {
      issues.push({
        severity: "WARN",
        code: "missing-test-design-export",
        message: `${artifact.export_path} 不存在；请确认测试设计导出文件已归档。`,
      });
    }
    if (/test-design\//.test(artifact.path) || /test-design\//.test(artifact.export_path)) {
      issues.push({
        severity: "WARN",
        code: "deprecated-test-design-path",
        message: "检测到旧 test-design 路径；新测试工程产物建议写入 05-verification/test-engineering/。",
      });
    }
  }

  for (const artifact of engineeringArtifacts) {
    if (isChoiceOrPlaceholder(artifact.path) || isChoiceOrPlaceholder(artifact.status)) {
      issues.push({
        severity: "WARN",
        code: "incomplete-test-engineering-artifact",
        message: `${artifact.artifact || "test-engineering artifact"} 缺少真实 path 或 status。`,
      });
    }
    if (artifact.path && !isChoiceOrPlaceholder(artifact.path) && !exists(`${workItemBase}/${artifact.path}`) && !/planned|N\/A/i.test(artifact.status)) {
      issues.push({
        severity: "WARN",
        code: "missing-test-engineering-artifact",
        message: `${artifact.path} 不存在；请确认 test-engineering 产物已归档，或将状态标为 planned / N/A。`,
      });
    }
  }

  const authRows = authRuntimeRows.filter((row) => /auth/i.test(row.item));
  for (const auth of authRows) {
    const strategy = String(auth.strategy ?? "").trim();
    if (!authStrategies.has(strategy)) {
      issues.push({
        severity: "WARN",
        code: "invalid-auth-strategy",
        message: `Auth strategy 建议使用 none / ui-login / api-login / storage-state / manual，当前为：${strategy || "empty"}`,
      });
    }
    if (strategy !== "none" && !hasAuthPlan) {
      issues.push({
        severity: "WARN",
        code: "missing-auth-plan",
        message: "存在登录策略但未登记 05-verification/test-engineering/auth-plan.md。",
      });
    }
  }

  for (const evidence of evidenceManifestRows) {
    if (isChoiceOrPlaceholder(evidence.run_id) || isChoiceOrPlaceholder(evidence.command) || isChoiceOrPlaceholder(evidence.related)) {
      issues.push({
        severity: "WARN",
        code: "incomplete-evidence-manifest",
        message: `${evidence.run_id || "evidence row"} 缺少 run id、command 或 related TC/PW。`,
      });
    }
    if (!evidenceLevels.has(String(evidence.strength).trim())) {
      issues.push({
        severity: "WARN",
        code: "invalid-evidence-manifest-strength",
        message: `${evidence.run_id || "evidence row"} 的 Strength 应为 claimed / observed / proven / mocked / manual-confirmed / deferred / missing。`,
      });
    }
    for (const evidencePath of evidencePathCandidates(evidence.evidence_path)) {
      if (!exists(`${workItemBase}/${evidencePath}`)) {
        issues.push({
          severity: "WARN",
          code: "missing-evidence-manifest-path",
          message: `${evidence.run_id || "evidence row"} 声明的证据路径不存在：${evidencePath}`,
        });
      }
    }
  }

  return issues;
}

export function testCaseQualitySummary(workItemBase, testCasePath = "05-verification/test-cases.md") {
  const fullPath = `${workItemBase}/${testCasePath}`;
  if (!exists(fullPath)) {
    return {
      path: testCasePath,
      exists: false,
      test_cases: [],
      playwright_cases: [],
      test_design_artifacts: [],
      test_engineering_artifacts: [],
      auth_runtime: [],
      evidence_manifest: [],
      issues: [
        {
          severity: "FAIL",
          code: "missing-test-cases",
          message: `测试用例文件不存在：${testCasePath}`,
        },
      ],
    };
  }

  const content = readText(fullPath);
  const testCases = parseTestCases(content);
  const playwrightCases = parsePlaywrightCases(content);
  const designArtifacts = parseTestDesignArtifacts(content);
  const engineeringArtifacts = parseTestEngineeringArtifacts(content);
  const authRuntimeRows = parseAuthRuntime(content);
  const evidenceManifestRows = parseEvidenceManifest(content);
  const reportCaseIds = parseReportCaseIds(workItemBase);
  const reportPlaywrightIds = parseReportPlaywrightIds(workItemBase);
  const issues = classifyIssues(
    workItemBase,
    testCases,
    playwrightCases,
    designArtifacts,
    engineeringArtifacts,
    authRuntimeRows,
    evidenceManifestRows,
    reportCaseIds,
    reportPlaywrightIds,
  );

  return {
    path: testCasePath,
    exists: true,
    test_cases: testCases,
    playwright_cases: playwrightCases,
    test_design_artifacts: designArtifacts,
    test_engineering_artifacts: engineeringArtifacts,
    auth_runtime: authRuntimeRows,
    evidence_manifest: evidenceManifestRows,
    summary: {
      test_cases: testCases.length,
      playwright_cases: playwrightCases.length,
      test_design_artifacts: designArtifacts.length,
      test_engineering_artifacts: engineeringArtifacts.length,
      auth_runtime_rows: authRuntimeRows.length,
      evidence_manifest_rows: evidenceManifestRows.length,
      report_case_ids: reportCaseIds.size,
      report_playwright_ids: reportPlaywrightIds.size,
    },
    issues,
  };
}
