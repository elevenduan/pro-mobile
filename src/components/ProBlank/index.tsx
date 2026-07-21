import type { FC } from "react";

export type ProBlankProps = {
  height?: number;
  color?: string;
};

export const ProBlank: FC<ProBlankProps> = (props) => {
  const { height = 12, color = "transparent" } = props;
  return <div style={{ height, backgroundColor: color }} />;
};
