import type { FC, ReactNode } from "react";
import type { FormItemProps, PickerProps, PickerRef } from "antd-mobile";
import type { GeneralFormItemKey, NamePath, OptionValue } from "../types";
import { useContext, useRef, useState } from "react";
import { Form, Picker, SearchBar, Space } from "antd-mobile";
import { FieldContext } from "rc-field-form";

export type ProPickerOption = {
  label: ReactNode;
  value: OptionValue;
};

export type ProPickerProps = Pick<FormItemProps, GeneralFormItemKey> & {
  name?: NamePath;
  placeholder?: string;
  columns: ProPickerOption[][];
  showSearch?: boolean;
  allowSearchWord?: boolean;
  itemProps?: Omit<FormItemProps, "name" | GeneralFormItemKey>;
  fieldProps?: Omit<PickerProps, "columns">;
};

export const ProPicker: FC<ProPickerProps> = (props) => {
  const { required, placeholder, columns = [], showSearch, allowSearchWord, itemProps, fieldProps, ...rest } = props;
  const [keyword, setKeyword] = useState("");
  const pickerRef = useRef<PickerRef>(null);
  const formIns = useContext(FieldContext);
  const fullName = [formIns?.prefixName || [], rest.name || []].flat();
  const watchValue = Form.useWatch(fullName);
  const messageLabel = rest?.messageVariables?.label || rest?.label || "";
  const message = `请选择${messageLabel}`;
  const filtered = columns.map((col, index) => (index === 0 ? col.filter((option) => String(option.label).includes(keyword)) : col));
  const onClear = () => {
    pickerRef.current?.close();
    formIns?.setFieldValue(fullName, []);
    formIns?.validateFields([fullName]);
    setKeyword("");
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
      getValueFromEvent={(val) => (val || []).map((v: any) => (!v && allowSearchWord ? keyword : v)).filter(Boolean)}
    >
      <Picker
        children={(items) =>
          items
            ?.map((item) => item?.label)
            .filter(Boolean)
            .join(" / ") ||
          watchValue?.join(" / ") || <span style={{ color: "var(--adm-color-light)" }}>{placeholder || message}</span>
        }
        columns={showSearch ? filtered : columns}
        {...fieldProps}
        title={
          showSearch ? (
            <div style={{ display: "flex", alignItems: "center" }}>
              <a onClick={onClear} style={{ padding: "8px 0" }}>
                清除
              </a>
              <SearchBar value={keyword} onChange={setKeyword} placeholder="请输入关键字" style={{ flexGrow: 1, marginLeft: 12 }} />
            </div>
          ) : (
            <Space block justify="between" align="center">
              <a onClick={onClear} style={{ padding: "8px 0" }}>
                清除
              </a>
              <span>{fieldProps?.title || message}</span>
              <span>&emsp;&emsp;</span>
            </Space>
          )
        }
      />
    </Form.Item>
  );
};
