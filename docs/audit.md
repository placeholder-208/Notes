# 检查与重构记录

检查日期：2026-10-25。

GitHub 默认分支为 `master`。检查时最近三次远程部署均成功，因此此次重点修复生成站点的功能问题。最近一次原有部署：[40100975483](https://github.com/placeholder-208/Notes/actions/runs/40100975483)。

## 已修复

| 问题 | 处理 |
| --- | --- |
| `_config.yml` 重复定义 `collections`，后项覆盖前项 | 合并为唯一配置，保留原有 `.html` 路径 |
| 站点域名是 `yourusername` 占位值 | 使用当前 GitHub 仓库所有者对应域名，补充 canonical 和描述 |
| 三篇笔记缺少 front matter，标题 / 布局不完整 | 补充英文练习和两篇翻译文档的标题 |
| 图片路径使用反斜杠、目录名不符或依赖相对目录层级 | 改用实际资源目录和 `relative_url` / `uri_escape` |
| 翻译文档引用原站根目录，产生本地 404 | 指向原站文档 / 图片，修正本篇多用户章节锚点 |
| 翻译文档的 Retype 提示块在 Jekyll 中显示为原始标记 | 转为标准 Markdown 引用，保留提示文字和代码块 |
| Docker 示例中的双花括号被 Liquid 解析 | 添加 `raw` 保护，严格构建不再产生此警告 |
| 首个二级标题前的正文被章节拆分丢弃 | 保留在第一章，不增加章节索引，避免已有评论错位 |
| 嵌套二级标题可能导致整篇内容丢失 | 只按正文直属二级标题分章，保留所有文本节点 |
| Firebase 配置 / CDN 失败导致主模块无法执行 | 阅读模块只依赖本地代码，评论按配置异步加载 |
| 调用未定义的 `adjustLayout`，全局布局函数名称不一致 | 移除失效调用，以 CSS、媒体查询和 ResizeObserver 管理布局 |
| 导航改写 Markdown 原始 ID，且不处理 hashchange | 保留原始锚点，兼容旧 `sub-*` 链接并支持刷新及前进后退 |
| 移动端返回地址写死 `/Notes/`，展开按钮捕获旧章节 | 链接由模板生成，按钮每次读取当前章节 |
| 嵌套回复未传递 `noteId` | 在每层渲染中传递正确的笔记标识 |
| 发布失败或未登录后仍清空草稿 | 发布函数返回明确成功状态，仅成功后清空 |
| 用户名和头像通过 HTML 字符串插入 | 用户内容以 DOM 文本渲染，头像仅接受 HTTPS URL |
| 评论提交 / 点赞重复触发、点赞后重建监听 | 提交期间禁用按钮，通过现有实时订阅更新 |
| 评论树构造反复扫描且递归无深度约束 | 线性建立父子索引，渲染限制为三层 |
| 首页分组依赖平行数组和内联 JavaScript | 使用共享条目模板和原生 details，支持键盘与无 JS 浏览 |
| 存在嵌套 main，移动端目录 CSS 选择器与 DOM 不符 | 使用一个 main 和正文 article，修正移动端选择器 |
| Secrets 直接插入 shell 源码，存在转义和命令解析风险 | 通过环境变量和 Python JSON 序列化生成配置 |
| 缺少提交前检查，构建重复安装 gems，构建任务拥有部署权限 | 增加 PR 检查、单元 / 浏览器测试和链接检查，使用 Bundler 缓存，部署权限仅授予部署任务 |

## 验证和边界

首轮验证结果：7 项前端单元测试、4 项构建工具测试和 7 项浏览器测试通过。桌面项目中的移动端专用用例按设计跳过一次。两种路径配置均生成 11 个 HTML 页面，站内资源检查通过。

- 原有笔记正文和开始检查时尚未提交的新增内容已保留。
- 项目路径 `/Notes` 与根路径两种构建均进行严格模式验证及本地资源检查。
- Node 测试覆盖引言保留、嵌套标题、原始 / 旧锚点、章节历史、移动导航、文本转义、嵌套回复和失败草稿保留。
- 浏览器测试覆盖无 JavaScript 首页、外部 CDN 不可用时的导航、刷新 / 历史恢复、移动目录和桌面切换。
- 本地浏览器测试使用现有 Chrome，移动端采用设备视口模拟；不等同于真机或 Safari 验证。
- Firebase 评论写入、GitHub OAuth 弹窗、数据库规则与线上数据未进行真实调用。它们依赖账户侧配置，不能通过静态构建验证。
- 外部文档链接不纳入每次 CI 的可用性检查；站内检查不依赖第三方网络。
- 首轮重构完成时未执行推送或部署；后续远程状态以 GitHub Actions 记录为准。

## 后续修正：Firebase 使用 GitHub Environment

用户确认 Firebase 配置保存在 GitHub Environment。只读查询确认仓库存在 `github-pages` 环境。

发现首轮重构后的配置生成位于未绑定 Environment 的 `build` 任务，而 `github-pages` 只绑定在 `deploy` 任务。环境中的配置因此不可用于生成文件，先前关于“原有配置会直接继续生效”的说明不准确。GitHub 明确规定：[Environment Secrets / Variables 仅供引用该 Environment 的任务访问](https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments#environment-secrets)。

已将配置生成移到 `deploy` 任务：下载测试通过的站点后，使用原有 `FIREBASE_*` Secrets / Variables 直接写入待发布产物，再打包上传 Pages。生产配置缺失时停止部署；PR 任务不引用生产 Environment。保留用户将源码功能开关改为 `enabled: true` 的提交，不改动任何远程配置值。

补充测试覆盖生产配置强制校验、产物输出路径、源码不变及配置校验失败不覆盖产物。构建工具测试增至 6 项并通过。本次修正尚未推送，未执行远程部署或调用线上 Firebase。

现有 Ruby 4.0.6 和部署 action v5 已核实为有效版本，未因版本号推测而降级。参考：[Ruby 4.0.6 发布说明](https://www.ruby-lang.org/en/news/2026/07/14/ruby-4-0-6-released/)、[deploy-pages 发布记录](https://github.com/actions/deploy-pages/releases)、[Jekyll 与 GitHub Actions](https://jekyllrb.com/docs/continuous-integration/github-actions/)。
