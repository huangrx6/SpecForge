# Playwright E2E 测试标准

本标准回答：sf-verify 阶段如何写、运行和记录 Playwright 测试；测试什么，怎么断言，证据怎么存。

## 铁律

```
有以下任一情况，必须有 Playwright 自动化测试，不是可选的：
- 用户可操作的表单提交
- 页面间跳转和路由
- 文件上传或下载
- 权限控制（不同角色看到不同内容）
- 审批/确认/上线/下线等状态流转操作
- 接口调用结果在 UI 上的反馈
- 错误提示展示
```

"手工点了一遍"不是证据。"截图看起来没问题"不是证据。只有**可重复运行的 Playwright 脚本 + 运行结果**才是证据。

项目没有 Playwright 配置？**自己安装并创建最小配置，不得跳过**（见下方安装步骤）。

## 选择器优先级（从高到低）

```typescript
// ✅ 最优：ARIA role + accessible name（最稳定，不受样式/结构变化影响）
await page.getByRole('button', { name: '提交申请' }).click();
await page.getByRole('textbox', { name: '用户名' }).fill('test@example.com');
await page.getByLabel('审批意见').fill('同意');

// ✅ 好：可见文本
await expect(page.getByText('保存成功')).toBeVisible();

// ✅ 可接受：data-testid（当 role 无法区分同类元素时）
await page.getByTestId('submit-btn').click();
// 实现侧需配合：<button data-testid="submit-btn">

// ⚠️ 避免：CSS class（样式重构就失效）
await page.click('.btn-primary');  // ❌

// ❌ 禁止：nth-child / XPath（极脆弱，DOM 变动即失效）
await page.click('div:nth-child(3) > button');  // ❌
await page.click('//div[3]/button[1]');          // ❌
```

**实现侧约定**（`sf-implement` 阶段必须配合）：

- 优先使用语义化 HTML（`<button>`、`<label>`、`<input>` + `aria-label`）
- 无法用 role 区分的交互元素补 `data-testid`
- 不为测试绕过真实用户路径（不加隐藏表单、不暴露 debug API）

## 标准测试用例结构

```typescript
import { test, expect } from '@playwright/test';

test.describe('审批流程', () => {
  test.beforeEach(async ({ page }) => {
    // 前置：登录、导航到目标页面
    await page.goto('/login');
    await page.getByLabel('邮箱').fill('admin@test.com');
    await page.getByLabel('密码').fill('password123');
    await page.getByRole('button', { name: '登录' }).click();
    await expect(page).toHaveURL('/dashboard');
  });

  // Happy Path：正常操作流程
  test('普通用户可以提交申请', async ({ page }) => {
    await page.goto('/requests/new');

    await page.getByLabel('申请标题').fill('测试申请');
    await page.getByLabel('申请原因').fill('需要访问 XX 系统');
    await page.getByRole('button', { name: '提交' }).click();

    // 断言 UI 反馈
    await expect(page.getByText('申请已提交')).toBeVisible();
    // 断言路由跳转
    await expect(page).toHaveURL(/\/requests\/\d+/);
  });

  // Error Path：错误/边界情况
  test('申请标题为空时显示错误提示', async ({ page }) => {
    await page.goto('/requests/new');
    await page.getByRole('button', { name: '提交' }).click();

    await expect(page.getByText('申请标题不能为空')).toBeVisible();
    // 断言没有跳转（停留在当前页）
    await expect(page).toHaveURL('/requests/new');
  });

  // 权限测试：不同角色的访问限制
  test('访客访问受保护页面重定向到登录', async ({ page }) => {
    // 不登录直接访问
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/login');
  });

  // 接口验证：断言 API 调用结果
  test('提交表单时调用正确接口并处理响应', async ({ page }) => {
    // 拦截并断言接口调用
    const requestPromise = page.waitForRequest(
      req => req.url().includes('/api/requests') && req.method() === 'POST'
    );

    await page.goto('/requests/new');
    await page.getByLabel('申请标题').fill('测试');
    await page.getByRole('button', { name: '提交' }).click();

    const request = await requestPromise;
    const body = JSON.parse(request.postData() ?? '{}');
    expect(body.title).toBe('测试');

    // 断言接口响应后 UI 的变化
    await expect(page.getByText('申请已提交')).toBeVisible();
  });
});
```

## UI 吻合度验证（视觉对照）

当 `ui-design.md` 中有 Pencil 截图时，sf-verify 必须对照验证：

```typescript
test('列表页 UI 与设计稿吻合', async ({ page }) => {
  await page.goto('/requests');

  // 1. 截图对比（手动审查用）
  await page.screenshot({
    path: '05-verification/evidence/request-list.png',
    fullPage: true,
  });

  // 2. 关键 UI 元素断言
  await expect(page.getByRole('heading', { name: '申请列表' })).toBeVisible();
  await expect(page.getByRole('button', { name: '新建申请' })).toBeVisible();

  // 3. 空状态验证
  // （若列表为空，检查空状态提示是否存在）
  const rows = page.getByRole('row');
  const count = await rows.count();
  if (count <= 1) {
    await expect(page.getByText('暂无申请记录')).toBeVisible();
  }

  // 4. 响应式断言（移动端）
  await page.setViewportSize({ width: 375, height: 667 });
  await expect(page.getByRole('navigation')).toBeVisible(); // 导航不消失
});
```

## 接口与权限验证

```typescript
test('管理员可以审批，普通用户不能', async ({ browser }) => {
  // 管理员 context
  const adminContext = await browser.newContext();
  const adminPage = await adminContext.newPage();
  // ... 登录管理员
  await adminPage.goto('/requests/1');
  await expect(adminPage.getByRole('button', { name: '审批' })).toBeVisible();

  // 普通用户 context（同一测试，不同 context）
  const userContext = await browser.newContext();
  const userPage = await userContext.newPage();
  // ... 登录普通用户
  await userPage.goto('/requests/1');
  await expect(userPage.getByRole('button', { name: '审批' })).not.toBeVisible();

  await adminContext.close();
  await userContext.close();
});

test('上线/下线操作调用正确接口', async ({ page }) => {
  // 监听网络请求
  let capturedRequest: any;
  page.on('request', req => {
    if (req.url().includes('/api/publish') && req.method() === 'POST') {
      capturedRequest = req;
    }
  });

  await page.goto('/content/1');
  await page.getByRole('button', { name: '上线' }).click();

  // 确认对话框
  await page.getByRole('button', { name: '确认上线' }).click();

  // 断言接口被调用
  await page.waitForTimeout(500);
  expect(capturedRequest).toBeDefined();

  // 断言 UI 状态更新
  await expect(page.getByText('已上线')).toBeVisible();
  await expect(page.getByRole('button', { name: '下线' })).toBeVisible();
  await expect(page.getByRole('button', { name: '上线' })).not.toBeVisible();
});
```

## 没有 Playwright 配置时的安装步骤

不能以"项目没有配置 Playwright"为由跳过 E2E 测试：

```bash
# 步骤 1：安装（使用项目的包管理器）
pnpm add -D @playwright/test playwright
# 或 npm install -D @playwright/test playwright

# 步骤 2：安装浏览器
npx playwright install chromium --with-deps

# 步骤 3：创建最小配置（放在项目根目录）
cat > playwright.config.ts << 'EOF'
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  retries: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
EOF

# 步骤 4：创建测试目录
mkdir -p tests/e2e

# 步骤 5：运行（确保 dev server 已启动）
npx playwright test --reporter=list
```

## 必须覆盖的测试矩阵

在 `05-verification/test-cases.md` 记录：

| 用例 ID | 场景描述 | 角色 | 操作 | 断言 | 结果 | 截图 |
|---|---|---|---|---|---|---|
| E2E-001 | 正常提交表单 | 普通用户 | 填写并提交 | 跳转成功页 + 成功提示 | ✅ | evidence/submit.png |
| E2E-002 | 表单验证错误 | 普通用户 | 空提交 | 显示错误提示，不跳转 | ✅ | evidence/error.png |
| E2E-003 | 权限拦截 | 访客 | 访问受保护页 | 重定向到登录 | ✅ | |
| E2E-004 | 角色权限差异 | 管理员/用户 | 访问同一页面 | 按钮可见性不同 | ✅ | |
| E2E-005 | 上线/下线操作 | 管理员 | 点击上线→确认 | 接口调用 + 状态变更 | ✅ | evidence/publish.png |

**覆盖规则：**
- 每个用户可操作功能：至少 1 个 happy path + 1 个 error path
- 有权限控制的功能：必须测试无权限情况
- 有状态变更的操作（上线/下线/审批/删除）：必须断言状态变化
- 有接口调用的操作：必须断言接口被正确调用（请求参数 + UI 响应）

## 证据要求

运行完成后，写入 `05-verification/report.md`：

```markdown
## E2E 验证证据

**运行命令：** `npx playwright test tests/e2e/ --reporter=list`
**运行时间：** 2025-05-21 16:00
**环境：** http://localhost:3000（开发环境）

**结果：**
- 通过：8 / 8 用例
- 失败：0
- 截图：`05-verification/evidence/`

| 用例 | 结果 | 备注 |
|---|---|---|
| E2E-001 正常提交 | ✅ PASS | |
| E2E-002 表单验证 | ✅ PASS | |
| E2E-003 权限拦截 | ✅ PASS | |
| E2E-004 角色差异 | ✅ PASS | |
| E2E-005 上线操作 | ✅ PASS | 接口断言通过 |

**未覆盖项（如有）：**
- 移动端响应式：手工验证（无移动设备模拟器配置）
```

没有以上内容，verification gate 不得批准。
