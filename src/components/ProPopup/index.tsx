import type { FC, ReactNode } from "react";
import type { PopupProps } from "antd-mobile";
import { Popup } from "antd-mobile";

export type ProPopupProps = PopupProps & {
  cancelText?: ReactNode;
  title?: ReactNode;
  confirmText?: ReactNode;
  onConfirm?: () => void;
  maxHeight?: string | number;
  showHeader?: boolean;
};

export const ProPopup: FC<ProPopupProps> = (props) => {
  const { cancelText = "取消", title, confirmText = "确定", onConfirm, maxHeight = "65vh", onClose, children, showHeader = true, ...rest } = props;

  const handleConfirm = () => {
    onConfirm?.();
    onClose?.();
  };

  return (
    <Popup closeOnMaskClick className="adm-picker-popup" {...rest} onClose={onClose}>
      <div className="adm-picker" style={{ maxHeight, minHeight: "300px", height: "auto" }}>
        {showHeader && (
          <div className="adm-picker-header" style={{ marginBottom: "-1px", position: "relative", zIndex: 2 }}>
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
