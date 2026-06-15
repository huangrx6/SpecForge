# Unit Test Generation Prompt

生成单测前先回答：

- 被测对象是什么？
- 行为契约来自哪个 REQ / AC / risk？
- 是否可纯函数测试？
- 需要 mock 的外部边界是什么？
- 哪些输入是边界值？

输出 test file path、command、覆盖的 source 和未覆盖 gap。
