import type { FC, ReactNode } from "react";
import type { CheckListProps, FormItemProps } from "antd-mobile";
import type { GeneralFormItemKey, NamePath, OptionValue } from "../types";
import { forwardRef, useImperativeHandle, useState } from "react";
import { CheckList, Form, Space } from "antd-mobile";
import { ProPopup } from "../ProPopup";

type CheckListInputProps = Pick<ProCheckListProps, "options" | "title" | "multiple" | "showCount" | "placeholder" | "fieldProps"> & {
  value?: OptionValue[];
  onConfirm?: (value: OptionValue[]) => void;
};

const CheckListInput = forwardRef<{ open: () => void }, CheckListInputProps>((props, ref) => {
  const { value = [], onConfirm, options, title, multiple, showCount, placeholder, fieldProps } = props;
  const [visible, setVisible] = useState(false);
  const [tempValue, setTempValue] = useState<OptionValue[]>([]);
  const allValues = options.filter((o) => !o.disabled).map((o) => o.value);
  const selectedLabels = options.filter((o) => value.includes(o.value)).map((o) => o.label) as string[];

  const onClose = () => {
    setVisible(false);
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
    handleConfirm(allValues);
  };

  useImperativeHandle(ref, () => ({
    open: () => {
      setTempValue(value);
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
          <span>{selectedLabels.join("、")}</span>
        )
      ) : (
        <span style={{ color: "var(--adm-color-light)" }}>{placeholder}</span>
      )}
      <ProPopup
        visible={visible}
        onClose={onClose}
        onConfirm={() => handleConfirm(tempValue)}
        title={
          <Space block justify="between" align="center">
            <a onClick={handleClear} style={{ padding: "8px 0" }}>
              清除
            </a>
            <div>{title}</div>
            {multiple ? <a onClick={handleSelectAll}>全选</a> : <span>&emsp;&emsp;</span>}
          </Space>
        }
      >
        <CheckList multiple={multiple} value={tempValue} onChange={handleChange} style={{ "--border-top": "none" }} {...fieldProps}>
          {options.map(({ label: iLabel, value: iValue, ...rest }) => (
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
  itemProps?: Omit<FormItemProps, "name" | GeneralFormItemKey>;
  fieldProps?: Omit<CheckListProps, "multiple" | "onChange" | "value">;
};

export const ProCheckList: FC<ProCheckListProps> = (props) => {
  const { required, options, multiple, showCount, title, placeholder, itemProps, fieldProps, ...rest } = props;
  const messageLabel = (rest?.messageVariables?.label || rest?.label || "") as string;
  const message = `请选择${messageLabel}`;

  return (
    <Form.Item
      {...rest}
      validateFirst
      clickable={false}
      {...itemProps}
      trigger="onConfirm"
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
        fieldProps={fieldProps}
      />
    </Form.Item>
  );
};
