import { Button, Form } from "antd-mobile";
import { ProNumber, ProInput, ProPassword } from "./components";
import "./App.css";

function App() {
  const [form] = Form.useForm();

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
      </Form>
    </div>
  );
}

export default App;
