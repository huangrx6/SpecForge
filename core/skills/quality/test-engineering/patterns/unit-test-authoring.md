# Unit Test Authoring

适合单测：

- pure function
- formatter / validator / mapper
- policy / permission function
- reducer / state transition
- composable / hook
- service adapter with mock
- data transformer
- prompt parser / output parser
- AI post-processing logic

每组单测覆盖：

- normal path
- invalid input
- boundary value
- empty / null / undefined
- permission / role variants
- error path
- regression case from bug / code review

禁止：

- 为覆盖率测试私有实现细节。
- 大量 snapshot 代替行为断言。
- mock 掉被测对象本身。
- 单测依赖真实网络、真实数据库、真实浏览器。
