import { Button, Form } from "antd-mobile";
import { ProNumber, ProInput, ProPassword, ProPasswordGroup, ProRadio, ProCheckbox, ProTextArea, ProSelector, ProDatePicker } from "./components";
import "./App.css";

function App() {
  const [form] = Form.useForm();
  const options = [
    { label: "男", value: "male" },
    { label: "女", value: "female" },
    { label: "其他", value: "other", disabled: true },
  ];

  return (
    <div>
      <Form
        form={form}
        onFinish={(values) => console.log(values)}
        onFinishFailed={(errorInfo) => console.log(errorInfo)}
        // layout="horizontal"
        footer={
          <Button type="submit" size="large" color="primary" block>
            提交
          </Button>
        }
      >
        <ProNumber label="金额" name="money" required extra="元" />
        <ProInput label="邮箱" name="email" required verify="email" />
        <ProPassword label="密码" name="password" required />
        <ProPasswordGroup />
        <ProRadio label="性别" name="gender" required options={options} />
        <ProCheckbox label="性别" name="sex" required options={options} />
        <ProTextArea label="备注" name="remark" />
        <ProSelector label="性别" name="selector" required options={options} columns={3} />
        <ProDatePicker label="生日" name="birthday" required />
      </Form>
    </div>
  );
}

export default App;
