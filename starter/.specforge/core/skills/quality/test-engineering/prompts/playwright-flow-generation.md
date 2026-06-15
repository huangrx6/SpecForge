# Playwright Flow Generation Prompt

生成浏览器流程前先写：

- baseURL
- auth strategy
- role
- route
- preconditions
- stable locators
- steps with assertions
- screenshot points
- trace strategy
- cleanup

如果缺账号、baseURL、locator 或测试数据，先写 pending，不要编造。
