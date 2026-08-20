import type { FC, ReactNode, CSSProperties } from "react";
import type { ProDatePickerProps } from "../ProDatePicker";
import { useRef, useContext } from "react";
import { Form, Grid, Checkbox } from "antd-mobile";
import { FieldContext } from "rc-field-form";
import dayjs from "dayjs";
import { ProDatePicker } from "../ProDatePicker";
import { merge } from "../utils";
import { LONG_DATE, LONG_DATE_LABEL } from "../constants";

export type ProDateRangeProps = {
  props?: Omit<ProDatePickerProps, "required">[];
  label?: ReactNode;
  required?: boolean;
  disabled?: boolean;
  showLong?: boolean;
};

export const ProDateRange: FC<ProDateRangeProps> = (props) => {
  const { props: [propsStart = {}, propsEnd = {}] = [], label, required, disabled, showLong = false } = props;
  const style = { "--padding-left": "0", "--padding-right": "0", "--border-inner": "none", "--adm-color-background": "transparent", margin: "-12px 0" };
  const formIns = useContext(FieldContext);
  const mergedStart = merge({ name: "startTime", messageVariables: { label: "开始时间" }, placeholder: "开始时间" }, propsStart);
  const mergedEnd = merge({ name: "endTime", messageVariables: { label: "结束时间" }, placeholder: "结束时间" }, propsEnd);
  const startName = [formIns?.prefixName || [], mergedStart.name || []].flat();
  const endName = [formIns?.prefixName || [], mergedEnd.name || []].flat();
  const watchStart = Form.useWatch(startName);
  const watchEnd = Form.useWatch(endName);
  const prevEndVal = useRef(null);

  // 同时有值或无值
  const isRequired = Boolean(required || watchStart || watchEnd);

  // 是否长期
  const isLong = dayjs(watchEnd).isSame(LONG_DATE, "day");

  return (
    <Form.Item label={label} name={[]} required={required} disabled={disabled}>
      <Grid columns={showLong ? 30 : 24} style={style as CSSProperties}>
        <Grid.Item span={10}>
          <ProDatePicker {...mergedStart} required={isRequired} />
        </Grid.Item>
        <Grid.Item span={4}>
          <div style={{ textAlign: "center", padding: "12px 0" }}>~</div>
        </Grid.Item>
        <Grid.Item span={10}>
          <ProDatePicker
            {...mergedEnd}
            required={isRequired}
            disabled={disabled ? false : isLong}
            rules={[
              {
                validator: () => (watchStart && watchEnd && dayjs(watchEnd).isBefore(watchStart) ? Promise.reject("不能早于开始时间") : Promise.resolve()),
              },
              ...(propsEnd?.rules || []),
            ]}
          />
        </Grid.Item>
        {showLong && (
          <Grid.Item span={6}>
            <Checkbox
              block
              checked={isLong}
              onChange={async (val) => {
                if (val) {
                  prevEndVal.current = watchEnd || null;
                }
                formIns?.setFieldValue(endName, val ? LONG_DATE : prevEndVal.current);
                await formIns?.validateFields([endName]);
              }}
              style={{ justifyContent: "flex-end", padding: "12px 0" }}
            >
              {LONG_DATE_LABEL}
            </Checkbox>
          </Grid.Item>
        )}
      </Grid>
    </Form.Item>
  );
};
