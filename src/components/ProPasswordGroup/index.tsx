import type { FC } from "react";
import type { ProPasswordProps } from "../ProPassword";
import { useContext } from "react";
import { Form } from "antd-mobile";
import { FieldContext } from "rc-field-form";
import { ProPassword } from "../ProPassword";
import { merge, isPassword } from "@bigflower/utils";

export type ProPasswordGroupProps = {
  props?: ProPasswordProps[];
  passwordValidator?: (val: string) => boolean;
  passwordMessage?: string;
};

export const ProPasswordGroup: FC<ProPasswordGroupProps> = (props) => {
  const { props: [props1 = {}, props2 = {}] = [], passwordValidator = isPassword, passwordMessage = "密码为8-16位字母、数字、特殊字符的组合" } = props;
  const formIns = useContext(FieldContext);
  const mergedProps1 = merge(
    {
      name: "pwd1",
      label: "新登录密码",
      required: true,
      rules: [{ validator: (_: unknown, val: string) => (!val || passwordValidator(val) ? Promise.resolve() : Promise.reject(passwordMessage)) }],
      itemProps: { validateFirst: true },
    },
    props1,
  );
  const fullName1 = [formIns?.prefixName || [], mergedProps1.name || []].flat();
  const watchPwd1 = Form.useWatch(fullName1);
  const mergedProps2 = merge(
    {
      name: "pwd2",
      label: "确认新密码",
      required: true,
      messageVariables: { label: "新登录密码" },
      rules: [{ validator: (_: unknown, val: string) => (!val || watchPwd1 === val ? Promise.resolve() : Promise.reject("两次输入密码不一致")) }],
      itemProps: { validateFirst: true, dependencies: [fullName1] },
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
