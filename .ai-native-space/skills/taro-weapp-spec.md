# Taro 微信小程序开发规范

> 基于 Taro 4.2.0 + React 18 的小程序开发规范

## 如何使用本技能

```bash
/skill taro-weapp-spec
```

调用时会输出：
- 项目结构约定
- 编码规范指引  
- API 开发模式
- 状态管理方案
- 构建部署流程
- 测试策略

---

## 目录结构

```
src/
├── app.tsx              # 应用入口
├── app.config.ts        # 应用配置
├── components/          # 公共组件
├── pages/               # 页面组件
│   └── [page-name]/
│       ├── index.tsx
│       ├── index.scss
│       └── index.config.ts
├── store/               # Redux store
├── services/            # API 服务层
├── utils/               # 工具函数
└── types/               # 类型定义
```

## 核心规范

| 类别 | 规范 |
|------|------|
| **框架** | Taro 4.2.0 + React 18 |
| **样式** | SCSS + BEM 命名 |
| **状态** | Redux Toolkit |
| **API** | 统一 request 封装 |
| **校验** | TypeScript strict 模式 |

## 参考文档

- [Taro 官方文档](https://docs.taro.zone/) ← 点击可跳转
- [Redux Toolkit 指南](https://redux-toolkit.js.org/tutorials/quick-start)
- [ESLint 配置](https://eslint.org/docs/latest/use/configure)
- [WeChat MiniProgram 规范](https://developers.weixin.qq.com/miniprogram/dev/framework/)

## 自我进化机制

> 当项目中发现新的 Taro 特性或最佳实践时，自动添加到本技能中

### 触发条件
- 检测到新的 `@tarojs/*` 依赖版本变更
- 发现项目中使用了新的 Taro API（如 `useReady`, `usePullDownRefresh` 等）
- 新增的构建脚本或配置项

### 自动更新流程
1. **扫描阶段**: 执行 `grep -r "use[A-Z]" src/` 识别新的 Taro Hook 用法
2. **分析阶段**: 对比 `package.json` 中 `@tarojs/*` 版本，生成变更报告  
3. **更新阶段**: 在 `SKILL.md` 对应章节追加新特性说明，更新版本号
4. **通知阶段**: 在此处添加变更日志

### 当前版本
- **Taro**: 4.2.0
- **React**: 18.x
- **Last Update**: 2026-06-03

### 变更日志
```
2026-06-03 初始化技能，纳入项目现有结构
```

---

## 快速开始

```bash
# 开发
npm run dev:weapp

# 构建  
npm run build:weapp

# 代码检查
npm run lint
```

## 常见问题

**Q: 如何跨页面共享状态？**  
A: 使用 Redux Toolkit，在 `store/` 新建 slice。

**Q: 如何处理异步 API？**  
A: 在 `services/api.ts` 中统一处理，返回 `{ code, data, msg }` 结构。

**Q: 如何优化首屏加载？**  
A: 使用 `lazyload` 实现按需加载，减小首页包大小。