import type { FC, ReactNode } from "react";
import type { CheckListProps, FormItemProps } from "antd-mobile";
import type { GeneralFormItemKey, NamePath, OptionValue } from "../types";
import { forwardRef, useImperativeHandle, useState } from "react";
import { CheckList, Form, SearchBar } from "antd-mobile";
import { ProPopup } from "../ProPopup";

type CheckListInputProps = Pick<
  ProCheckListProps,
  "options" | "title" | "multiple" | "showCount" | "placeholder" | "fieldProps" | "showSearch" | "allowSearchWord"
> & {
  value?: OptionValue[];
  onConfirm?: (value: OptionValue[]) => void;
};

const CheckListInput = forwardRef<{ open: () => void }, CheckListInputProps>((props, ref) => {
  const { value = [], onConfirm, options, title, multiple, showCount, placeholder, fieldProps, showSearch, allowSearchWord } = props;
  const [visible, setVisible] = useState(false);
  const [tempValue, setTempValue] = useState<OptionValue[]>([]);
  const [keyword, setKeyword] = useState("");
  const filtered = options.filter((option) => JSON.stringify(option.label)?.includes(keyword));
  const allValues = filtered.filter((o) => !o.disabled).map((o) => o.value);
  const selectedLabels = value.map((v) => options.find((o) => o.value === v)?.label || v);

  const onClose = () => {
    setVisible(false);
    setKeyword("");
  };

  const handleChange = (newValues: OptionValue[]) => {
    setTempValue(newValues);
  };

  const handleConfirm = (values: OptionValue[]) => {
    onConfirm?.(values);
    onClose();
  };

  const handleClear = () => {
    handleConfirm([]);
  };

  const handleSelectAll = () => {
    setTempValue([...new Set([...tempValue, ...allValues])]);
  };

  const innerConfirm = () => {
    if (showSearch && allowSearchWord && !filtered.length && !tempValue.length && keyword) {
      handleConfirm([keyword]);
    } else {
      handleConfirm(tempValue);
    }
  };

  useImperativeHandle(ref, () => ({
    open: () => {
      setTempValue(value);
      setKeyword("");
      setVisible(true);
    },
    close: onClose,
  }));

  return (
    <>
      {selectedLabels.length > 0 ? (
        showCount ? (
          `已选择 ${selectedLabels.length} 个`
        ) : (
          selectedLabels.flatMap((item, index) => (index === 0 ? [item] : ["、", item]))
        )
      ) : (
        <span style={{ color: "var(--adm-color-light)" }}>{placeholder}</span>
      )}
      <ProPopup
        visible={visible}
        onClose={onClose}
        onConfirm={innerConfirm}
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            <a onClick={handleClear}>清除</a>
            {showSearch ? (
              <SearchBar value={keyword} onChange={setKeyword} placeholder="请输入关键字" style={{ flex: 1, marginLeft: 12, marginRight: multiple ? 12 : 0 }} />
            ) : (
              <div style={{ flex: 1, marginRight: multiple ? 0 : "2em" }}>{title}</div>
            )}
            {multiple ? <a onClick={handleSelectAll}>全选</a> : null}
          </div>
        }
      >
        <CheckList multiple={multiple} value={tempValue} onChange={handleChange} style={{ "--border-top": "none" }} {...fieldProps}>
          {(showSearch ? filtered : options).map(({ label: iLabel, value: iValue, ...rest }) => (
            <CheckList.Item key={iValue} value={iValue} {...rest}>
              {iLabel}
            </CheckList.Item>
          ))}
        </CheckList>
      </ProPopup>
    </>
  );
});

export type ProCheckListOption = {
  label: ReactNode;
  value: OptionValue;
  disabled?: boolean;
  title?: ReactNode;
  description?: ReactNode;
  prefix?: ReactNode;
};

export type ProCheckListProps = Pick<FormItemProps, GeneralFormItemKey> & {
  name?: NamePath;
  options: ProCheckListOption[];
  multiple?: boolean;
  showCount?: boolean;
  title?: ReactNode;
  placeholder?: string;
  showSearch?: boolean;
  allowSearchWord?: boolean;
  itemProps?: Omit<FormItemProps, "name" | GeneralFormItemKey>;
  fieldProps?: Omit<CheckListProps, "multiple" | "onChange" | "value">;
};

export const ProCheckList: FC<ProCheckListProps> = (props) => {
  const { required, options, multiple, showCount, title, placeholder, showSearch, allowSearchWord, itemProps, fieldProps, ...rest } = props;
  const messageLabel = (rest?.messageVariables?.label || rest?.label || "") as string;
  const message = `请选择${messageLabel}`;

  return (
    <Form.Item
      validateFirst
      clickable={false}
      trigger="onConfirm"
      {...rest}
      {...itemProps}
      onClick={(e, ref) => {
        ref.current?.open();
        itemProps?.onClick?.(e, ref);
      }}
      rules={[{ required, message }, ...(rest.rules || [])]}
    >
      <CheckListInput
        options={options}
        showCount={showCount}
        title={title || message}
        multiple={multiple}
        placeholder={placeholder || message}
        showSearch={showSearch}
        allowSearchWord={allowSearchWord}
        fieldProps={fieldProps}
      />
    </Form.Item>
  );
};
