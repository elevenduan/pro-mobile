import type { FC, ReactNode } from "react";
import type { FormItemProps, RadioProps, SpaceProps } from "antd-mobile";
import type { GeneralFormItemKey, NamePath, OptionValue } from "../types";
import { Form, Radio, Space } from "antd-mobile";

export type RadioOption = {
  label: ReactNode;
  value: OptionValue;
  disabled?: boolean;
};

export type ProRadioProps = Pick<FormItemProps, GeneralFormItemKey> & {
  name?: NamePath;
  options: RadioOption[];
  itemProps?: Omit<FormItemProps, "name" | GeneralFormItemKey>;
  fieldProps?: RadioProps;
  spaceProps?: SpaceProps;
};

export const ProRadio: FC<ProRadioProps> = (props) => {
  const { required, options, itemProps, fieldProps, spaceProps, ...rest } = props;
  const messageLabel = rest?.messageVariables?.label || rest?.label || "";

  return (
    <Form.Item {...rest} {...itemProps} rules={[{ required, message: `请选择${messageLabel}` }, ...(rest?.rules || [])]}>
      <Radio.Group>
        <Space block wrap {...spaceProps}>
          {options?.map((item) => (
            <Radio key={item.value} value={item.value} disabled={item.disabled} block {...fieldProps}>
              {item.label}
            </Radio>
          ))}
        </Space>
      </Radio.Group>
    </Form.Item>
  );
};
