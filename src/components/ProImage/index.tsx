import type { FC } from "react";
import type { ImageProps } from "antd-mobile";
import { Image, ImageViewer } from "antd-mobile";
import iconFile from "./icon_file.png";

export type ProImageProps = ImageProps;

export const ProImage: FC<ProImageProps> = (props) => {
  let src = props.src === "file" ? iconFile : props.src;

  function onClick() {
    if (src) {
      ImageViewer.show({ image: src });
    }
  }

  return <Image fit="contain" width={56} height={56} onClick={onClick} {...props} src={src} />;
};
