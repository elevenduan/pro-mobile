import type { FC } from "react";
import type { DatePickerProps, FormItemProps, PickerRef } from "antd-mobile";
import type { GeneralFormItemKey, NamePath } from "../types";
import { useRef, useContext } from "react";
import { DatePicker, Form, Space } from "antd-mobile";
import { FieldContext } from "rc-field-form";
import dayjs from "dayjs";
import { MIN_DATE, MAX_DATE, DATE_FORMAT } from "../constants";

export type ProDatePickerProps = Pick<FormItemProps, GeneralFormItemKey> & {
  name?: NamePath;
  placeholder?: string;
  formatString?: string;
  itemProps?: Omit<FormItemProps, "name" | GeneralFormItemKey>;
  fieldProps?: DatePickerProps;
};

export const ProDatePicker: FC<ProDatePickerProps> = (props) => {
  const { required, placeholder, formatString = DATE_FORMAT, itemProps, fieldProps, ...rest } = props;
  const messageLabel = rest?.messageVariables?.label || rest?.label || "";
  const message = `请选择${messageLabel}`;
  const pickerRef = useRef<PickerRef>(null);
  const formIns = useContext(FieldContext);
  const fullName = [formIns?.prefixName || [], rest.name || []].flat();
  const onClear = () => {
    pickerRef.current?.close();
    formIns?.setFieldValue(fullName, null);
    formIns?.validateFields([fullName]);
  };

  return (
    <Form.Item
      {...rest}
      {...itemProps}
      validateFirst
      clickable={false}
      trigger="onConfirm"
      onClick={(_, ref) => {
        ref.current?.open();
        pickerRef.current = ref.current;
      }}
      rules={[{ required, message }, ...(rest?.rules || [])]}
    >
      <DatePicker
        min={MIN_DATE}
        max={MAX_DATE}
        children={(value) => (value ? dayjs(value).format(formatString) : <span style={{ color: "var(--adm-color-light)" }}>{placeholder || message}</span>)}
        {...fieldProps}
        title={
          <Space block justify="between">
            <a onClick={onClear}>清除</a>
            <span>{fieldProps?.title || message}</span>
            <span>&emsp;&emsp;</span>
          </Space>
        }
      />
    </Form.Item>
  );
};
