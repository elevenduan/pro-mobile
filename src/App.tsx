import { Button, Form } from "antd-mobile";
import { ProNumber, ProInput, ProPassword, ProPasswordGroup, ProRadio } from "./components";
import "./App.css";

function App() {
  const [form] = Form.useForm();
  const optionsRadio = [
    { label: "男", value: "male" },
    { label: "女", value: "female" },
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
        <ProRadio label="性别" name="gender" required options={optionsRadio} />
      </Form>
    </div>
  );
}

export default App;
