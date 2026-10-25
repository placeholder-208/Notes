# 学习笔记

使用 Ruby / Jekyll 构建，通过 GitHub Actions 部署到 GitHub Pages。

站点地址：https://placeholder-208.github.io/Notes/

## 本地预览

安装 `.ruby-version` 指定的 Ruby 4.0.6 和 `Gemfile.lock` 指定的 Bundler，然后执行：

```sh
bundle install
bundle exec jekyll serve --livereload
```

打开 http://127.0.0.1:4000/Notes/ 。Windows 使用 RubyInstaller 自带的终端；WSL 则安装并使用 Linux 版本的 Ruby，避免混用两个系统的可执行文件和 gem。

## 新增笔记

将 Markdown 文件放入 `_notes/` 或其子目录，文件开头添加：

```yaml
---
title: 笔记标题
---
```

首页按一级目录分组。`##` 标题作为章节，`###` 标题作为章节内导航。首个 `##` 前的引言保留在第一章。无 `##` 时全文作为一个章节。

图片放在 `assets/image/`，使用 Jekyll 路径过滤器兼容仓库子路径、空格和中文：

```liquid
![说明]({{ '/assets/image/example.png' | relative_url | uri_escape }})
```

代码示例若含有 Liquid 标记（如 Docker 的双花括号），在示例外加上 Liquid 的 `raw` / `endraw` 标签，防止构建时被模板引擎解析。

## 检查和测试

生产构建和本地资源检查仅需 Ruby、Python 3：

```sh
bundle exec jekyll build --strict_front_matter --trace
python3 scripts/check_site.py
python3 -m unittest discover -s tests -p 'test_*.py'
```

前端回归测试还需要 Node.js 22 或以上版本：

```sh
npm ci
npm test
npx playwright install chromium
npm run test:browser
```

Linux 首次运行浏览器测试时，可用 `npx playwright install --with-deps chromium` 安装浏览器及系统依赖。也可用环境变量 `PLAYWRIGHT_CHANNEL=chrome` 使用已安装的 Chrome。浏览器测试隔离 Firebase 和外部 CDN，不写入线上评论。

验证根路径托管：

```sh
bundle exec jekyll build --baseurl '' --destination _site-root --strict_front_matter
python3 scripts/check_site.py _site-root --baseurl ''
```

## GitHub Pages 部署

仓库 **Settings → Pages → Build and deployment → Source** 应选择 **GitHub Actions**。

推送到 `master` 后，工作流依次执行单元测试、严格构建、站内链接检查和桌面 / 移动端浏览器测试，通过后上传并部署 `_site`。Pull Request 只构建和测试，也会检查根路径配置；不部署。

Ruby 版本统一由 `.ruby-version` 管理。保留 `Gemfile.lock`，避免每次部署重新解析依赖。`fetch-depth: 0` 用于根据 Git 历史生成笔记更新时间。

如果更改仓库名称、用户名或绑定自定义域名，请同步修改 `_config.yml` 的 `url` 和 `baseurl`，并将工作流和检查脚本中的 `--baseurl` 参数调整为同一路径。

## 可选的 Firebase 评论

默认配置 `assets/js/firebase-config.json` 为 `{"enabled":false}`。阅读、目录和数学公式独立于评论服务运行。配置加载失败时仍可阅读和切换章节。

部署时，脚本 `scripts/generate_firebase_config.py` 从以下 GitHub Actions Secrets 生成公开的浏览器配置；本地调试也可设置相同环境变量后运行该脚本：

| 环境变量 / Secret | 用途 | 必需 |
| --- | --- | --- |
| `FIREBASE_API_KEY` | Firebase Web API key | 是 |
| `FIREBASE_AUTH_DOMAIN` | 登录域名 | 是 |
| `FIREBASE_PROJECT_ID` | 项目 ID | 是 |
| `FIREBASE_APP_ID` | Web App ID | 是 |
| `FIREBASE_STORAGE_BUCKET` | 存储桶 | 否 |
| `FIREBASE_MESSAGING_SENDER_ID` | 消息发送者 ID | 否 |
| `FIREBASE_MEASUREMENT_ID` | Analytics ID | 否 |

全部未配置时关闭评论；部分配置且缺少必需项时构建会报告变量名。使用 JSON 序列化，不把变量值直接插入 shell 或 JavaScript 源码。生成的配置用于静态网站，会被浏览器下载，不能放入服务账号私钥等服务端凭据。Firebase 官方说明：[Web 配置对象包含公开的项目标识](https://firebase.google.com/docs/web/learn-more#config-object)。

Firebase 控制台需启用 GitHub 登录提供商、添加网站域名并配置 Firestore 访问规则。前端登录检查不能替代数据库规则：应在服务端校验用户身份、评论作者、内容长度及允许修改的字段。此次代码检查未读取或修改线上 Firebase 规则。

评论继续使用笔记源路径和从零开始的章节索引标识。重命名文件或调整二级标题顺序会改变对应关系，已有评论需要另行迁移。

检查结果和已知边界见 [检查记录](docs/audit.md)。
