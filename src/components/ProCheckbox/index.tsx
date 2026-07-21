import type { FC, ReactNode } from "react";
import type { FormItemProps, CheckboxProps, SpaceProps } from "antd-mobile";
import type { NamePath, OptionValue } from "../types";
import { Checkbox, Form, Space } from "antd-mobile";

export type CheckboxOption = {
  label: ReactNode;
  value: OptionValue;
  disabled?: boolean;
};

export type ProCheckboxProps = Pick<FormItemProps, "label" | "extra" | "required" | "disabled" | "messageVariables"> & {
  name?: NamePath;
  options: CheckboxOption[];
  itemProps?: FormItemProps;
  fieldProps?: CheckboxProps;
  spaceProps?: SpaceProps;
};

export const ProCheckbox: FC<ProCheckboxProps> = (props) => {
  const { required, options, itemProps, fieldProps, spaceProps, ...rest } = props;
  const messageLabel = rest?.messageVariables?.label || rest?.label || "";

  return (
    <Form.Item {...rest} {...itemProps} rules={[{ required, message: `请选择${messageLabel}` }, ...(itemProps?.rules || [])]}>
      <Checkbox.Group>
        <Space block wrap {...spaceProps}>
          {options?.map((item) => (
            <Checkbox key={item.value} value={item.value} disabled={item.disabled} block {...fieldProps}>
              {item.label}
            </Checkbox>
          ))}
        </Space>
      </Checkbox.Group>
    </Form.Item>
  );
};
