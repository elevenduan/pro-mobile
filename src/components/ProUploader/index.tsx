import type { FC } from "react";
import type { FormItemProps, ImageUploaderProps, ImageUploadItem } from "antd-mobile";
import type { GeneralFormItemKey, NamePath } from "../types";
import { Form, ImageUploader, Toast } from "antd-mobile";
import iconFile from "../ProImage/icon_file.png";

export type ProUploaderProps = Pick<FormItemProps, GeneralFormItemKey> & {
  name?: NamePath;
  apiUpload?: (file: File) => Promise<Partial<ImageUploadItem> | null>; // extra: mime
  maxFileSize?: number; // MB
  itemProps?: Omit<FormItemProps, "name" | GeneralFormItemKey>;
  fieldProps?: Omit<ImageUploaderProps, "upload">;
};

export const ProUploader: FC<ProUploaderProps> = (props) => {
  const { required, apiUpload, maxFileSize = 10, itemProps, fieldProps, ...rest } = props;
  const messageLabel = rest.messageVariables?.label || rest.label || "";

  async function beforeUpload(file: File) {
    const accept =
      fieldProps?.accept
        ?.toLowerCase()
        ?.split(",")
        ?.map((item) => item.trim()) || null;
    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();
    if (!accept && !fileType.startsWith("image/")) {
      Toast.show("请上传图片文件");
      return null;
    }
    if (accept && !accept.some((item) => fileName.endsWith(item) || fileType.startsWith(item.replace("/*", "")) || ["*", "*/*"].includes(item))) {
      Toast.show("请上传支持的文件");
      return null;
    }
    if (file.size > maxFileSize * 1024 * 1024) {
      Toast.show(`文件大小不能超过 ${maxFileSize} MB`);
      return null;
    }
    return file;
  }

  async function upload(file: File) {
    const res = await apiUpload?.(file);
    const url = res?.url === "file" ? iconFile : res?.url || URL.createObjectURL(file);
    return { ...res, url };
  }

  return (
    <Form.Item {...rest} {...itemProps} rules={[{ required, message: `请上传${messageLabel}` }, ...(rest.rules || [])]}>
      <ImageUploader beforeUpload={beforeUpload} maxCount={1} {...fieldProps} upload={upload} />
    </Form.Item>
  );
};
