# AI Agent Flow

AI 功能测试需要区分确定性工程行为和模型质量。

| 对象 | 测试方式 |
| --- | --- |
| 输入校验 | unit / integration |
| tool call / workflow | mocked contract / integration |
| output parser | unit + regression samples |
| model quality | eval set + manual review |
| safety / privacy | negative tests + redaction checks |
| cost / timeout | runtime smoke + logs |

不要把一次模型输出截图当稳定通过证据。
