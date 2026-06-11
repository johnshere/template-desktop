# Vue 桌面端工程模板

基于 Vue 3 + Vite 的桌面端 SPA 模板，自带 qiankun 子应用支持、Element Plus、@yzcfront/ui-base 与一套约定式 layout。

## 使用本模板

1. **全局替换工程名**：模板里到处有 `bidagent` 字样（package.json 的 name、qiankun 子应用名、base path、DOM 容器 id 等），先全局替换成你的工程名（建议小写无连字符）：
   ```bash
   git grep -l bidagent | xargs sed -i 's/bidagent/your-app/g'
   ```
   这会一次性更新 `package.json`、`index.html`、`main.ts`、`App.vue`、`vite.config.ts`、ESLint 规约（`append-to` 的 id）等。
2. **改 `vite.config.ts` 的 proxy.target** 指向你的网关；调整 `server.port` 避免端口冲突。
3. **删示例 layout**：`src/pages/(default)/`、`auth/`、`admin/` 是 demo，可按需保留扩展或删除。
4. **`.npmrc` 私服**：默认 `@yzcfront/*` 走公司 nexus，不用私包就把那行删掉。
5. **CLAUDE.md 自身**：删掉本"使用本模板"小节，把下面的"本模板"改成"本工程"。

## 启动命令

```bash
pnpm i              # 首次安装（注意需先配 .npmrc 私服）
pnpm dev            # 本地开发，端口 6096
pnpm build          # 生产构建
pnpm lint           # ESLint --fix
pnpm format         # Prettier 全量格式化
pnpm type-check     # vue-tsc 增量类型检查
pnpm yapi           # 拉取 yapi 生成 TS 类型 + lint
pnpm release        # release-it 出 CHANGELOG + 打 tag
```

## 技术栈

- Vue 3.5 + Vite 7 + TypeScript 5.9
- vue-router 5（**约定式路由**，由 vue-router 内置的 `vue-router/vite` 插件生成）
- Pinia 状态管理
- Element Plus（按需导入）+ @yzcfront/ui-base（U 系列业务组件）
- qiankun 微前端（vite-plugin-qiankun）
- dayjs 日期库
- SCSS + postcss-pxtorem（rem 适配）
- ESLint 9 flat config + Prettier
- husky + lint-staged + commitlint + release-it

## 目录结构

```
src/
├── main.ts                 应用入口（含 qiankun 生命周期）
├── App.vue                 根组件
├── setup-components.ts     全局组件 / 指令注册位（已挂 @yzcfront/ui-base）
├── pages/                  约定式路由：文件即路由
│   └── index.vue           → /
├── components/             业务组件
├── router/                 路由初始化
├── stores/                 Pinia store
├── libs/                   业务无关工具（message-alert / runtime-env / log）
├── api/                    接口层（yapi 生成放 src/api/yapi）
├── assets/                 静态资源
│   └── style/              全局 SCSS（element-namespace 自动注入）
└── types/                  类型声明（env / vite-plugin-qiankun shim）
```

## 路由（约定式）

`src/pages/**/*.vue` → 自动生成路由：

### 模板现有 layout 分组

| 文件 | URL | layout |
|---|---|---|
| `pages/(default).vue` | `/` 系列父路由 | 默认前台 layout（顶栏 + 内容区） |
| `pages/(default)/index.vue` | `/` | — |
| `pages/auth.vue` | `/auth/*` 父路由 | 认证 layout（居中卡片） |
| `pages/auth/login.vue` | `/auth/login` | — |
| `pages/admin.vue` | `/admin/*` 父路由 | 后台 layout（左侧栏） |
| `pages/admin/dashboard.vue` | `/admin/dashboard` | — |

**为什么默认 layout 用 `(default)` 括号语法、其它用普通文件夹**：

- `(name).vue` 是 vue-router 5 的**分组语法**，URL 不带 `(name)`，路由父级 path 是 `/`；
- `name.vue + name/` 是 vue-router 5 的**嵌套路由**，URL 带 `/name` 前缀；
- **多个分组父路由共用 path `/` 会冲突**（按字母序匹配，错位渲染 layout）；
- 所以约定：**默认 layout 用 `(group)` 占住根路径，其它 layout 都用 URL prefix**。

### 一般约定式路由

| 文件 | URL |
|---|---|
| `pages/chat.vue` | `/chat` |
| `pages/chat/[sessionId].vue` | `/chat/:sessionId` |
| `pages/settings/account.vue` | `/settings/account` |
| `pages/[...path].vue` | catch-all |

类型自动生成到 `typed-router.d.ts`，**入库**，借 `.gitattributes merge=union` 缓解冲突。

### typed routes 使用约定

vue-router 5 的 `useRoute()` 在不传参时返回**所有路由 union**，访问动态参数会被 TS 拒绝。**必须显式传入路由名**让它收窄：

```ts
// ❌ params 类型是 Record<never, never> | { id: string }，访问 .id 报错
const route = useRoute()
route.params.id

// ✅ 收窄到 { id: string }
const route = useRoute('/test/[id]')
route.params.id        // string

// ✅ 泛型写法等价
const route = useRoute<'/test/[id]'>()
```

路由名规则 = `pages/` 下的相对路径，跟生成的 `typed-router.d.ts` 里的 key 一致：

| 文件 | 路由名 | params |
|---|---|---|
| `pages/test/[id].vue` | `'/test/[id]'` | `{ id: string }` |
| `pages/chat/[sessionId].vue` | `'/chat/[sessionId]'` | `{ sessionId: string }` |
| `pages/users/[id]/posts/[postId].vue` | `'/users/[id]/posts/[postId]'` | `{ id: string; postId: string }` |
| `pages/[...path].vue` | `'/[...path]'` | `{ path: string[] }`（catch-all） |
| `pages/users/[id]?.vue` | `'/users/[id]?'` | `{ id?: string }`（可选） |

**为什么必须手动传**：`useRoute()` 是普通函数，TS 静态分析阶段无法判断"当前在哪个路由组件里"——这个 hook 可能在 composable、第三方库、子组件里被调，且一个 `.vue` 文件理论上可挂到多条路由。vue-router 5 选择"明确优于隐式"，让你自己声明当前路由名，换取强类型的 `params`。

`router.push` 也支持类型化跳转：
```ts
router.push({ name: '/test/[id]', params: { id: '123' } })
router.push('/test/123')   // 字符串形式校验路径前缀
```

## 团队规约（ESLint 已固化）

| 违规 | 替代方案 |
|---|---|
| `ElMessage.xxx` | `@/libs` 的 `alertSuccess / alertWarning / alertInfo / alertError` |
| `ElMessageBox.xxx` | `@/libs` 的 `msgBoxConfirm / msgBoxAlert` |
| `top` 全局 | `@/libs` 的 `getTopWin()` |
| Dialog `append-to-body` | 改用 `append-to="#<app>-app"`（替换模板时同步） |

## 样式约定

- 独立 `.scss` 文件、`<style>` 标签内可以用 `px`；
- 内联样式禁止 `px`，需手动 `值 * 0.01` 转 rem；
- 全局 SCSS 自动 `@use element-namespace.scss`，无需手动 import。

## 提交规约

走 conventional commits，pre-commit 会跑 `lint-staged + type-check`：

```
feat:     新功能
fix:      修 bug
refactor: 重构
chore:    构建/工具
docs:     文档
style:    格式
perf:     性能
```

## 私服 .npmrc

`.npmrc` 已配置：默认源走淘宝镜像加速公共包，`@yzcfront/*` 范围走公司私服 `nexus.uzhicai.com`。

```
registry=https://registry.npmmirror.com/
@yzcfront:registry=https://nexus.uzhicai.com/repository/npm-group/
```

## 工程化决策记录

基于对 `yzc_bidclear_front` 工程化的复盘，本模板做了以下调整：

| 决策 | 原工程 | 本模板 |
|---|---|---|
| 路由生成 | 自研 `scripts/generate-routes.ts` | vue-router 5 内置约定式（`vue-router/vite`） |
| ESLint 集成 | `vite-plugin-eslint`（已 deprecated） | `vite-plugin-checker`（同时挂 vue-tsc + eslint） |
| Vue Lint 档位 | `flat/essential`（最低档） | `flat/strongly-recommended` |
| `no-unused-vars` | `off`（装样子） | `error` |
| VueDevTools | 始终启用 | 仅 dev 启用 |
| 日期库 | moment + moment-timezone | dayjs |
| 样式体系 | Tailwind + pxtorem + SCSS | 仅 SCSS + pxtorem |
| 单测 / E2E | vitest + cypress | 不内置（按需后加） |
| `prebuild: pnpm i` | 强制重装 | 移除 |
| 多环境 .env | 无（硬编码 + 注释切换） | 同样不引入（实践不必要） |
| `manualChunks` | 字符串 split 黑名单 | Record 映射 + 包名带 `/node_modules/X/` 边界 |
| 历史依赖 | `@babel/eslint-parser` / `@rushstack/eslint-patch` | 移除 |
| `pnpm-lock.yaml` | 被 .gitignore | **必须入库** |
| `tsconfig.app.json` `moduleResolution` | `node` | `bundler` |
| `vite-plugin-qiankun` 类型 | `@ts-expect-error` 抑制 | shims-*.d.ts 补类型 |
| CI/CD | （无） | 由运维统一处理，工程内不放 |

## 调试约定

- 开发环境调试不开 localhost，使用公司浏览器代理域名（如 `portal.uzhicai.com`）；
- 任何域名都视为开发环境，浏览器代理会直接命中本地代码。

## Claude 临时文件

`工程根目录/.claude/temp/` 是 Claude 工作临时区，已加入 `.gitignore`。
