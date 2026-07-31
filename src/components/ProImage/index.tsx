import type { FC, MouseEvent } from "react";
import type { ImageProps } from "antd-mobile";
import { Image, ImageViewer } from "antd-mobile";
import iconFile from "./icon_file.png";

export type ProImageProps = ImageProps;

export const ProImage: FC<ProImageProps> = (props) => {
  let src = props.src;
  if (src && !(src.startsWith("data:image/") || src.startsWith("http"))) {
    src = iconFile;
  }

  function onClick(e: MouseEvent<HTMLImageElement, Event>) {
    if (src) {
      ImageViewer.show({ image: src });
    }
    props?.onClick?.(e);
  }

  return <Image fit="contain" width={64} height={64} {...props} src={src} onClick={onClick} />;
};
