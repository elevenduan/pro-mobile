import type { FC, ReactNode } from "react";
import type { ProPopupProps } from "../ProPopup";
import { useState } from "react";
import { ProPopup } from "../ProPopup";

export type ProIFrameProps = Omit<ProPopupProps, "children" | "afterShow" | "afterClose"> & {
  url?: string;
  footer?: ReactNode;
};

export const ProIFrame: FC<ProIFrameProps> = (props) => {
  const { url, footer, ...rest } = props;
  const [autoHeight, setAutoHeight] = useState(false);

  return (
    <ProPopup
      afterShow={() => setAutoHeight(true)}
      afterClose={() => setAutoHeight(false)}
      cancelText={<span style={{ visibility: "hidden" }}>取消</span>}
      confirmText="关闭"
      {...rest}
    >
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{ flexGrow: 1 }}>
          <iframe src={url} style={{ height: autoHeight ? "100%" : "0", width: "100%", border: "none", overflow: "auto", display: "block" }} />
        </div>
        <div>{footer}</div>
      </div>
    </ProPopup>
  );
};
