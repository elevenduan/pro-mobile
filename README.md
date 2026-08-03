# pro-mobile

基于 React 和 Ant Design Mobile 的移动端业务组件库。

## 安装

```bash
pnpm add @bigflower/pro-mobile
```

## 使用

```tsx
import { ProInput, ProNumber } from "@bigflower/pro-mobile";

export function Example() {
  return (
    <>
      <ProInput label="邮箱" name="email" />
      <ProNumber label="金额" name="amount" />
    </>
  );
}
```
