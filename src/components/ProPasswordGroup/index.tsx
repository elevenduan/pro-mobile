import type { FC } from "react";
import type { ProPasswordProps } from "../ProPassword";
import { Form } from "antd-mobile";
import { ProPassword } from "../ProPassword";
import { merge, isPassword } from "../utils";

export type ProPasswordGroupProps = {
  props?: ProPasswordProps[];
  passwordValidator?: (val: string) => boolean;
  passwordMessage?: string;
};

export const ProPasswordGroup: FC<ProPasswordGroupProps> = (props) => {
  const { props: [props1 = {}, props2 = {}] = [], passwordValidator = isPassword, passwordMessage = "密码为8-16位字母、数字、特殊字符的组合" } = props;
  const mergedProps1 = merge(
    {
      name: "pwd1",
      label: "新登录密码",
      required: true,
      itemProps: {
        validateFirst: true,
        rules: [{ validator: (_: unknown, val: string) => (!val || passwordValidator(val) ? Promise.resolve() : Promise.reject(passwordMessage)) }],
      },
    },
    props1,
  );
  const watchPwd1 = Form.useWatch(mergedProps1.name);
  const mergedProps2 = merge(
    {
      name: "pwd2",
      label: "确认新密码",
      required: true,
      messageVariables: { label: "新登录密码" },
      itemProps: {
        validateFirst: true,
        rules: [{ validator: (_: unknown, val: string) => (!val || watchPwd1 === val ? Promise.resolve() : Promise.reject("两次输入密码不一致")) }],
      },
    },
    props2,
  );

  return (
    <>
      <ProPassword {...mergedProps1} />
      <ProPassword {...mergedProps2} />
    </>
  );
};
