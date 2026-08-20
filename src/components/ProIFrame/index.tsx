import type { FC, ReactNode } from "react";
import type { ProPopupProps } from "../ProPopup";
import { useState } from "react";
import { ProPopup } from "../ProPopup";

export type ProIFrameProps = ProPopupProps & {
  url?: string;
  footer?: ReactNode;
};

export const ProIFrame: FC<ProIFrameProps> = (props) => {
  const { url, footer, children, afterShow, afterClose, ...rest } = props;
  const [autoHeight, setAutoHeight] = useState(false);

  function afterShowInner() {
    setAutoHeight(true);
    afterShow?.();
  }

  function afterCloseInner() {
    setAutoHeight(false);
    afterClose?.();
  }

  return (
    <ProPopup afterShow={afterShowInner} afterClose={afterCloseInner} cancelText="&emsp;&emsp;&nbsp;" confirmText="关闭" {...rest}>
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{ flexGrow: 1, overflow: "auto" }}>
          {url ? (
            <iframe src={url} style={{ height: autoHeight ? "100%" : "0", width: "100%", border: "none", overflow: "auto", display: "block" }} />
          ) : (
            children
          )}
        </div>
        <div>{footer}</div>
      </div>
    </ProPopup>
  );
};
