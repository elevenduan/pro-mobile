import type { FC, ReactNode } from "react";
import type { CheckListProps, FormItemProps } from "antd-mobile";
import type { GeneralFormItemKey, NamePath, OptionValue } from "../types";
import { forwardRef, useImperativeHandle, useState } from "react";
import { CheckList, Form, Popup, Space } from "antd-mobile";

type CheckListInputProps = Pick<ProCheckListProps, "options" | "title" | "multiple" | "showCount" | "placeholder"> & {
  value?: OptionValue[];
  onConfirm?: (value: OptionValue[]) => void;
};

const CheckListInput = forwardRef<{ open: () => void }, CheckListInputProps>((props, ref) => {
  const { value = [], onConfirm, options, title, multiple, showCount, placeholder } = props;
  const [visible, setVisible] = useState(false);
  const [tempValue, setTempValue] = useState<OptionValue[]>([]);
  const allValues = options.filter((o) => !o.disabled).map((o) => o.value);
  const selectedLabels = options.filter((o) => value.includes(o.value)).map((o) => o.label);

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
      <Popup visible={visible} onClose={onClose} closeOnMaskClick className="adm-picker-popup adm-popup-checklist">
        <div className="adm-picker" style={{ maxHeight: "65vh", minHeight: "300px", height: "auto" }}>
          <div className="adm-picker-header" style={{ marginBottom: "-1px", position: "relative", zIndex: 2 }}>
            <a className="adm-picker-header-button" onClick={onClose}>
              取消
            </a>
            <div className="adm-picker-header-title">
              <Space block justify="between" align="center">
                <a onClick={handleClear} style={{ padding: "8px 0" }}>
                  清除
                </a>
                <div>{title}</div>
                {multiple ? <a onClick={handleSelectAll}>全选</a> : <span>&emsp;&emsp;</span>}
              </Space>
            </div>
            <a className="adm-picker-header-button" onClick={() => handleConfirm(tempValue)}>
              确定
            </a>
          </div>
          <div className="adm-picker-body" style={{ overflow: "auto" }}>
            <CheckList multiple={multiple} value={tempValue} onChange={handleChange}>
              {options.map(({ label: iLabel, value: iValue, ...rest }) => (
                <CheckList.Item key={iValue} value={iValue} {...rest}>
                  {iLabel}
                </CheckList.Item>
              ))}
            </CheckList>
          </div>
        </div>
      </Popup>
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
  const messageLabel = rest.messageVariables?.label || rest.label || "";
  const message = `请选择${messageLabel}`;

  return (
    <Form.Item
      {...rest}
      {...itemProps}
      validateFirst
      clickable={false}
      trigger="onConfirm"
      onClick={(_, ref) => ref.current?.open()}
      rules={[{ required, message }, ...(rest.rules || [])]}
    >
      <CheckListInput
        options={options}
        showCount={showCount}
        title={title || message}
        multiple={multiple}
        placeholder={placeholder || message}
        {...fieldProps}
      />
    </Form.Item>
  );
};
