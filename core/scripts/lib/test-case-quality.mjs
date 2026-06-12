import { exists, readText } from "./specforge.mjs";

const evidenceLevels = new Set(["proven", "mocked", "manual-confirmed", "deferred", "missing"]);
const riskLevels = new Set(["high", "medium", "low"]);

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

function classifyIssues(workItemBase, testCases, playwrightCases, designArtifacts, reportCaseIds) {
  const issues = [];

  if (testCases.length === 0) {
    issues.push({
      severity: "FAIL",
      code: "no-test-cases",
      message: "05-verification/test-cases.md 缺少可解析的 TC-* 测试用例。",
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
        severity: "WARN",
        code: "playwright-evidence-not-declared",
        message: `${playwrightCase.id || "unknown"} 尚未声明截图 / trace / 日志证据路径。`,
      });
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
  const reportCaseIds = parseReportCaseIds(workItemBase);
  const issues = classifyIssues(workItemBase, testCases, playwrightCases, designArtifacts, reportCaseIds);

  return {
    path: testCasePath,
    exists: true,
    test_cases: testCases,
    playwright_cases: playwrightCases,
    test_design_artifacts: designArtifacts,
    summary: {
      test_cases: testCases.length,
      playwright_cases: playwrightCases.length,
      test_design_artifacts: designArtifacts.length,
      report_case_ids: reportCaseIds.size,
    },
    issues,
  };
}
