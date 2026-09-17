# vinext-starter

A clean full-stack starter running on
[vinext](https://github.com/cloudflare/vinext), with optional Cloudflare D1 and
Drizzle support.

## Prerequisites

- Node.js `>=22.13.0`

## Quick Start

```bash
npm install
npm run dev
npm run build
```

This starter does not use `wrangler.jsonc`.

## Included Shape

- edit site code under `app/`
- `.openai/hosting.json` declares optional Sites D1 and R2 bindings
- `vite.config.ts` simulates declared bindings for local development
- `db/schema.ts` starts intentionally empty
- `examples/d1/` contains an optional D1 example surface
- `drizzle.config.ts` supports local migration generation when needed

## Workspace Auth Headers

OpenAI workspace sites can read the current user's email from
`oai-authenticated-user-email`.

SIWC-authenticated workspace sites may also receive
`oai-authenticated-user-full-name` when the user's SIWC profile has a non-empty
`name` claim. The full-name value is percent-encoded UTF-8 and is accompanied by
`oai-authenticated-user-full-name-encoding: percent-encoded-utf-8`.

Treat the full name as optional and fall back to email when it is absent:

```tsx
import { headers } from "next/headers";

export default async function Home() {
  const requestHeaders = await headers();
  const email = requestHeaders.get("oai-authenticated-user-email");
  const encodedFullName = requestHeaders.get("oai-authenticated-user-full-name");
  const fullName =
    encodedFullName &&
    requestHeaders.get("oai-authenticated-user-full-name-encoding") ===
      "percent-encoded-utf-8"
      ? decodeURIComponent(encodedFullName)
      : null;

  const displayName = fullName ?? email;
  // ...
}
```

## Optional Dispatch-Owned ChatGPT Sign-In

Import the ready-to-use helpers from `app/chatgpt-auth.ts` when the site needs
optional or required ChatGPT sign-in:

- Use `getChatGPTUser()` for optional signed-in UI.
- Use `requireChatGPTUser(returnTo)` for server-rendered pages that should send
  anonymous visitors through Sign in with ChatGPT.
- Use `chatGPTSignInPath(returnTo)` and `chatGPTSignOutPath(returnTo)` for
  browser links or actions.
- Pass a same-origin relative `returnTo` path for the destination after sign-in
  or sign-out. The helper validates and safely encodes it.
- Mark protected pages with `export const dynamic = "force-dynamic"` because
  they depend on per-request identity headers.

Dispatch owns `/signin-with-chatgpt`, `/signout-with-chatgpt`, `/callback`, the
OAuth cookies, and identity header injection. Do not implement app routes for
those reserved paths. Routes that do not import and call the helper remain
anonymous-compatible.

SIWC establishes identity only; it does not prove workspace membership. Use the
Sites hosting platform's access policy controls for workspace-wide restrictions,
or enforce explicit server-side membership or allowlist checks.

Use SIWC for account pages, user-specific dashboards, saved records, and write
actions tied to the current ChatGPT user. Leave public content anonymous.

## Useful Commands

- `npm run dev`: start local development
- `npm run build`: verify the vinext build output
- `npm test`: build the starter and verify its rendered loading skeleton
- `npm run db:generate`: generate Drizzle migrations after schema changes

## Cloudflare Pages production

The GitHub-connected Cloudflare Pages project uses:

- Production branch: `main`
- Build command: leave empty
- Build output directory: `public`
- Root redirect: `/europa-league-2026/`
- Live-data API: `functions/api/uel-live.ts`

For local Pages verification, run `npx wrangler pages dev public`.

## 多电脑协作规则（所有后续修改必须遵守）

- 本站正式目录为 `public/europa-league-2026/`；API 为 `app/api/uel-live/route.ts`，由 `functions/api/uel-live.ts` 调用。不要把旧副本 `public/site/europa-league-2026/` 当作部署入口。
- 每台电脑开始前先 `git fetch origin`，检查 `git status` 和远端变更；干净工作区可 `git pull --ff-only`。保留已有未提交工作，发生冲突先核对，不强制覆盖。
- 每次上传必须在本 README 记录日期、功能、关键文件、数据口径、测试、限制；文档与代码同一提交。
- 推送前再次 fetch，确认其他电脑没有新提交；禁止 force push。推送后核对 Cloudflare Pages 部署状态及线上资源。
- 球队备注与预测仅保存在当前浏览器，不随 Git 跨电脑同步，也不上传这些私人数据。2026/27 保留原 localStorage 键，历史赛季按赛季键隔离，避免不同赛季互相覆盖。

## 2026-09-15 · 接入 2025/26 与 2024/25 完整历史赛季

### 用户可见功能

1. 顶部赛季入口改为可访问的下拉选择器，支持 `2026/27`、`2025/26`、`2024/25`；选择结果写入 URL 的 `?season=` 和本机 localStorage，刷新或复制链接后仍可复现。切换赛季时会尽量返回原页面，并保留晋级图内部的“资格赛 / 联赛统计 / 正赛”标签。
2. 两个历史赛季均接入积分榜、四档名单、144 场联赛阶段赛程与赛果、8 轮全景矩阵、每轮统计、资格赛两回合、真实淘汰赛和决赛；最近赛果默认 8 场，展开后显示联赛阶段及淘汰赛全部 189 场。
3. 历史赛季积分榜使用 UEFA 官方最终排名，不用本地简化排序替代同分规则；每队保持 8 场、四主四客，矩阵每轮 18 场。比赛详情显示所选赛季数据，赛程页对已结束比赛显示比分。
4. 历史赛季明确为只读静态归档：按钮显示“重新载入归档”，不请求 `/api/uel-live`，不混入 2026/27 在线数据，也不提供赛前预测编辑。球队备注和预测按赛季命名空间隔离，当前赛季原键不变。
5. 顶部数据状态对历史赛季分别显示联赛赛果、资格赛、淘汰赛的“完整静态归档”、生成时间、覆盖日期和场数，不把静态归档误报为本次在线更新成功。页面标题、赛季说明、决赛日期/球场及来源文字随赛季切换。

### 官方数据口径

- 2024/25 共收录 269 场已结束比赛：资格赛 80、联赛阶段 144、淘汰赛 45；最终排名 36 队；决赛为托特纳姆热刺 1–0 曼联（2025-05-21，圣马梅斯）。
- 2025/26 共收录 271 场已结束比赛：资格赛 82、联赛阶段 144、淘汰赛 45；最终排名 36 队；决赛为阿斯顿维拉 3–0 弗赖堡（2026-05-20，贝西克塔斯公园球场）。
- 比赛、比分、轮次、开球时间、半场比分、球队徽标来自 UEFA `match.uefa.com` 官方结构化比赛接口；最终积分榜来自 `standings.uefa.com`；四档名单按 UEFA 当季官方分档公告固定存档。无法可靠分类的历史参赛路径明确显示“未分类”，不根据结果反推或伪造。
- `scripts/generate-uel-season-archives.mjs` 可重新拉取并生成 `public/europa-league-2026/season-archives.js`。生成器会硬性校验阶段场数、36 队、每队 8 场、每轮 18 场、四档各 9 队、最终排名 1–36 以及决赛冠军；任一条件不符即停止写出。

### 关键实现文件

- `season-context.js`：赛季解析、URL/localStorage 状态、选择器、页面文案及原页面恢复。
- `season-archives.js` / `archive-runtime.js`：两季生成归档及与现有页面全局数据接口的兼容层。
- `app.js`、`season-model.js`、`season-dashboard.js`、`league-ui.js`、`live-update.js`、`qualification.js`、`advancement.js`、`schedule-upgrade.js`：统一适配所选赛季、官方排名、只读历史详情、统计和来源状态。
- `data-sync-utils.js`：紧凑联赛赛程缺少 `stage` 时按联赛阶段识别，避免已完成赛程残留在未来列表。
- `tests/uel-archives.test.mjs`：历史归档结构与足球数据不变量；现有页面交互测试增加 2025/26 历史赛季无在线请求的回归覆盖。
- `package.json`：开发、构建、启动脚本改为 Windows/Linux 均可执行的写法；默认测试加入 API 与历史归档校验。

### 验证、限制与复现

- `npm test` 通过：vinext/Cloudflare 构建完成，10 项默认测试通过，覆盖服务器渲染、现有 API、合并去重与两季归档完整性。
- 临时安装 jsdom 后执行 `node --test tests/uel-season.test.mjs`，5 项交互测试通过；历史 2025/26 页面断言 36 行最终积分榜、144 场赛程、189 场正赛赛果、288 个矩阵单元，并确认没有调用当前赛季在线接口。
- 新增及修改的 JavaScript 均通过 `node --check`，`git diff --check` 通过。Codex 浏览器无法访问本机预览（`nodeRepl.fetch request failed`），因此没有将 jsdom 结果冒充真实浏览器截图；发布后仍需人工检查桌面和手机的视觉比例。
- 历史赛季是随 Git 发布的可复现快照，不会随“更新数据”按钮变化。若 UEFA 事后修订官方数据，应在联网环境重新运行生成器、复查差异，并把生成文件和 README 同次提交。
- 本次不修改 2026/27 原始赛程/资格赛基线、不重建 Cloudflare 项目；推送 `main` 后沿用既有 Cloudflare Pages Git 集成自动部署。

## 2026-09-15 · 欧罗巴赛果、联赛统计与数据状态升级

### 功能变更

1. “最新赛果”改为独立页面，积分榜不再夹带赛果；默认最新 8 场已结束正赛，展开后显示联赛阶段以来全部联赛/淘汰赛赛果。按阶段/轮次、日期分组，保留原卡片内容与详情/预测入口；资格赛独立保留。
2. 晋级图增加“资格赛晋级图 / 联赛阶段统计 / 正赛晋级图”三标签；资格赛路径、两回合和欧冠转入标记不变；正赛赛制示意与真实淘汰赛赛果分开，没有官方对阵时不推测晋级。
3. 联赛统计增加 36 队 × 8 轮全景矩阵、轮次选择、每轮指标与八轮对比；扩大内容宽度，取消矩阵内部固定高度/纵向滚动，使用网页整体纵向滚动；窄屏保留横向滚动和可用的顶部导航。
4. 矩阵和赛果共用档位分类：绿=高档胜低档；红=低档获胜或跨档平局；黄=同档平局；蓝=同档分胜负；灰=未知档位/待赛。第 1 档最高；矩阵胜平负相对于该行球队，比分始终为主队–客队。
5. 每轮已结束场次、总进球、场均进球、平局比例、主/平/客场次、双方进球比例、总进球≥3比例、跨档低档获胜场次。无样本比例显示“—”，不以待赛场次为分母。
6. 顶部可展开数据状态分别显示联赛、资格赛、淘汰赛来源、检查时间、本会话上次成功、最新已结束比赛日期和场数。区分在线核对、缓存/本地快照、不可用/暂无数据；不再将资格赛网页成功误报为全部阶段更新成功。

### 数据与实现

- 新增 `season-model.js`：统一分类、赛程合并、去重和统计。联赛轮次优先接口明确字段，再用随站官方赛程的同主客队匹配；不按日期或每18场推测轮次。延期更新保留原轮次，避免矩阵双份计数。
- 新增 `season-dashboard.js` / `.css`：页面切换、分组赛果、矩阵、统计、正赛标签和状态面板。`index.html` 加载入口；`competition-info.js` 移除旧赛果锚点滚动。
- `live-update.js` 保留轮次元数据，校验赛果结构、设置请求超时，通知统一面板；保留原备注、预测和比赛详情。`data-sync-utils.js` 按阶段+主客队识别延期赛事，不因日期变动重复。
- API 新增 `coverage`，区分资格赛页面回退与结构化赛程接口；明确识别淘汰赛附加赛、十六强、八强、半决赛、决赛。未知轮次拒绝声称完整结构化同步；半场 null 不转成虚假的 0–0。
- UEFA 分页不再固定截断于 240 条，继续请求后续页直到结束，并保留安全上限；失败继续提供原有验证快照。
- 本次不更换球队名单/赛程快照、不增加历史赛季，不修改其他足球站点、旧目录、Cloudflare 项目或部署配置。API 成功表示在线核对该数据源，不保证源自身没有漏场；面板始终显示实际数量和覆盖日期。

### 验证与复现

- Node 24：`node --test tests/uel-season.test.mjs tests/uel-api.test.mjs`，6 项测试通过。覆盖 36/144/288、8×18、延期去重、颜色、分组展开、页面切换、比赛点击、备注保留、部分成功/失败、淘汰赛识别、分页、null 半场。
- 交互测试需要 jsdom 26：可在临时目录 `npm install --prefix <临时目录> jsdom@26`，PowerShell 设置 `$env:UEL_JSDOM_PATH='<临时目录>\node_modules\jsdom'` 后执行上述测试，不需更改本站生产依赖。
- API 使用 TypeScript 5.9：`tsc --noEmit --target es2022 --module esnext --lib es2022,dom app/api/uel-live/route.ts` 通过；新增 JS 语法检查及 `git diff --check` 通过。
- 浏览器预览连接报 `nodeRepl.fetch request failed`，未完成真实浏览器截图/视觉验收；上述交互验证使用 jsdom，不冒充浏览器视觉测试。窄屏样式仍建议发布后人工查看。
- 发布方式：代码及 README 同次推送 `main`，由已有 Cloudflare Pages Git 集成自动部署；这不是重新创建站点。

## 2026-09-15 · 比赛详情双列积分榜修复

- 原因：旧积分榜 36 行整体在固定视口高度内垂直居中，没有可用的列表滚动，导致标题、榜首和榜尾被裁切。
- 新增 `match-modal.js` / `match-modal.css`，由正式站点 `index.html` 最后加载。宽屏左侧 52% 显示积分榜、右侧 48% 显示详情；积分榜分成 1–18、19–36 两组，每组有固定分组标题与列名。中文队名可换行，英文名在 title 中保留。本场两队高亮，8/24 位增加分界线；赛前明确序号不是正式排名。
- 列表在较矮屏幕可滚动且不裁切；增加定位主队/客队。1540px 及以下切换“比赛详情 / 积分榜”，不再隐藏积分榜入口；600px 以下积分榜两组上下排列，保证文字可读。
- 顶部关闭按钮常驻；支持 Esc、键盘焦点约束与关闭后焦点恢复。打开锁定背景滚动，关闭恢复原 overflow/padding；新比赛详情滚动归零，详情标签仅滚动详情容器。
- `live-update.js` 增加弹层初始化和请求序号检查，避免较慢的旧比赛请求覆盖新比赛；保留预测及备注存储键、比分和数据来源，不变更 API 或联赛全景矩阵滚动规则。
- 验证：原 6 项自动化测试增加双组各18队、第1/36位、本场高亮、窄屏切换状态、滚动归零、Esc恢复背景、预测编辑入口检查；JS语法与 diff 检查。交互测试采用 jsdom，不等于真实浏览器截图/缩放视觉验收。
- 与 README 同次提交至 main，沿用 Cloudflare Pages 自动部署；开始和推送前检查远端，避免覆盖其他电脑修改。

## 2026-09-15 · 补齐赛程安排卡片与北京时间

- 本次补齐此前未迁移的欧冠赛程能力：`schedule-upgrade.js` 统一赛程卡片，显示中英文球队名、抽签档位、欧罗巴参赛来源、可用的轮次、预测摘要及详情入口；`schedule-upgrade.css` 提高内容密度、减少无意义留白，橙色主题保留，桌面三列/平板两列/手机单列。
- 当前欧罗巴名单没有已核实的上赛季国内排名与欧战表现，明确显示“待核实”。未知不标记为未参赛，不借用欧冠成绩、不伪造历史名次。本次没有新增历史数据采集源。
- 欧洲中部原始赛程通过 Intl 的 Europe/Zurich 与 Asia/Shanghai 时区规则转换为北京时间，自动处理夏令时、冬令时及跨日/跨年。按转换后的日期分组和时间排序，未知开球时间明确保留“原赛程日期”，不虚构时间。详情顶部与赛程卡片使用同一时间转换。
- 移除前9个日期限制，显示全部已获取待赛；当前静态144场联赛赛程全部可到达，未来远程赛程继续合并去重。
- 只转换展示：原比赛日期、主客队、预测 localStorage 键不变，详情依旧收到原始比赛标识；保存预测后赛程摘要继续刷新。
- 修改正式目录 index.html 的脚本顺序与缓存版本，live-update.js 调用新渲染器，不改旧副本、API、其他站点或 Cloudflare 配置。
- 验证：7项自动化测试通过，新增夏/冬时间、跨日/跨年、待定时间、144场完整显示、288个球队信息块、详情北京时间、预测原日期键及摘要回显；JS语法及 diff 检查通过。仍未完成真实浏览器截图视觉验收，自动化交互使用 jsdom。
- 推送前再次核对远端，README与代码同次提交 main，通过已有 Cloudflare Pages 自动发布。

## 2026-09-15 · 补齐36队国内资格依据与上季欧战表现

- 根据 UEFA 2026/27 欧罗巴“Meet the league phase teams”官方档案（页面更新于2026-09-14）补齐全部36队；数据表位于 `schedule-upgrade.js`，页面说明增加可点击官方来源。
- 原“上季国内排名待核实”改为更准确的“国内资格依据”：联赛席位显示2025/26最终名次或冠军，杯赛席位显示杯赛冠军，水晶宫显示欧协联冠军。这样不会给杯赛或卫冕冠军虚构联赛排名。
- 上季欧战按赛事和最终阶段显示。UEFA标为N/A的伯恩茅斯、霍芬海姆、AC米兰、奈梅亨、皇家社会、雷恩、桑德兰、托伦斯显示“上季无欧战记录”；UEFA明确写明Did not qualify的利勒斯特罗姆、克里特OFI显示“上季未晋级欧战”，两类使用不同文字和颜色。
- 仅更新赛程球队上下文，不改当前档位、参赛路径、比赛日期/时间、预测键、积分和API。所有名称使用现有规范名匹配，欧冠/欧罗巴/欧协联阶段不互相替换。
- 验证：7项自动化测试通过；检查官方上下文恰好覆盖36队，赛程144场/288个球队信息块均不再出现待核实，并专项断言德甲第6、欧冠十六强、无欧战记录与未晋级欧战的区分。JS语法、TypeScript接口检查及diff检查通过。
- README与代码同次提交main，推送前再次fetch；由已有Cloudflare Pages Git集成部署，发布后检查线上HTML与新版资源。

## 2026-09-18 · 赛果详情、半场比分与资格赛来源补全

### 用户可见变化

1. “最新赛果”卡片恢复与“赛程安排”一致的球队信息：中英文队名、抽签档位、欧罗巴参赛路径、2025/26国内资格依据、上季欧战表现，并增加阶段/轮次、北京时间、半场数据来源和加时/点球备注。胜负配色、三列桌面布局、默认8场与展开全部保持不变。
2. 半场比分不再仅依赖官方响应中经常缺失的 `score.halfTime`：优先使用官方半场字段，其次用完整进球事件重建，全场0–0则安全确定半场0–0；事件数无法与全场比分对齐时仍显示“待核验”，不猜测。兼容 UEFA 返回的 `OWN` 与 `OWN_GOAL` 两种乌龙球编码。
3. 资格赛晋级图的第一轮、第二轮、第三轮和附加赛现在每张对阵卡都为双方球队显示来源。程序按上一轮真实胜者自动标记“上一轮晋级”，其余显示“本轮新加入”；当前赛季第三轮保留已核实的欧冠冠军路径、主路径淘汰及直接参赛说明。

### 数据与实现

- `app/api/uel-live/route.ts`：实时数据增加半场比分推导、输出质量来源和已完赛开球时间；仅当进球事件总数与全场总进球一致、且半场分项不超过全场分项时接受重建值。
- `scripts/generate-uel-season-archives.mjs` / `season-archives.js`：用同一规则从 UEFA 官方比赛和积分榜接口重新生成 2024/25、2025/26 完整归档。两季共540场比赛的半场比分现均有 `official`、`events` 或 `zero-zero` 来源，无“—”残留。
- `season-model.js` / `live-update.js`：在接口、本地比赛数组和卡片之间保留开球时间与半场质量标记。
- `season-dashboard.js` / `.css`：复用 `schedule-upgrade.js` 的球队资料组件，调整桌面/手机信息密度。
- `advancement.js`、`team-origin.css`、`origin-colors.css`：统一四轮来源推导和标签配色，历史赛季也不再统一显示“未分类”。
- `index.html` 已更新上述数据、脚本和样式的缓存版本，避免 Cloudflare Pages 发布后浏览器继续使用旧资源。

### 验证与限制

- `npm test` 通过：11项构建/API/归档测试，包括不可核验半场不猜测、进球事件重建、0–0逻辑、分页和两季归档完整性。
- `node --test tests/uel-season.test.mjs` 通过：5项 jsdom 交互测试，断言赛果卡片的双方资料块、半场来源、当前赛季40组对阵/80个球队来源标签，以及历史赛季独立运行。
- 新增及修改的浏览器 JavaScript 均通过 `node --check`；vinext/Cloudflare 构建通过。仓库整体 `tsc --noEmit` 仍会因现有 `cloudflare:workers`、`Fetcher` 和 `D1Database` 类型未在全局 TypeScript 环境声明而报错，与本次 API 逻辑无关。
- 资格赛“本轮新加入”表示该队未出现在上一轮欧罗巴对阵；除已有 UEFA 精确路径数据的第三轮外，不额外猜测其为国内直通或欧冠转入。

## Learn More

- [vinext Documentation](https://github.com/cloudflare/vinext)
- [Drizzle D1 Guide](https://orm.drizzle.team/docs/get-started/d1-new)
