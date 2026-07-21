import type { FC } from "react";
import type { FormItemProps, TextAreaProps } from "antd-mobile";
import type { GeneralFormItemKey, NamePath } from "../types";
import { Form, TextArea } from "antd-mobile";

export type ProTextAreaProps = Pick<FormItemProps, GeneralFormItemKey> & {
  name?: NamePath;
  itemProps?: FormItemProps;
  fieldProps?: TextAreaProps;
};

export const ProTextArea: FC<ProTextAreaProps> = (props) => {
  const { required, itemProps, fieldProps, ...rest } = props;
  const messageLabel = rest?.messageVariables?.label || rest?.label || "";

  return (
    <Form.Item {...rest} {...itemProps} rules={[{ required }, ...(itemProps?.rules || [])]}>
      <TextArea placeholder={`请输入${messageLabel}`} rows={1} autoSize={{ minRows: 1, maxRows: 3 }} {...fieldProps} />
    </Form.Item>
  );
};
