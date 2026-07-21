import type { FC } from "react";
import type { DatePickerProps, FormItemProps } from "antd-mobile";
import type { GeneralFormItemKey, NamePath } from "../types";
import { DatePicker, Form } from "antd-mobile";
import dayjs from "dayjs";
import { MIN_DATE, MAX_DATE, DATE_FORMAT } from "../constants";

export type ProDatePickerProps = Pick<FormItemProps, GeneralFormItemKey> & {
  name?: NamePath;
  formatString?: string;
  itemProps?: FormItemProps;
  fieldProps?: DatePickerProps;
};

export const ProDatePicker: FC<ProDatePickerProps> = (props) => {
  const { required, formatString = DATE_FORMAT, itemProps, fieldProps, ...rest } = props;
  const messageLabel = rest?.messageVariables?.label || rest?.label || "";
  const message = `请选择${messageLabel}`;

  return (
    <Form.Item
      {...rest}
      {...itemProps}
      validateFirst
      trigger="onConfirm"
      onClick={(_, ref) => ref.current?.open()}
      rules={[{ required, message }, ...(itemProps?.rules || [])]}
    >
      <DatePicker
        title={message}
        min={MIN_DATE}
        max={MAX_DATE}
        children={(value) => (value ? dayjs(value).format(formatString) : <span style={{ color: "var(--adm-color-light)" }}>{message}</span>)}
        {...fieldProps}
      />
    </Form.Item>
  );
};
