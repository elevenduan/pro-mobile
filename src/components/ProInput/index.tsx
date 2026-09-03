import type { FC } from "react";
import type { FormItemProps, InputProps } from "antd-mobile";
import type { GeneralFormItemKey, NamePath } from "../types";
import { Form, Input } from "antd-mobile";
import * as utils from "@bigflower/utils";

export type ProInputProps = Pick<FormItemProps, GeneralFormItemKey> & {
  name?: NamePath;
  verify?: "isUrl" | "isEmail" | "isIp" | "isIpv4" | "isIpv6" | "isBankNo" | "isIdNo" | "isMobile" | "isUsci" | "isSms";
  itemProps?: Omit<FormItemProps, "name" | GeneralFormItemKey>;
  fieldProps?: InputProps;
};

export const ProInput: FC<ProInputProps> = (props) => {
  const { required, verify, itemProps, fieldProps, ...rest } = props;
  const messageLabel = (rest?.messageVariables?.label || rest?.label || "") as string;
  const validator = verify ? utils[verify] : undefined;

  return (
    <Form.Item
      {...rest}
      {...itemProps}
      rules={[
        { required },
        {
          validator: (_, value) => (!value || !validator || validator(value) ? Promise.resolve() : Promise.reject(`请输入正确的${messageLabel}`)),
        },
        ...(rest?.rules || []),
      ]}
    >
      <Input type="text" clearable placeholder={`请输入${messageLabel}`} {...fieldProps} />
    </Form.Item>
  );
};
