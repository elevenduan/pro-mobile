import type { FC } from "react";
import type { FormItemProps, SelectorProps } from "antd-mobile";
import type { GeneralFormItemKey, NamePath, OptionValue } from "../types";
import { Form, Selector } from "antd-mobile";

export type ProSelectorProps = Pick<FormItemProps, GeneralFormItemKey> & {
  name?: NamePath;
  itemProps?: Omit<FormItemProps, "name" | GeneralFormItemKey>;
  fieldProps?: Omit<SelectorProps<OptionValue>, "options" | "columns" | "multiple">;
} & Pick<SelectorProps<OptionValue>, "options" | "columns" | "multiple">;

export const ProSelector: FC<ProSelectorProps> = (props) => {
  const { required, itemProps, fieldProps, options, columns, multiple, ...rest } = props;
  const messageLabel = rest?.messageVariables?.label || rest?.label || "";

  return (
    <Form.Item {...rest} {...itemProps} rules={[{ required, message: `请选择${messageLabel}` }, ...(rest?.rules || [])]}>
      <Selector options={options} columns={columns} multiple={multiple} {...fieldProps} />
    </Form.Item>
  );
};
