# Aesthetic Selection Prompt

用于根据业务内容向用户推荐多个真正的美学方向，并把用户选择转成设计约束。

注意：美学方向不是业务设计模式。`极简主义 / 玩具感 / 水彩风 / 赛博朋克 / 森系` 是美学方向；`Operational Calm / Command Center / Data Instrument` 只能作为 business translation pattern。

```md
请基于以下信息从美学风格库中筛选方向，并推荐 3-5 个互斥 UI 美学方向，再说明它们如何翻译到当前业务页面。若用户明确要求少量方案，则推荐 2-3 个。

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
   - Aesthetic direction:
   - Feeling:
   - Why it fits:
   - Why it might fail:
   - Visual language:
   - Foundations:
   - Business translation pattern:
   - Component impact:
   - Page pattern impact:
   - Motion boundary:
   - Human question:
2. Recommended direction
3. Rejected directions and why
4. Optional mix: 如果需要混合风格，说明主审美和辅助审美的边界
5. After user selects: write constraints for foundations/components/pages/prompts/Pencil

要求：
- 方向必须互斥。
- 每个方向必须是审美风格，不是业务模式。
- 每个方向都要能映射到组件契约，但不能把组件语言当成审美本身。
- 不使用“现代、简洁、高级”作为唯一解释；必须落到色彩、字体、形状、材质、插画、动效和反模式。
- 如果是严肃后台，也可以推荐克制美学，如“极简主义 / 日式留白 / 极简科技风”，再翻译成高密业务 UI。
- 推荐方向要覆盖不同气质，不要只在同一类里换名字；例如不要同时给“极简主义、现代高级感、日式留白”作为全部选项。
```
