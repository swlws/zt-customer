# Taro 微信小程序 项目结构

## 目录说明

```
src/
├── app.tsx              # 应用入口
├── app.config.ts        # 应用全局配置
├── components/          # 公共组件
│   ├── Button/
│   │   ├── index.tsx
│   │   └── index.scss
├── pages/               # 页面目录，每个页面一个子目录
│   └── index/
│       ├── index.tsx
│       ├── index.scss
│       └── index.config.ts
├── store/               # Redux store（或 MobX）
├── services/            # API 服务层
├── utils/               # 工具函数
└── types/               # TypeScript 类型定义
```

## 约定

- 每个页面必须包含 `index.tsx`、`index.scss` 与 `index.config.ts`（或 `.js`) 三件套。  
- 组件统一使用 **PascalCase** 命名，文件采用 **kebab-case** 或 **camelCase** 命名。  
- 公共资源（图片、样式、脚本）统一放在 `public/` 目录下，静态资源通过相对路径引用。  
- 所有业务相关代码放入 `services/` 与 `utils/`，避免在页面目录直接写业务逻辑。  