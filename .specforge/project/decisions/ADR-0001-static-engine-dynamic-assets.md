# ADR-0001: 分离静态工作流引擎和动态项目资产

## 状态

Accepted

## 背景

Agent 工作流规则和项目事实变化速度不同。规则相对稳定，项目事实会随每次 change 更新。

## 决策

将 workflow rules、roles、skills、templates 存放在 `.specforge/`。将 project SSoT、registry 和 changes 存放在 `.specforge/`。

## 后果

Agent 可以把稳定规则和动态项目事实分开加载，减少歧义和误编辑。
