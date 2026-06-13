# Aesthetic Selection Prompt

用于根据业务内容向用户推荐多个美学方向，并把用户选择转成设计约束。

```md
请基于以下信息推荐 2-3 个互斥 UI 美学方向。

输入：
- Subject:
- Audience:
- Single job:
- World material:
- Design mode:
- Device:
- Existing UI:
- Must avoid:

输出：
1. Direction cards
   - Direction:
   - Why it fits:
   - Why it might fail:
   - Signature:
   - Foundations:
   - Component language:
   - Page patterns:
   - Motion boundary:
   - Human question:
2. Recommended direction
3. Rejected directions and why
4. After user selects: write constraints for foundations/components/pages/prompts/Pencil

要求：
- 方向必须互斥。
- 每个方向都要能映射到组件契约。
- 不使用“现代、简洁、高级”作为唯一解释。
```
