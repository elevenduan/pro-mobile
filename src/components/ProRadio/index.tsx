import type { FC, ReactNode } from "react";
import type { FormItemProps, RadioProps, SpaceProps } from "antd-mobile";
import type { NamePath } from "../types";
import { Form, Radio, Space } from "antd-mobile";

export type RadioOption = {
  label: ReactNode;
  value: string | number;
};

export type ProRadioProps = Pick<FormItemProps, "label" | "extra" | "required" | "disabled" | "messageVariables"> & {
  name?: NamePath;
  options?: RadioOption[];
  itemProps?: FormItemProps;
  fieldProps?: RadioProps;
  spaceProps?: SpaceProps;
};

export const ProRadio: FC<ProRadioProps> = (props) => {
  const { required, options = [], spaceProps, itemProps, fieldProps, ...rest } = props;
  const messageLabel = rest?.messageVariables?.label || rest?.label || "";

  return (
    <Form.Item {...rest} {...itemProps} rules={[{ required, message: `请选择${messageLabel}` }, ...(itemProps?.rules || [])]}>
      <Radio.Group>
        <Space block wrap {...spaceProps}>
          {options.map((item) => (
            <Radio key={item.value} value={item.value} block {...fieldProps}>
              {item.label}
            </Radio>
          ))}
        </Space>
      </Radio.Group>
    </Form.Item>
  );
};
