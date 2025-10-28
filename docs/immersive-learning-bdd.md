# 沉浸教学区（四区联动）用户故事与 BDD

版本：v1.0  
日期：2025-10-28  
范围：右侧学习区为核心，贯通课程任务导航区 / 课程教学区 / 课程实践区 / AI 助教区的“四区联动”，并支持教学⇄课研模式即时切换。

---

## 目标与原则
- 一屏沉浸：不跳页完成“学—做—问—改”的学习闭环。
- 即时切换：学习类与实践类 Tab 秒级切换，教学/课研模式无刷新切换。
- 上下文贯通：Tab 与 AI 助教共享课程/课时/子任务/选中片段上下文。
- 可度量可回溯：记录完成度、时长、关键产出与版本变更。

---

## 角色与术语
- 学习者 Learner：完成课程任务的学生。
- 教师 Instructor：组织教学、配置子任务与依赖。
- 课研 Researcher：对课程内容进行版本化试验与优化。
- AI 助教 Assistant：上下文感知的问答与引导。
- 子任务 Tab：文档/视频/PDF/PPT/Notebook/VS Code/标注/智能体/测验等承载体。
- 分组 Category：学习类 study｜实践类 practice。

---

## 信息架构（右侧学习区）
- 顶部一级分组：学习类｜实践类（Segmented）。
- 二级 Tabs：随分组展示对应子任务类型（如 document/pdf/video vs notebook/lab/vscode）。
- 深链接：URL 参数保存 mode 与 tab（例：`?mode=practice&tab=notebook`）。
- 状态保留：每个 Tab 的阅读页码/播放进度/编辑光标等持久化（本地 + 服务器）。

---

## 数据模型建议（简化）
```ts
export type Category = 'study'|'practice';
export type TabType = 'document'|'ppt'|'pdf'|'video'|'notebook'|'vscode'|'annotation'|'agent'|'quiz'|'lab';
export interface SubtaskTab {
  id: string; title: string; category: Category; type: TabType;
  source?: { url?: string; fileId?: string; html?: string; md?: string; iframeSrc?: string };
  duration?: number; completed?: boolean; prerequisites?: string[];
}
```

---

## 史诗与用户故事（As a … I want … so that …）
- 学习者：在同一屏随时切换学习与实践，以便边学边做不中断。
- 学习者：通过深链接直达指定模式与子任务，以便分享与复现上下文。
- 学习者：清楚看到前置依赖（需先修/未解锁），按路径完成任务。
- 学习者：保留阅读/观看/编辑位置，实现断点续学。
- 学习者：选中内容一键发送给 AI 助教，获得定向帮助。
- 学习者：将助教产出的代码/提示一键注入实践环境执行。
- 教师：配置学习/实践子任务与依赖，形成有约束的教学路径。
- 课研：在课研模式下编辑、对比并灰度发布内容版本。
- 平台：记录 Tab 视图、完成、时长、实验结果等指标以度量效果。

---

## BDD（Gherkin）

```gherkin
Feature: 双层Tab默认打开
Scenario: 打开任务自动进入学习类首个子任务
  Given 我已登录并进入课时A的任务T
  And 任务T包含学习类(Document)与实践类(Notebook)
  When 我打开任务T
  Then 顶部分组为"study"且二级Tab为"document"
  And URL 包含 ?mode=study&tab=document
```

```gherkin
Feature: 分组与Tab切换
Scenario: 学习⇄实践即时切换保留上下文
  Given 我在"study/document"阅读到第3节
  When 我切换到"practice/notebook"
  Then 显示Notebook启动卡片
  And 返回"study/document"时仍定位在第3节
```

```gherkin
Feature: 深链接
Scenario: 通过URL直达指定模式与子任务
  Given 课程分享链接含 ?mode=practice&tab=notebook
  When 未登录用户打开该链接并登录
  Then 页面激活"practice/notebook"并加载同任务上下文
```

```gherkin
Feature: 前置依赖
Scenario: 实践子任务被学习子任务锁定
  Given 任务T中notebook依赖document完成
  When 我尝试打开notebook
  Then 显示需先完成document的提示与跳转按钮
```

```gherkin
Feature: 进度与时长
Scenario: 标记子任务完成并上报学习时长
  Given 我在"study/video"观看至100%
  When 我点击"标记完成"
  Then 子任务状态=完成 且 导航区出现绿色对勾
  And 上报观看时长与完成时间戳
```

```gherkin
Feature: 断点续学
Scenario: 恢复阅读/播放/光标位置
  Given 我昨天退出时位于"study/pdf"第12页
  When 我今天重新进入任务T
  Then 自动打开"study/pdf"并定位到第12页
```

```gherkin
Feature: 实践环境拉起
Scenario: 一键开启Notebook并挂载模板
  Given 任务T配置了模板仓库与数据集
  When 我点击"启动Notebook"
  Then 在新会话中挂载模板与数据
  And 显示"正在准备环境"并可重试
```

```gherkin
Feature: AI助教联动
Scenario: 选中文档内容一键提问
  Given 我在"study/document"选中一段文本
  When 我点击"问助教"
  Then AI助教收到课程/任务/子任务/选中文本上下文
  And 返回摘要与延伸阅读建议
```

```gherkin
Feature: 助教产出直达实践
Scenario: 将助教生成代码注入Notebook
  Given 助教回复了可运行的Python代码
  When 我点击"发送到Notebook"
  Then 在Notebook新单元插入该代码并聚焦
```

```gherkin
Feature: 错误回退
Scenario: 外部实践服务不可达的降级体验
  Given Notebook服务暂不可用
  When 我打开"practice/notebook"
  Then 显示维护提示与本地示例下载链接
```

```gherkin
Feature: 课研模式切换
Scenario: 进入课研模式并创建草稿版本
  Given 我是课程的课研负责人
  When 我切换到"课研模式"
  Then 右侧出现"编辑/版本对比/发布"工具栏
  And 当前修改保存为草稿版本v-next
```

```gherkin
Feature: 角色与权限
Scenario: 学习者隐藏编辑入口 教师可见
  Given 同一任务视图
  When 以学习者身份访问
  Then 不显示"编辑/发布"按钮
  And 以教师身份访问则显示
```

---

## 验收要点与非功能需求（NFR）
- 深链接与状态保留：mode/tab/滚动位置/播放进度/光标位置可恢复。
- 依赖与锁定：后置实践需完成前置学习；提示可一键跳转。
- 性能：Tab 懒加载 + 下一个 Tab 轻量预取；实践组件 Skeleton 占位。
- 可插拔：类型→组件注册表，便于扩展/灰度与按需加载。
- 可观测：埋点 tab_view/complete/lab_start/lab_fail/ai_ask/ai_apply。
- 安全：iframe sandbox、反向代理与鉴权；错误具备可感知降级。
- 无障碍：字幕/倍速、键盘快捷键、高对比主题、拖拽分栏。

---

## 最小落地计划（1–2 天）
1) 扩展数据模型：为子任务补充 category/type/prerequisites/completed。
2) 双层容器：顶部分组 + 二级 Tabs；URL 同步 mode 和 tab。
3) 注册表渲染：TAB_REGISTRY 绑定 Document/PDF/Video/Notebook/Lab 等。
4) 助教联动：右侧统一“问助教/发送到实践区”入口，注入当前上下文。
5) 追踪：记录 tab_view/complete 与学习时长（先本地，后端埋点可选）。

---

## 事件追踪字典（建议）
- tab_view(mode, tabId, taskId)
- tab_complete(tabId, duration, percent)
- lab_start(kind, sessionId) / lab_fail(reason)
- ai_ask(source=doc|code|selection, tokens, tabId)
- ai_apply(target=notebook|vscode|doc, tabId)

---

> 备注：本文件为前端/产品/教学与课研协同的行为契约，可直接作为端到端（E2E）用例基线；Playwright/RTL 可依据上述 Gherkin 场景实现自动化校验。
