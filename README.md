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
- 球队备注与预测仍使用原 localStorage 键，仅保存在当前浏览器，不随 Git 跨电脑同步，也不上传这些私人数据。

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

## Learn More

- [vinext Documentation](https://github.com/cloudflare/vinext)
- [Drizzle D1 Guide](https://orm.drizzle.team/docs/get-started/d1-new)
