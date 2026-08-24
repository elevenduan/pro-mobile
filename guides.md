# pro-mobile 使用指南

`@bigflower/pro-mobile` 是基于 React、Ant Design Mobile 与 `rc-field-form` 的移动端业务组件库。大多数组件以 `Form.Item` 为外层，可直接放入 Ant Design Mobile 的 `<Form>` 中使用。

## 安装与引入

```bash
pnpm add @bigflower/pro-mobile antd-mobile antd-mobile-icons dayjs rc-field-form
```

```tsx
import { Form } from "antd-mobile";
import { ProInput, ProNumber, ProDatePicker } from "@bigflower/pro-mobile";
```

## 表单组件约定

除 `ProBlank`、`ProEmpty`、`ProPopup`、`ProIFrame`、`ProScrollList` 和 `ProImage` 外，组件均基于 `Form.Item`。

- `name`：字段名，类型为 `string | number | (string | number)[]`。
- `label`、`extra`、`required`、`disabled`、`messageVariables`、`hidden`、`layout`、`description`、`rules`：直接对应 `Form.Item` 的同名属性。
- `itemProps`：额外传给 `Form.Item` 的属性；不能覆盖 `name` 及上述通用表单属性。
- `fieldProps`：额外传给内部 Ant Design Mobile 控件的属性。组件自身控制的属性会被排除或优先处理。
- 当传入 `required` 时，表单组件会加入默认必填规则；传入的 `rules` 会追加在默认规则之后。

一个基础表单：

```tsx
import { Form, Button } from "antd-mobile";
import { ProInput, ProNumber, ProDatePicker } from "@bigflower/pro-mobile";

export function ProfileForm() {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      onFinish={(values) => {
        console.log(values);
      }}
      footer={
        <Button block type="submit" color="primary">
          提交
        </Button>
      }
    >
      <ProInput name="name" label="姓名" required />
      <ProNumber name="amount" label="金额" min={0} precision={2} required />
      <ProDatePicker name="birthday" label="出生日期" />
    </Form>
  );
}
```

## 布局与状态

### ProBlank

渲染一个固定高度的空白分隔块。

| 属性     | 类型     | 默认值          | 说明              |
| -------- | -------- | --------------- | ----------------- |
| `height` | `number` | `12`            | 高度，单位为 px。 |
| `color`  | `string` | `"transparent"` | 背景色。          |

```tsx
import { ProBlank } from "@bigflower/pro-mobile";

<ProBlank height={16} color="#f5f5f5" />;
```

### ProEmpty

基于 `ErrorBlock` 的空状态组件，默认标题为“暂无数据”、描述为空，且上下内边距为 `30px`。接受 Ant Design Mobile 的全部 `ErrorBlockProps`，可以覆盖默认标题和描述。

```tsx
import { ProEmpty } from "@bigflower/pro-mobile";

<ProEmpty title="暂无订单" description="完成下单后会显示在这里" />;
```

## 文本与数字输入

### ProInput

单行文本输入框，默认可清空，默认占位提示为“请输入{标签}”。

| 属性         | 类型                                                                                                                    | 说明                                                               |
| ------------ | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `name`       | `NamePath`                                                                                                              | 表单字段名。                                                       |
| `verify`     | `"isUrl" \| "isEmail" \| "isIp" \| "isIpv4" \| "isIpv6" \| "isBankNo" \| "isIdNo" \| "isMobile" \| "isUsci" \| "isSms"` | 选择内置格式校验器。字段有值且校验失败时提示“请输入正确的{标签}”。 |
| `itemProps`  | `Omit<FormItemProps, ...>`                                                                                              | 传给外层 `Form.Item`。                                             |
| `fieldProps` | `InputProps`                                                                                                            | 传给内部 `Input`，可覆盖 `placeholder`、`clearable` 等。           |

```tsx
<ProInput name="email" label="邮箱" required verify="isEmail" />
<ProInput name="phone" label="手机号" verify="isMobile" fieldProps={{ type: "tel" }} />
```

### ProNumber

数字文本输入框。输入内容会过滤为数字、负号和小数点，提交到表单的值为字符串。

| 属性         | 类型                       | 默认值 | 说明                                 |
| ------------ | -------------------------- | ------ | ------------------------------------ |
| `name`       | `NamePath`                 | -      | 表单字段名。                         |
| `min`        | `number \| null`           | `0`    | 最小值。设为 `null` 时不限制最小值。 |
| `max`        | `number`                   | -      | 最大值。                             |
| `precision`  | `number`                   | `2`    | 最大小数位；设为 `0` 时只允许整数。  |
| `itemProps`  | `Omit<FormItemProps, ...>` | -      | 传给外层 `Form.Item`。               |
| `fieldProps` | `InputProps`               | -      | 传给内部 `Input`。                   |

```tsx
<ProNumber name="price" label="单价" min={0} max={999999} precision={2} required />
<ProNumber name="quantity" label="数量" min={1} precision={0} />
```

### ProTextArea

多行文本输入框，默认显示 1 至 3 行并自动伸缩，默认占位提示为“请输入{标签}”。

| 属性         | 类型                       | 默认值                        | 说明                                                                          |
| ------------ | -------------------------- | ----------------------------- | ----------------------------------------------------------------------------- |
| `name`       | `NamePath`                 | -                             | 表单字段名。                                                                  |
| `itemProps`  | `Omit<FormItemProps, ...>` | -                             | 传给外层 `Form.Item`。                                                        |
| `fieldProps` | `TextAreaProps`            | `rows: 1`，`autoSize: 1-3 行` | 传给内部 `TextArea`，可覆盖默认行数，并设置 `maxLength`、`showCount` 等属性。 |

```tsx
<ProTextArea name="remark" label="备注" fieldProps={{ maxLength: 200, showCount: true }} />
```

### ProPassword

密码输入框，默认可清空，右侧提供明文显示切换按钮。

| 属性         | 类型                       | 说明                   |
| ------------ | -------------------------- | ---------------------- |
| `name`       | `NamePath`                 | 表单字段名。           |
| `itemProps`  | `Omit<FormItemProps, ...>` | 传给外层 `Form.Item`。 |
| `fieldProps` | `InputProps`               | 传给内部密码 `Input`。 |

```tsx
<ProPassword name="password" label="登录密码" required />
```

### ProPasswordGroup

生成“新登录密码”和“确认新密码”两个 `ProPassword` 字段。第二个字段会校验其值与第一个字段一致。

| 属性                | 类型                         | 默认值                                     | 说明                                                      |
| ------------------- | ---------------------------- | ------------------------------------------ | --------------------------------------------------------- |
| `props`             | `ProPasswordProps[]`         | `[]`                                       | 按顺序传给两个密码框的属性；默认字段名为 `pwd1`、`pwd2`。 |
| `passwordValidator` | `(value: string) => boolean` | `isPassword`                               | 新密码的校验函数。                                        |
| `passwordMessage`   | `string`                     | `"密码为8-16位字母、数字、特殊字符的组合"` | 新密码校验失败的提示。                                    |

内置 `isPassword` 默认要求 8 至 16 位、同时包含字母、数字和特殊字符。

```tsx
<ProPasswordGroup
  props={[
    { name: "newPassword", label: "新密码" },
    { name: "confirmPassword", label: "确认新密码" },
  ]}
/>
```

## 选择输入

### ProRadio

单选组，字段值为选中的 `string | number`。

| 属性         | 类型                       | 说明                                                                            |
| ------------ | -------------------------- | ------------------------------------------------------------------------------- |
| `name`       | `NamePath`                 | 表单字段名。                                                                    |
| `options`    | `ProRadioOption[]`         | 必填。每项包含 `label: ReactNode`、`value: string \| number`、可选 `disabled`。 |
| `fieldProps` | `RadioProps`               | 传给每一个 `Radio`。                                                            |
| `spaceProps` | `SpaceProps`               | 传给选项布局容器。                                                              |
| `itemProps`  | `Omit<FormItemProps, ...>` | 传给外层 `Form.Item`。                                                          |

```tsx
<ProRadio
  name="gender"
  label="性别"
  required
  options={[
    { label: "男", value: "male" },
    { label: "女", value: "female" },
  ]}
/>
```

### ProCheckbox

多选组，字段值为选中项组成的数组。

| 属性         | 类型                       | 说明                                                                            |
| ------------ | -------------------------- | ------------------------------------------------------------------------------- |
| `name`       | `NamePath`                 | 表单字段名。                                                                    |
| `options`    | `ProCheckboxOption[]`      | 必填。每项包含 `label: ReactNode`、`value: string \| number`、可选 `disabled`。 |
| `fieldProps` | `CheckboxProps`            | 传给每一个 `Checkbox`。                                                         |
| `spaceProps` | `SpaceProps`               | 传给选项布局容器。                                                              |
| `itemProps`  | `Omit<FormItemProps, ...>` | 传给外层 `Form.Item`。                                                          |

```tsx
<ProCheckbox
  name="interests"
  label="兴趣"
  options={[
    { label: "阅读", value: "reading" },
    { label: "运动", value: "sports" },
  ]}
/>
```

### ProSwitch

开关字段。组件固定使用 `checked` 作为表单值属性，并将表单项子元素位置设置在右侧。

| 属性         | 类型                       | 说明                     |
| ------------ | -------------------------- | ------------------------ |
| `name`       | `NamePath`                 | 表单字段名，值为布尔值。 |
| `fieldProps` | `SwitchProps`              | 传给内部 `Switch`。      |
| `itemProps`  | `Omit<FormItemProps, ...>` | 传给外层 `Form.Item`。   |

```tsx
<ProSwitch name="enabled" label="启用通知" fieldProps={{ defaultChecked: true }} />
```

### ProSelector

内嵌式标签选择器，使用 Ant Design Mobile `Selector`。

| 属性         | 类型                                                                     | 说明                   |
| ------------ | ------------------------------------------------------------------------ | ---------------------- |
| `name`       | `NamePath`                                                               | 表单字段名。           |
| `options`    | `SelectorProps<OptionValue>["options"]`                                  | 必填，选择项。         |
| `columns`    | `number`                                                                 | 每行列数。             |
| `multiple`   | `boolean`                                                                | 是否可多选。           |
| `fieldProps` | `Omit<SelectorProps<OptionValue>, "options" \| "columns" \| "multiple">` | 其余 `Selector` 属性。 |
| `itemProps`  | `Omit<FormItemProps, ...>`                                               | 传给外层 `Form.Item`。 |

```tsx
<ProSelector
  name="tags"
  label="标签"
  multiple
  columns={3}
  options={[
    { label: "新品", value: "new" },
    { label: "推荐", value: "featured" },
  ]}
/>
```

### ProCheckList

点击表单项后在底部弹层中展示 `CheckList`。支持清除，开启多选时还支持“全选”。值为 `OptionValue[]`。

| 属性          | 类型                                                        | 说明                                                                                 |
| ------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `name`        | `NamePath`                                                  | 表单字段名。                                                                         |
| `options`     | `ProCheckListOption[]`                                      | 必填。每项含 `label`、`value`，并支持 `disabled`、`title`、`description`、`prefix`。 |
| `multiple`    | `boolean`                                                   | 是否多选。                                                                           |
| `showCount`   | `boolean`                                                   | 是否以“已选择 N 个”代替所选标签。                                                    |
| `title`       | `ReactNode`                                                 | 弹层标题，默认“请选择{标签}”。                                                       |
| `placeholder` | `string`                                                    | 未选择时的占位文本，默认“请选择{标签}”。                                             |
| `fieldProps`  | `Omit<CheckListProps, "multiple" \| "onChange" \| "value">` | 传给内部 `CheckList`。                                                               |
| `itemProps`   | `Omit<FormItemProps, ...>`                                  | 传给外层 `Form.Item`。                                                               |

```tsx
<ProCheckList
  name="cities"
  label="服务城市"
  title="选择服务城市"
  multiple
  showCount
  options={[
    { label: "北京", value: "beijing" },
    { label: "上海", value: "shanghai" },
  ]}
/>
```

### ProPicker

多列滚轮选择器。确认后字段值为所选值数组；未选择时显示 `placeholder` 或“请选择{标签}”。

| 属性              | 类型                           | 默认值 | 说明                                                             |
| ----------------- | ------------------------------ | ------ | ---------------------------------------------------------------- |
| `name`            | `NamePath`                     | -      | 表单字段名。                                                     |
| `columns`         | `ProPickerOption[][]`          | -      | 必填。每列为 `{ label: ReactNode; value: string \| number }[]`。 |
| `placeholder`     | `string`                       | -      | 未选择时的提示。                                                 |
| `showSearch`      | `boolean`                      | -      | 在第一列启用关键词筛选。                                         |
| `allowSearchWord` | `boolean`                      | -      | 启用搜索时，允许将未匹配的关键词作为第一列值提交。               |
| `fieldProps`      | `Omit<PickerProps, "columns">` | -      | 其余 `Picker` 属性。                                             |
| `itemProps`       | `Omit<FormItemProps, ...>`     | -      | 传给外层 `Form.Item`。                                           |

```tsx
<ProPicker
  name="region"
  label="地区"
  columns={[
    [
      { label: "华北", value: "north" },
      { label: "华东", value: "east" },
    ],
    [
      { label: "北京", value: "beijing" },
      { label: "上海", value: "shanghai" },
    ],
  ]}
/>
```

### ProCascader

级联选择器。只有选到叶子节点时才会更新字段值，值为路径值数组。

| 属性          | 类型                             | 说明                               |
| ------------- | -------------------------------- | ---------------------------------- |
| `name`        | `NamePath`                       | 表单字段名。                       |
| `options`     | `CascaderOption[]`               | 必填，Ant Design Mobile 级联选项。 |
| `placeholder` | `string`                         | 未选择时的提示。                   |
| `fieldProps`  | `Omit<CascaderProps, "options">` | 其余 `Cascader` 属性。             |
| `itemProps`   | `Omit<FormItemProps, ...>`       | 传给外层 `Form.Item`。             |

```tsx
<ProCascader
  name="area"
  label="所在地区"
  options={[
    {
      label: "北京市",
      value: "beijing",
      children: [{ label: "朝阳区", value: "chaoyang" }],
    },
  ]}
/>
```

## 日期输入

### ProDatePicker

日期选择器，支持清除。默认最小日期为 `1900-01-01`、最大日期为 `2099-12-31`，显示格式为 `YYYY-MM-DD`。

| 属性           | 类型                       | 默认值         | 说明                                          |
| -------------- | -------------------------- | -------------- | --------------------------------------------- |
| `name`         | `NamePath`                 | -              | 表单字段名，值为 `Date`。                     |
| `placeholder`  | `string`                   | -              | 未选择时的提示。                              |
| `formatString` | `string`                   | `"YYYY-MM-DD"` | 使用 dayjs 格式化已选日期的格式。             |
| `fieldProps`   | `DatePickerProps`          | -              | 传给内部 `DatePicker`，可覆盖日期范围和标题。 |
| `itemProps`    | `Omit<FormItemProps, ...>` | -              | 传给外层 `Form.Item`。                        |

```tsx
<ProDatePicker name="effectiveDate" label="生效日期" required fieldProps={{ min: new Date(), precision: "day" }} />
```

### ProDateRange

由两个 `ProDatePicker` 组成的日期范围。结束日期早于开始日期时会校验失败；两个日期任一有值时，两个字段都会变为必填。

| 属性       | 类型                                     | 默认值  | 说明                                                            |
| ---------- | ---------------------------------------- | ------- | --------------------------------------------------------------- |
| `props`    | `Omit<ProDatePickerProps, "required">[]` | `[]`    | 按顺序配置开始、结束日期；默认字段名为 `startTime`、`endTime`。 |
| `label`    | `ReactNode`                              | -       | 外层表单项标签。                                                |
| `required` | `boolean`                                | -       | 是否要求填写整个日期范围。                                      |
| `disabled` | `boolean`                                | -       | 外层表单项禁用状态。                                            |
| `showLong` | `boolean`                                | `false` | 是否显示“长期”复选框。勾选后结束日期为 `9999-12-31`。           |

```tsx
<ProDateRange
  label="有效期"
  required
  showLong
  props={[
    { name: "validFrom", placeholder: "开始日期" },
    { name: "validTo", placeholder: "结束日期" },
  ]}
/>
```

## 弹层与内容展示

### ProPopup

基于 `Popup` 的带头部底部弹层。点击确认会依次执行 `onConfirm` 和 `onClose`；默认支持点击遮罩关闭。

| 属性          | 类型               | 默认值   | 说明                                                |
| ------------- | ------------------ | -------- | --------------------------------------------------- |
| `cancelText`  | `ReactNode`        | `"取消"` | 取消按钮文本。                                      |
| `title`       | `ReactNode`        | -        | 头部标题。                                          |
| `confirmText` | `ReactNode`        | `"确定"` | 确认按钮文本。                                      |
| `onConfirm`   | `() => void`       | -        | 确认回调。                                          |
| `height`      | `string \| number` | `300`    | 弹层内容区域高度。                                  |
| `hideHeader`  | `boolean`          | -        | 是否隐藏默认头部。                                  |
| 其余属性      | `PopupProps`       | -        | 例如 `visible`、`position`、`onClose`、`children`。 |

```tsx
<ProPopup visible={visible} title="筛选" height="60vh" onClose={() => setVisible(false)} onConfirm={() => submitFilter()}>
  <div>筛选内容</div>
</ProPopup>
```

### ProIFrame

在 `ProPopup` 中展示 iframe，弹层关闭时会将 iframe 高度设为 `0`。未提供 `url` 时渲染 `children`；`afterShow` 与 `afterClose` 会在内部状态更新后继续执行。

| 属性     | 类型            | 说明                                      |
| -------- | --------------- | ----------------------------------------- |
| `url`    | `string`        | iframe 地址。未提供时渲染 `children`。    |
| `footer` | `ReactNode`     | 内容区域下方的内容。                      |
| 其余属性 | `ProPopupProps` | 包括 `children`、生命周期回调及弹层属性。 |

```tsx
<ProIFrame visible={visible} url="https://example.com/terms" title="服务条款" height="80vh" onClose={() => setVisible(false)} />
```

### ProImage

图片展示组件。默认使用 `contain`、宽高均为 `56px`；点击有图片地址的图片会打开 `ImageViewer` 预览。`src="file"` 会显示内置的文件图标。

该组件完整接受 Ant Design Mobile 的 `ImageProps`。

```tsx
<ProImage src="https://example.com/avatar.png" width={80} height={80} />
<ProImage src="file" />
```

### ProUploader

表单图片/文件上传器。默认仅允许图片、单文件，文件上限为 10 MB。指定 `fieldProps.accept` 后，按该属性限制文件类型。

| 属性          | 类型                                                        | 默认值 | 说明                                                                             |
| ------------- | ----------------------------------------------------------- | ------ | -------------------------------------------------------------------------------- |
| `name`        | `NamePath`                                                  | -      | 可选的表单字段名，值为 `ImageUploadItem[]`。                                     |
| `apiUpload`   | `(file: File) => Promise<Partial<ImageUploadItem> \| null>` | -      | 可选上传函数。返回对象会与最终上传项合并。未返回 `url` 时使用本地对象 URL。      |
| `maxFileSize` | `number`                                                    | `10`   | 单文件大小上限，单位 MB。                                                        |
| `fieldProps`  | `Omit<ImageUploaderProps, "upload">`                        | -      | 传给内部 `ImageUploader`。可传 `accept`、`maxCount` 等；上传函数由组件统一管理。 |
| `itemProps`   | `Omit<FormItemProps, ...>`                                  | -      | 传给外层 `Form.Item`。                                                           |

```tsx
<ProUploader
  name="attachments"
  label="附件"
  maxFileSize={20}
  fieldProps={{ accept: ".pdf,.doc,.docx", maxCount: 3 }}
  apiUpload={async (file) => {
    const result = await uploadFile(file);
    return { url: result.url, thumbnailUrl: result.thumbnailUrl };
  }}
/>
```

## 列表数据加载

### ProScrollList

封装下拉刷新和触底加载，组件首次渲染及 `params` 改变时自动请求数据。数据非空时将 `list` 传给 `children` 渲染；请求完成但列表为空时显示 `empty` 或默认 `ProEmpty`。

| 属性        | 类型                             | 说明                                                    |
| ----------- | -------------------------------- | ------------------------------------------------------- |
| `api`       | `(options: any) => Promise<any>` | 必填。请求函数，接收当前分页参数。                      |
| `params`    | `any`                            | 必填。外部维护的查询和分页参数。                        |
| `setParams` | `(options: any) => void`         | 必填。更新 `params` 的方法。                            |
| `children`  | `(data: any[]) => ReactNode`     | 列表渲染函数。未提供时不渲染无限滚动控件。              |
| `empty`     | `ReactNode`                      | 空列表内容。                                            |
| `condition` | `() => boolean`                  | 返回 `false` 时跳过请求，可用于缺少必要查询条件的场景。 |
| `refresh`   | `number`                         | 值大于 0 且变更时触发一次刷新。                         |
| `names`     | `object`                         | 自定义响应和分页字段名，见下表。                        |
| `getRes`    | `(response: any) => void`        | 每次请求成功后的原始响应回调。                          |

`names` 的默认字段映射：

| 字段      | 默认值      | 说明                                                 |
| --------- | ----------- | ---------------------------------------------------- |
| `res`     | `""`        | 响应中实际数据对象所在字段；为空时直接使用响应对象。 |
| `data`    | `"data"`    | 列表数组字段。                                       |
| `current` | `"current"` | 当前页码参数字段。                                   |
| `size`    | `"size"`    | 每页条数参数字段。                                   |
| `total`   | `"total"`   | 总条数字段。                                         |
| `pages`   | `"pages"`   | 总页数字段。                                         |

```tsx
import { useState } from "react";
import { List } from "antd-mobile";
import { ProScrollList } from "@bigflower/pro-mobile";

export function OrderList() {
  const [params, setParams] = useState({ current: 1, size: 20 });

  return (
    <ProScrollList api={(query) => getOrders(query)} params={params} setParams={setParams}>
      {(orders) => (
        <List>
          {orders.map((order) => (
            <List.Item key={order.id}>{order.name}</List.Item>
          ))}
        </List>
      )}
    </ProScrollList>
  );
}
```

## 公共类型、常量与工具

入口还导出以下公共内容：

- 类型：`NamePath`、`OptionValue`、`GeneralFormItemKey`。
- 常量命名空间：`constants`，包含日期格式、日期范围、长期日期及密码特殊字符常量。
- 工具命名空间：`utils`，包含输入校验、密码校验、深度合并、数值格式化、脱敏、下载等工具。

```tsx
import { constants, utils } from "@bigflower/pro-mobile";

const isValidPhone = utils.isMobile("13800138000");
const formattedDate = constants.DATE_FORMAT;
```
