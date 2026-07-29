import type { FC, ReactNode } from "react";
import type { PopupProps } from "antd-mobile";
import { Popup } from "antd-mobile";

export type ProPopupProps = PopupProps & {
  cancelText?: ReactNode;
  title?: ReactNode;
  confirmText?: ReactNode;
  onConfirm?: () => void;
  height?: string | number;
  hideHeader?: boolean;
};

export const ProPopup: FC<ProPopupProps> = (props) => {
  const { cancelText = "取消", title, confirmText = "确定", onConfirm, height, hideHeader, onClose, children, ...rest } = props;

  const handleConfirm = () => {
    onConfirm?.();
    onClose?.();
  };

  return (
    <Popup closeOnMaskClick className="adm-picker-popup" {...rest} onClose={onClose}>
      <div className="adm-picker" style={{ height }}>
        {!hideHeader && (
          <div className="adm-picker-header">
            <a className="adm-picker-header-button" onClick={onClose}>
              {cancelText}
            </a>
            <div className="adm-picker-header-title">{title}</div>
            <a className="adm-picker-header-button" onClick={handleConfirm}>
              {confirmText}
            </a>
          </div>
        )}
        <div className="adm-picker-body" style={{ overflow: "auto" }}>
          {children}
        </div>
      </div>
    </Popup>
  );
};
