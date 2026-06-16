import { graphImpact } from "./graph-impact.mjs";

const TARGET_RULES = [
  {
    target: "external-interfaces.md",
    type: "api",
    patterns: [/routes?\//i, /controllers?\//i, /api\//i, /handler/i, /webhook/i, /graphql/i, /rpc/i, /grpc/i],
    reason: "变更触及 API / webhook / RPC / handler。",
  },
  {
    target: "04-data-model.md",
    type: "data",
    patterns: [/models?\//i, /entities?\//i, /repositories?\//i, /dao\//i, /mapper/i, /schema/i, /migration/i, /prisma/i, /\.sql$/i, /db\//i, /database\//i],
    reason: "变更触及数据模型、迁移或数据访问层。",
  },
  {
    target: "config-env.md",
    type: "config",
    patterns: [/\.env/i, /config/i, /secret/i, /feature.?flag/i],
    reason: "变更触及配置、环境变量、secret 或功能开关。",
  },
  {
    target: "security-auth.md",
    type: "security",
    patterns: [/auth/i, /permission/i, /policy/i, /session/i, /token/i, /security/i],
    reason: "变更触及认证、授权、权限或安全边界。",
  },
  {
    target: "jobs-events.md",
    type: "jobs-events",
    patterns: [/jobs?\//i, /workers?\//i, /queue/i, /event/i, /cron/i, /scheduler/i, /message/i],
    reason: "变更触及后台任务、队列、事件或定时调度。",
  },
  {
    target: "05-operations.md",
    type: "operations",
    patterns: [/Dockerfile/i, /compose/i, /\.github\/workflows/i, /deploy/i, /release/i, /rollback/i, /package\.json/i, /Makefile/i],
    reason: "变更触及运行、构建、测试、部署或回滚入口。",
  },
  {
    target: "03-architecture.md",
    type: "architecture",
    patterns: [/src\//i, /app\//i, /packages?\//i, /services?\//i, /modules?\//i],
    reason: "变更触及模块或架构边界，需判断是否为长期事实。",
  },
];

function matches(file, patterns) {
  return patterns.some((pattern) => pattern.test(file));
}

export function wikiRefreshPlan(options = {}) {
  const impact = graphImpact(options);
  const targets = [];
  for (const rule of TARGET_RULES) {
    const sources = impact.changed_files.filter((file) => matches(file, rule.patterns));
    if (!sources.length) continue;
    targets.push({
      file: rule.target,
      type: rule.type,
      reason: rule.reason,
      source: sources,
      decision: "review-required",
    });
  }

  return {
    wiki_update_needed: targets.length > 0,
    targets,
    changed_files: impact.changed_files,
    impact,
    checked_at: new Date().toISOString(),
    notes: targets.length
      ? ["只更新对应 Wiki 文件；不要刷新全仓 Wiki。"]
      : ["未发现明显长期 Wiki 事实变更；仍需由 wiki_sync 结合 implementation / verification 判断。"],
  };
}

export function wikiRefreshPlanMarkdown(result) {
  return `# Wiki 刷新计划

- 需要更新 Wiki：${result.wiki_update_needed ? "是" : "否"}

## 目标

${result.targets.length ? result.targets.map((item) => `- \`${item.file}\`: ${item.reason} 来源：${item.source.map((file) => `\`${file}\``).join(", ")}`).join("\n") : "- 无"}

## 说明

${result.notes.map((item) => `- ${item}`).join("\n")}
`;
}

function option(args, name) {
  const index = args.indexOf(name);
  const value = args[index + 1];
  return index === -1 || !value || value.startsWith("--") ? null : value;
}

function main() {
  const args = process.argv.slice(2);
  const asJson = args.includes("--json");
  const changedFiles = option(args, "--changed-files")
    ? option(args, "--changed-files").split(/[\n,]/).map((item) => item.trim()).filter(Boolean)
    : [];

  try {
    const result = wikiRefreshPlan({ changedFiles });
    if (asJson) console.log(JSON.stringify({ wiki_refresh_plan: result }, null, 2));
    else console.log(wikiRefreshPlanMarkdown(result));
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

if (process.argv[1]?.replaceAll("\\", "/").endsWith("/wiki-refresh-plan.mjs")) {
  main();
}
