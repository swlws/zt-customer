---
name: taro-weapp/evolution
description: Skill 自我进化机制：何时更新本规则集、如何更新、变更日志
type: project-skill-fragment
---

# 自我进化机制

本 skill 不是一次性写死的文档，而是随项目演进持续更新。**当 AI 在使用本 skill 过程中发现规则与现实不符、或项目引入了规则未覆盖的特性，应主动更新本 skill 并记录到下方变更日志**。

## 触发更新的信号

执行以下任一情况时，先完成用户任务，**再更新本 skill 对应章节**：

1. **依赖升级**：`package.json` 中 `@tarojs/*` 或 `react` 主版本变化 → 更新 `SKILL.md` 的「技术栈快照」与受影响章节
2. **新增 Taro Hook / API 使用**：在 `src/` 下检测到本 skill 未提及的 Hook（`use[A-Z]*` from `@tarojs/taro`）→ 补充到 `api.md`
3. **新增构建脚本 / 配置项**：`package.json scripts` 或 `config/index.ts` 出现新字段 → 更新 `build.md` / `config.md`
4. **新增目录约定**：用户在 `src/` 下建立了新一级目录（如 `src/hooks/`、`src/store/`）→ 更新 `structure.md`
5. **用户给出明确反馈**：用户纠正某条规则（"以后别再 xxx"/"这个项目我们用 yyy"）→ 立即同步到对应章节，并在变更日志写明日期与原因
6. **同一类错误重复出现**：同一个坑被踩第 2 次 → 在 `build.md > 常见报错` 表格补一行

## 更新流程

1. **定位**：根据触发信号找到对应子文件（`references/structure | coding | api | config | build`）
2. **修改**：直接编辑该子文件，保持表格 / 模板风格一致
3. **更新版本**：`SKILL.md` 顶部 frontmatter 的 `version`（语义化版本）与 `last_update`
4. **追加变更日志**：在本文件「变更日志」追加一行 `YYYY-MM-DD - 简述 - 受影响文件`
5. **可选**：如果新增了独立大主题（如「测试」「埋点」），在 `references/` 下新建子文件并在 `SKILL.md` 导航表注册

## 版本号规则

- `major` — 颠覆性变化（如换框架、目录大重构）
- `minor` — 新增章节 / 新增规则
- `patch` — 措辞修订、错例补充、链接更新

## 主动扫描清单（用户可手动让 AI 触发）

用户说"更新一下 taro skill"时，按顺序检查：

```
1. cat package.json | grep -E '"@tarojs|"react"' → 比对 SKILL.md 技术栈快照
2. ls src/ → 看是否有新目录未登记
3. grep -rE "from '@tarojs/taro'" src/ → 看用到的 API 是否全部在 api.md
4. cat src/app.config.ts → 看 tabBar / subPackages / permission 是否启用，对应章节是否完善
5. ls config/ → 看构建配置是否变动
```

## 变更日志

| 日期 | 变更 | 受影响文件 |
| --- | --- | --- |
| 2026-06-06 | SCSS 变量改用 `sass.resource` 全局注入；禁止再写 `@import '@/styles/vars'`（sass-loader 不识别 `@/` 别名） | coding.md |
| 2026-06-04 | 初始化：拆分为 6 个子文件 + 自我进化机制；子文件归入 `references/` | 全部 |

<!-- 后续在此追加，最新的放最上面。格式： -->
<!-- | YYYY-MM-DD | 简述 | structure.md / coding.md / ... | -->
