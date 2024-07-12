import React, { useState } from "react";
import { Button, Input, InputNumber, Select, DatePicker, Form } from "antd";
import DataTable from "../components/DataTable";
import { createUseStyles } from "react-jss";
import dayjs from "dayjs";
import localeData from "dayjs/plugin/localeData";
import weekday from "dayjs/plugin/weekday";

dayjs.extend(weekday);
dayjs.extend(localeData);

const useStyles = createUseStyles({
  btnSuccess: {
    backgroundColor: "#169416",
    borderColor: "#169416",
    color: "white",
    "&:hover": {
      backgroundColor: "#169416",
      borderColor: "#169416",
      color: "white",
    },
  },
});

export default function useInputTable({ columns, defaultData = [{}] }) {
  const [values, setValues] = useState(defaultData);

  const classes = useStyles();

  const addRowToList = () => setValues([...values, {}]);
  const removeRowFromList = (index) => setValues(values.filter((_, i) => i !== index));

  const handleChange = (value, index) => {
    setValues((prevValues) => {
      const newValues = [...prevValues];
      newValues[index] = { ...newValues[index], ...value };
      return newValues;
    });
  };

  const renderInput = (column, index) => {
    switch (column.type) {
      case "text":
        return (
          <Input
            placeholder={column.inputPlaceholder}
            value={values[index][column.dataIndex]}
            onChange={(e) => handleChange({ [column.dataIndex]: e.target.value }, index)}
            {...column}
          />
        );
      case "select":
        return (
          <Form.Item
            name={values[index][column.dataIndex]}
          >
            <Select
              className="w-full"
              placeholder={column.inputPlaceholder}
              // value={values[index][column.dataIndex]}
              onChange={(value) => handleChange({ [column.dataIndex]: value }, index)}
              {...column}
            />
          </Form.Item>
        );
      case "date":
        return (
          <DatePicker
            style={{ width: "100%" }}
            placeholder={column.inputPlaceholder}
            value={dayjs(values[index][column.dataIndex])}
            onChange={(date, dateString) => handleChange({ [column.dataIndex]: dateString }, index)}
            {...column}
          />
        );
      case "number":
        return (
          <Form.Item
            name={values[index][column.dataIndex]}
          >
            <InputNumber
              placeholder={column.inputPlaceholder}
              // value={values[index][column.dataIndex]}
              onChange={(value) => handleChange({ [column.dataIndex]: value }, index)}
              {...column}
            />
          </Form.Item>
        );
      case "remove":
        return (
          <Button type="link" onClick={() => removeRowFromList(index)} danger>
            Remove
          </Button>
        );
      default:
        return null;
    }
  };

  const generateColumns = function () {
    return columns.map((column, index) => {
      return {
        title: column.title,
        dataIndex: column.key,
        key: index,
        ...column,
        render: (_, _row, i) => {
          return <div className="mb-0 w-full">{renderInput(column, i)}</div>;
        },
        
      };
    });
  };

  const InputTable = () => {
    return (
      <div>
        <DataTable columns={generateColumns()} dataSource={values} size="small" pagination={false} />
        <div className="flex w-full">
          <Button htmlType="button" className={`${classes.btnSuccess} ml-auto my-4`} onClick={addRowToList}>
            ADD
          </Button>
        </div>
      </div>
    );
  };
  return { InputTable, values, setValues };
}
