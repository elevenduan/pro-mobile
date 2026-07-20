import type { FC } from "react";
import type { FormItemProps, InputProps } from "antd-mobile";
import type { NamePath } from "../types";
import { Form, Input } from "antd-mobile";
import * as utils from "../utils";

export type ProInputProps = Pick<FormItemProps, "label" | "extra" | "required" | "disabled" | "messageVariables"> & {
  name?: NamePath;
  verify?: "url" | "email" | "ip" | "ipv4" | "ipv6" | "bankNo" | "idNo" | "mobile" | "usci";
  itemProps?: FormItemProps;
  fieldProps?: InputProps;
};

export const ProInput: FC<ProInputProps> = (props) => {
  const { required, verify, itemProps, fieldProps, ...rest } = props;
  const messageLabel = rest?.messageVariables?.label || rest?.label || "";
  const validator = verify ? utils[`is${verify[0].toUpperCase() + verify.slice(1)}` as keyof typeof utils] : undefined;

  return (
    <Form.Item
      {...rest}
      {...itemProps}
      rules={[
        { required },
        {
          validator: (_, value) => (!value || !validator || validator(value) ? Promise.resolve() : Promise.reject(`请输入正确的${messageLabel}`)),
        },
        ...(itemProps?.rules || []),
      ]}
    >
      <Input type="text" clearable placeholder={`请输入${messageLabel}`} {...fieldProps} />
    </Form.Item>
  );
};
