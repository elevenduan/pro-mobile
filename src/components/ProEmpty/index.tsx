import type { FC } from "react";
import type { ErrorBlockProps } from "antd-mobile";
import { ErrorBlock } from "antd-mobile";
import empty from "./empty.svg";

export const ProEmpty: FC<ErrorBlockProps> = (props) => {
  return <ErrorBlock style={{ padding: "30px 0" }} image={empty} title="暂无数据" description="" {...props} />;
};
