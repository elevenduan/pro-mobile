import type { FC } from "react";
import type { FormItemProps, InputProps } from "antd-mobile";
import type { NamePath } from "../types";
import { Form, Input } from "antd-mobile";

export type ProNumberProps = Pick<FormItemProps, "label" | "extra" | "required" | "disabled" | "messageVariables"> & {
  name?: NamePath;
  min?: number | null; // 允许为 null，表示没有最小值
  max?: number;
  precision?: number;
  itemProps?: FormItemProps;
  fieldProps?: InputProps;
};

export const ProNumber: FC<ProNumberProps> = (props) => {
  const { required, min = 0, max, precision = 2, itemProps, fieldProps, ...rest } = props;
  const messageLabel = rest?.messageVariables?.label || rest?.label || "";

  return (
    <Form.Item
      {...rest}
      {...itemProps}
      rules={[
        { required },
        {
          validator: (_, value) => {
            if (value === undefined || value === "") return Promise.resolve();
            const num = Number(value);
            if (isNaN(num)) return Promise.reject(new Error("请输入有效的数字"));
            if (min !== undefined && min !== null && num < min) return Promise.reject(new Error(`不能小于${min}`));
            if (max !== undefined && num > max) return Promise.reject(new Error(`不能大于${max}`));
            return Promise.resolve();
          },
        },
        ...(itemProps?.rules || []),
      ]}
      getValueFromEvent={(val: string) => {
        let formatted = val.replace(/[^\d.-]/g, "");
        if (precision > 0) {
          const parts = formatted.split(".");
          if (parts.length > 2) {
            formatted = `${parts[0]}.${parts[1]}`;
          }
          if (parts[1]?.length > precision) {
            formatted = `${parts[0]}.${parts[1].slice(0, precision)}`;
          }
        } else {
          formatted = formatted.replace(/\./g, "");
        }
        return formatted;
      }}
    >
      <Input type="text" clearable placeholder={`请输入${messageLabel}`} {...fieldProps} />
    </Form.Item>
  );
};
