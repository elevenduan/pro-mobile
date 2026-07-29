import type { FC } from "react";
import type { CascaderOption, CascaderProps, CascaderRef, FormItemProps } from "antd-mobile";
import type { GeneralFormItemKey, NamePath } from "../types";
import { useContext, useRef } from "react";
import { Cascader, Form, Space } from "antd-mobile";
import { FieldContext } from "rc-field-form";

export type ProCascaderProps = Pick<FormItemProps, GeneralFormItemKey> & {
  name?: NamePath;
  placeholder?: string;
  options: CascaderOption[];
  itemProps?: Omit<FormItemProps, "name" | GeneralFormItemKey>;
  fieldProps?: Omit<CascaderProps, "options">;
};

export const ProCascader: FC<ProCascaderProps> = (props) => {
  const { required, placeholder, options, itemProps, fieldProps, ...rest } = props;
  const cascaderRef = useRef<CascaderRef>(null);
  const formIns = useContext(FieldContext);
  const fullName = [formIns?.prefixName || [], rest.name || []].flat();
  const watchValue = Form.useWatch(fullName);
  const messageLabel = rest?.messageVariables?.label || rest?.label || "";
  const message = `请选择${messageLabel}`;
  const onClear = () => {
    cascaderRef.current?.close();
    formIns?.setFieldValue(fullName, []);
    formIns?.validateFields([fullName]);
  };

  return (
    <Form.Item
      {...rest}
      validateFirst
      clickable={false}
      getValueFromEvent={(val, ext) => (ext?.isLeaf ? val : watchValue || [])}
      {...itemProps}
      trigger="onConfirm"
      onClick={(e, ref) => {
        ref.current?.open();
        cascaderRef.current = ref.current;
        itemProps?.onClick?.(e, ref);
      }}
      rules={[{ required, message }, ...(rest?.rules || [])]}
    >
      <Cascader
        children={(items) =>
          items
            ?.map((item) => item?.label)
            .filter(Boolean)
            .join(" / ") ||
          watchValue?.join(" / ") || <span style={{ color: "var(--adm-color-light)" }}>{placeholder || message}</span>
        }
        options={options}
        {...fieldProps}
        title={
          <Space block justify="between" align="center">
            <a onClick={onClear} style={{ padding: "8px 0" }}>
              清除
            </a>
            <span>{fieldProps?.title || message}</span>
            <span>&emsp;&emsp;</span>
          </Space>
        }
      />
    </Form.Item>
  );
};
