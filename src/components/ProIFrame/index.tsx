import type { FC, ReactNode } from "react";
import type { ProPopupProps } from "../ProPopup";
import { useEffect, useRef, useState } from "react";
import { ProPopup } from "../ProPopup";

export type ProIFrameProps = ProPopupProps & {
  url?: string;
  file?: File; // 监听 file-viewer:ready 后，通过 postMessage 传递给 iframe
  footer?: ReactNode;
  resize?: boolean; // 用于兼容 ios iframe 高度计算问题，导致的不能滚动。
};

export const ProIFrame: FC<ProIFrameProps> = (props) => {
  const { url, file, footer, resize, children, afterShow, afterClose, ...rest } = props;
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [autoHeight, setAutoHeight] = useState(false);

  function afterShowInner() {
    if (resize) {
      setAutoHeight(true);
    }
    afterShow?.();
  }

  function afterCloseInner() {
    if (resize) {
      setAutoHeight(false);
    }
    afterClose?.();
  }

  useEffect(() => {
    if (!file) return;

    function onMessage(event: MessageEvent) {
      if (event.source !== iframeRef.current?.contentWindow) return;
      if (event.data?.type !== "file-viewer:ready") return;
      iframeRef.current?.contentWindow?.postMessage({ file }, event.origin);
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [file]);

  return (
    <ProPopup cancelText="" confirmText="关闭" destroyOnClose afterShow={afterShowInner} afterClose={afterCloseInner} {...rest}>
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{ flexGrow: 1, overflow: "auto" }}>
          {url ? (
            <iframe
              ref={iframeRef}
              src={url}
              style={{ height: !resize || autoHeight ? "100%" : "0", width: "100%", border: "none", overflow: "auto", display: "block" }}
            />
          ) : (
            children
          )}
        </div>
        <div>{footer}</div>
      </div>
    </ProPopup>
  );
};
