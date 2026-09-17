import type { FC, ReactNode } from "react";
import type { FormItemProps, PickerProps, PickerRef } from "antd-mobile";
import type { GeneralFormItemKey, NamePath, OptionValue } from "../types";
import { useContext, useRef, useState } from "react";
import { Form, Picker, SearchBar } from "antd-mobile";
import { FieldContext } from "rc-field-form";
import { isNil } from "@bigflower/utils";

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
  const { required, placeholder, columns, showSearch, allowSearchWord, itemProps, fieldProps, ...rest } = props;
  const [keyword, setKeyword] = useState("");
  const pickerRef = useRef<PickerRef>(null);
  const formIns = useContext(FieldContext);
  const fullName = [formIns?.prefixName || [], rest.name || []].flat();
  const watchValue = Form.useWatch(fullName);
  const messageLabel = (rest?.messageVariables?.label || rest?.label || "") as string;
  const message = `请选择${messageLabel}`;
  const filtered = columns?.map((col) => col.filter((option) => JSON.stringify(option.label)?.includes(keyword)));
  const onClear = async () => {
    pickerRef.current?.close();
    formIns?.setFieldValue(fullName, []);
    await formIns?.validateFields([fullName])?.catch(() => {});
    setKeyword("");
  };
  const separator = " / ";
  const childrenRender: PickerProps["children"] = () => {
    if (!watchValue?.length) {
      return <span style={{ color: "var(--adm-color-light)" }}>{placeholder || message}</span>;
    }

    const valuesLabel = columns
      ?.map((col, index) => col?.find((option) => option.value === watchValue?.[index])?.label || watchValue?.[index])
      ?.flatMap((item, index) => (index === 0 ? [item] : [separator, item]));

    return valuesLabel;
  };

  return (
    <Form.Item
      validateFirst
      clickable={false}
      getValueFromEvent={(val) => (val || []).map((v: any) => (isNil(v) && allowSearchWord && keyword ? keyword : v)).filter((v: any) => !isNil(v))}
      trigger="onConfirm"
      {...rest}
      {...itemProps}
      onClick={(e, ref) => {
        ref.current?.open();
        pickerRef.current = ref.current;
        itemProps?.onClick?.(e, ref);
      }}
      rules={[{ required, message }, ...(rest?.rules || [])]}
    >
      <Picker
        children={childrenRender}
        columns={showSearch ? filtered : columns}
        {...fieldProps}
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            <a onClick={onClear} style={{ padding: "8px 0" }}>
              清除
            </a>
            {showSearch ? (
              <SearchBar value={keyword} onChange={setKeyword} placeholder="请输入关键字" style={{ flexGrow: 1, marginLeft: 12 }} />
            ) : (
              <div style={{ flexGrow: 1, paddingRight: "2em" }}>{fieldProps?.title || message}</div>
            )}
          </div>
        }
      />
    </Form.Item>
  );
};
