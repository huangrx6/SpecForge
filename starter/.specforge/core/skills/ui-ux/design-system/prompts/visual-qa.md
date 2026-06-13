# Visual QA Prompt

用于对导出截图或页面实现做视觉质量审查。

```md
请审查这组 UI 截图是否符合已确认设计语言。

检查：
1. 信息层级：主任务、状态、下一步是否清楚。
2. 密度：是否符合 compact / comfortable / expressive 档位。
3. 组件一致性：按钮、表单、表格、卡片、导航是否统一。
4. 去廉价感：是否存在模板感、廉价渐变、嵌套卡片、随机图标、无意义装饰。
5. 可访问性：对比度、焦点、键盘路径、触控目标是否合理。
6. 动效：是否服务反馈和空间关系。
7. 实现可行性：是否可映射到 shadcn-vue / 项目组件。

输出：
- Verdict: pass / needs revision / blocked
- Top issues:
- Required fixes:
- Optional polish:
- Evidence:
```
