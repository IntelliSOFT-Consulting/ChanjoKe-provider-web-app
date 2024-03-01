import React, { useState } from "react";
import { Button, Input, InputNumber, Select, DatePicker } from "antd";
import DataTable from "../components/DataTable";
import { createUseStyles } from "react-jss";

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
    switch (column.inputType) {
      case "text":
        return (
          <Input
            size="small"
            placeholder={column.inputPlaceholder}
            value={values[index][column.inputName]}
            onChange={(e) => handleChange({ [column.inputName]: e.target.value }, index)}
          />
        );
      case "select":
        return (
          <Select
            size="small"
            placeholder={column.inputPlaceholder}
            value={values[index][column.inputName]}
            onChange={(value) => handleChange({ [column.inputName]: value }, index)}
          >
            {column.options.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        );
      case "date":
        return (
          <DatePicker
            style={{ width: "100%" }}
            placeholder={column.inputPlaceholder}
            value={values[index][column.inputName]}
            onChange={(date, dateString) => handleChange({ [column.inputName]: dateString }, index)}
          />
        );
      case "number":
        return (
          <InputNumber
            size="small"
            placeholder={column.inputPlaceholder}
            value={values[index][column.inputName]}
            onChange={(value) => handleChange({ [column.inputName]: value }, index)}
          />
        );
      case "remove":
        return (
          <Button type="link" onClick={() => removeRowFromList(index)}>
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
  return { InputTable, values };
}
