import type { FC } from "react";
import type { FormItemProps, InputProps } from "antd-mobile";
import type { GeneralFormItemKey, NamePath } from "../types";
import { useState } from "react";
import { Form, Input } from "antd-mobile";
import { EyeInvisibleOutline, EyeOutline } from "antd-mobile-icons";

export type ProPasswordProps = Pick<FormItemProps, GeneralFormItemKey> & {
  name?: NamePath;
  itemProps?: Omit<FormItemProps, "name" | GeneralFormItemKey>;
  fieldProps?: InputProps;
};

export const ProPassword: FC<ProPasswordProps> = (props) => {
  const { required, itemProps, fieldProps, ...rest } = props;
  const messageLabel = rest?.messageVariables?.label || rest?.label || "";
  const [visibleEye, setVisibleEye] = useState(false);

  return (
    <Form.Item
      extra={<div onClick={() => setVisibleEye(!visibleEye)}>{visibleEye ? <EyeOutline /> : <EyeInvisibleOutline />}</div>}
      {...rest}
      {...itemProps}
      rules={[{ required }, ...(rest?.rules || [])]}
    >
      <Input type={visibleEye ? "text" : "password"} clearable placeholder={`请输入${messageLabel}`} {...fieldProps} />
    </Form.Item>
  );
};
