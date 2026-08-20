import type { FC, ReactNode } from "react";
import type { PopupProps } from "antd-mobile";
import { Popup } from "antd-mobile";
import "./index.css";

export type ProPopupProps = PopupProps & {
  cancelText?: ReactNode;
  title?: ReactNode;
  confirmText?: ReactNode;
  onConfirm?: () => void;
  height?: string | number;
  hideHeader?: boolean;
};

export const ProPopup: FC<ProPopupProps> = (props) => {
  const { cancelText = "取消", title, confirmText = "确定", onConfirm, height = 300, hideHeader, onClose, children, ...rest } = props;

  const handleConfirm = () => {
    onConfirm?.();
    onClose?.();
  };

  return (
    <Popup className="pro-popup" closeOnMaskClick onClose={onClose} {...rest}>
      <div className="pro-popup-content" style={{ height }}>
        {!hideHeader && (
          <div className="pro-popup-header">
            {cancelText ? (
              <a className="pro-popup-header-button" onClick={onClose}>
                {cancelText}
              </a>
            ) : null}
            <div className="pro-popup-header-title">{title}</div>
            {confirmText ? (
              <a className="pro-popup-header-button" onClick={handleConfirm}>
                {confirmText}
              </a>
            ) : null}
          </div>
        )}
        <div className="pro-popup-body">{children}</div>
      </div>
    </Popup>
  );
};
