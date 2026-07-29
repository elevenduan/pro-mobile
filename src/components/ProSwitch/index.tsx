import type { FC } from "react";
import type { FormItemProps, SwitchProps } from "antd-mobile";
import type { GeneralFormItemKey, NamePath } from "../types";
import { Form, Switch } from "antd-mobile";

export type ProSwitchProps = Pick<FormItemProps, GeneralFormItemKey> & {
  name?: NamePath;
  itemProps?: Omit<FormItemProps, "name" | GeneralFormItemKey>;
  fieldProps?: SwitchProps;
};

export const ProSwitch: FC<ProSwitchProps> = (props) => {
  const { itemProps, fieldProps, ...rest } = props;

  return (
    <Form.Item {...rest} childElementPosition="right" {...itemProps} valuePropName="checked">
      <Switch {...fieldProps} />
    </Form.Item>
  );
};
