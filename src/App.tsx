import { Button, Form } from "antd-mobile";
import { ProNumber } from "./components";
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
      </Form>
    </div>
  );
}

export default App;
