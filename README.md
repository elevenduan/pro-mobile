# pro-mobile

基于 React 和 Ant Design Mobile 的移动端业务组件库。

## 安装

```bash
pnpm add pro-mobile antd-mobile antd-mobile-icons dayjs
```

## 使用

```tsx
import { ProInput, ProNumber } from "pro-mobile";

export function Example() {
  return (
    <>
      <ProInput label="邮箱" name="email" />
      <ProNumber label="金额" name="amount" />
    </>
  );
}
```

## 构建与发布

```bash
pnpm build
pnpm pack --dry-run
pnpm publish
```

`pnpm build` 会生成 ESM 和 TypeScript 声明文件到 `dist`。Ant Design Mobile、图标库和 dayjs 作为 peer dependencies，由使用方安装和管理。

发布前请将 `package.json` 中的 `name` 改为你拥有的 npm 包名，并更新 `version`。
