import { useEffect, useState } from "react";
import { Button, Form } from "antd-mobile";
import {
  ProNumber,
  ProInput,
  ProPassword,
  ProPasswordGroup,
  ProRadio,
  ProCheckbox,
  ProTextArea,
  ProSelector,
  ProDatePicker,
  ProDateRange,
  ProPicker,
  ProCheckList,
  ProPopup,
  ProIFrame,
  ProSwitch,
  ProCascader,
  ProScrollList,
} from "./components";
import "./App.css";

const mockRequest = (): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: ["浙江", "杭州", "西湖区"] });
    }, 2000);
  });
};

const options = [
  { label: "男", value: "male" },
  { label: "女", value: "female" },
];

const citys = [
  {
    label: "浙江",
    value: "浙江",
    children: [
      {
        label: "杭州",
        value: "杭州",
        children: [
          { label: "西湖区", value: "西湖区" },
          { label: "上城区", value: "上城区" },
          { label: "余杭区", value: "余杭区", disabled: true },
        ],
      },
    ],
  },
];

function App() {
  const [form] = Form.useForm();
  const [visible1, setVisible1] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [params, setParams] = useState({ current: 1, size: 10 });

  useEffect(() => {
    console.log("App mounted");
  }, []);

  return (
    <div>
      <ProScrollList api={mockRequest} params={params} setParams={setParams}>
        {(list) => list.map((item, index) => <span key={index}>{item}</span>)}
      </ProScrollList>

      <Form
        form={form}
        initialValues={{ dts: [{}] }}
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
        <ProDateRange label="日期范围" required showLong />
        <Form.Array name={["dts"]}>
          {(fields) =>
            fields.map(({ key, index }) => {
              return (
                <div key={key}>
                  <ProDatePicker label="生日" name={[index, "birthday"]} required />
                  <ProDateRange label="日期范围" required showLong props={[{ name: [index, "start"] }, { name: [index, "end"] }]} />
                </div>
              );
            })
          }
        </Form.Array>
        <ProPicker label="性别" name="picker" required columns={[options]} showSearch allowSearchWord />
        <ProCheckList label="爱好" name="hobby" required options={options} multiple />
        <ProSwitch label="开关" name="switch" required layout="horizontal" />
        <ProCascader label="城市" name="cascader" required options={citys} />
      </Form>

      <Button onClick={() => setVisible1(true)}>弹窗1</Button>
      <ProPopup visible={visible1} onClose={() => setVisible1(false)} title="标题"></ProPopup>

      <Button onClick={() => setVisible2(true)}>弹窗2</Button>
      <ProIFrame visible={visible2} onClose={() => setVisible2(false)} title="服务协议" url="" height="80vh" />
    </div>
  );
}

export default App;
