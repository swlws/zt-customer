---
name: taro-weapp
description: Taro 4.2 + React 18 微信小程序开发主索引。触发场景：新建/修改页面、新建组件、调用 Taro API、配置 app.config/页面 config、写小程序样式（rpx/SCSS）、路由/请求/状态、tabBar/分包、构建调试相关问题。
type: project-skill
version: 1.1.0
last_update: 2026-06-06
entry: true
---

# Taro 微信小程序开发 Skill（索引）

> 适用仓库：Taro **4.2.0** + React **18** + TypeScript + Sass，编译以 **weapp** 为主、多端共存。

## 何时启用

满足任意一项即应用本 skill：

- 改动 `src/pages/**`、`src/components/**`
- 调用 `@tarojs/taro` 的 API / Hook
- 改 `app.config.ts` 或任意页面 `*.config.ts`
- 路由跳转 / 网络请求 / 登录态 / 缓存
- 改 `config/index.ts`、`project.config.json`、`tsconfig.json`
- 调样式（`rpx` / SCSS / pxtransform）

不适用：与小程序运行时无关的纯 Node 脚本。

## 子规则导航（按需加载）

子文件位于 `references/`，按需读取，不要全量加载。

| 文件 | 加载时机 |
| --- | --- |
| [references/structure.md](./references/structure.md) | 新建页面 / 组件 / 目录调整 |
| [references/coding.md](./references/coding.md) | 写 TS/TSX、命名、路径别名、样式 |
| [references/api.md](./references/api.md) | 调用 Taro API、生命周期、路由、请求、Storage |
| [references/config.md](./references/config.md) | 改 `app.config.ts` / 页面 config / tabBar / 分包 |
| [references/build.md](./references/build.md) | 构建、调试、多端差异、常见报错 |
| [references/evolution.md](./references/evolution.md) | 自我进化机制、版本同步、变更日志 |

## 硬性自查（生成代码后逐条核对）

- [ ] 页面三件套齐全，根 class = 目录 kebab-case
- [ ] 新页面已在 `src/app.config.ts` 注册
- [ ] 平台 API 全部走 `@tarojs/taro`，无 `wx.*` / `window` / `document`
- [ ] src 内部 import 用 `@/` 别名，无 `../../../`
- [ ] 网络请求经 `src/services/request.ts` 封装
- [ ] 样式以 `rpx` 为主，无内联主题色
- [ ] 无 `any`（特殊场景需注释说明）
- [ ] 不擅自创建 README / 文档文件

## 当前技术栈快照

- Taro: 4.2.0
- React: 18.x
- TypeScript: 5.x（`strictNullChecks` on）
- 样式：Sass + `pxtransform`（设计稿 750）
- 构建：webpack5
- 路径别名：`@/* -> src/*`

> 版本同步与变更追踪见 [references/evolution.md](./references/evolution.md)。
