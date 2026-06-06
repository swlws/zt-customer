---
name: taro-weapp/coding
description: TS/TSX 编码规范、路径别名、SCSS/rpx 样式规则
type: project-skill-fragment
---

# 编码规范

## TypeScript

- 启用 `strictNullChecks`；新增代码必须带类型
- 禁止 `any`，必要时用 `unknown` + 类型守卫，并写注释说明
- 公共类型放 `src/types/` 或对应模块的 `types.ts`
- React 组件 props 用 `interface XxxProps`，函数组件签名：

```tsx
interface CardProps {
  title: string
  onTap?: () => void
}

export default function Card({ title, onTap }: CardProps) {
  return <View onClick={onTap}>{title}</View>
}
```

## React

- 一律函数组件 + Hooks，**禁止类组件**
- `useEffect` 必须写依赖数组；副作用清理放 return
- 自定义 Hook 以 `use` 开头，放 `src/hooks/`

## 路径与导入

- src 内部用别名：`import Foo from '@/components/Foo'`
- 同目录或父目录的紧邻文件可用相对路径（`./`、`../`）
- 出现 `../../../` 即应改成 `@/`

导入顺序（用空行分组）：

1. React / 框架
2. 第三方库
3. `@tarojs/*`
4. `@/` 项目内
5. 相对路径
6. 样式 `import './index.scss'` 放最后

## 样式（SCSS）

- 单位：布局尺寸用 `rpx`（设计稿 750）；hairline、字号细节可用 `px`；**强制不转换**用 `Px`（大写 P），如 `1Px`
- 命名：BEM `block__element--modifier`，与组件根 class 对齐
- 主题色 / 间距 / 字号统一走 `src/styles/_vars.scss`，**已通过 `config/index.ts` 的 `sass.resource` 全局自动注入**，**任何页面 / 组件 `.scss` 文件都不要再写 `@import '@/styles/vars'`**（`@/` 是 TS path 别名，sass-loader 不识别，会报找不到文件）
- 全局样式只放 `src/app.scss`；其余必须组件内 `import './index.scss'`
- 不在 `.tsx` 写主题相关内联样式；动态尺寸/位置可内联

```scss
// pages/order-list/index.scss
.order-list {
  padding: 24rpx;

  &__item {
    height: 120rpx;
    border-bottom: 1Px solid $color-border;

    &--disabled { opacity: .5; }
  }
}
```

## 注释

- 默认不写注释；只在「为什么」非显然时写一行
- 不要写 `// added for xxx` / `// 临时方案` 这类会随时间腐烂的注释
- TSDoc 仅给对外暴露的工具 / Hook / 组件写
