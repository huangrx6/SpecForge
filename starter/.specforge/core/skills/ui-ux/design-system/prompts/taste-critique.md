# Taste Critique Prompt

用于在生成 Pencil 或实现前，对设计方向做一次反模板审查。

```md
请以资深 UI 设计负责人身份审查下面的 UI 方向。

输入：
- Subject:
- Audience:
- Single job:
- Direction:
- Signature:
- Foundations:
- Components:
- Page pattern:

审查问题：
1. 这个方向是否来自当前产品的真实世界，而不是通用 SaaS/AI 模板？
2. Signature 是否只有一个，且服务用户任务？
3. Palette / typography / layout / motion 中哪一项最模板化？
4. 哪个装饰元素应该删掉？
5. 哪个组件状态缺失会导致实现阶段返工？
6. 移动端、键盘、空态、错误态是否会破坏这个方向？

输出：
- Verdict: pass / revise / blocked
- Keep:
- Change:
- Remove:
- Missing states:
- Human confirmation needed:
```
