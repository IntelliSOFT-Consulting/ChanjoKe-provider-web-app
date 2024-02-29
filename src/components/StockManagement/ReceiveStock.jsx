import React, { useState } from "react";
import { Card, Button, Form, Input, InputNumber, Select, DatePicker } from "antd";
import DataTable from "../DataTable";
import { createUseStyles } from "react-jss";

const { useForm } = Form;

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
  btnPrimary: {
    backgroundColor: "#163C94",
    borderColor: "#163C94",
    color: "white",
    "&:hover": {
      backgroundColor: "#163C94 !important",
      borderColor: "#163C94",
      color: "white !important",
    },
  },
});

const ReceiveStock = () => {
  const [vaccines, setVaccines] = useState([{}]);

  const handleChange = (value, index) => {
    const newVaccines = [...vaccines];
    newVaccines[index] = { ...newVaccines[index], ...value };
    setVaccines(newVaccines);
  };

  const classes = useStyles();
  const [form] = useForm();

  const tHeaders = [
    { title: "Vaccine/Diluents", class: "", key: "vaccine" },
    { title: "Batch Number", class: "", key: "batchNumber" },
    { title: "Expiry Date", class: "", key: "expiryDate" },
    { title: "Stock Quantity", class: "", key: "stockQuantity" },
    { title: "Quantity", class: "", key: "quantity" },
    { title: "VVM Status", class: "", key: "vvmStatus" },
    { title: "Manufacturer Details", class: "", key: "manufacturerDetails" },
    { title: "Action", class: "", key: "actions" },
  ];

  const removeRowFromVaccineList = (index) => setVaccines(vaccines.filter((_, i) => i !== index));

  const columns = tHeaders.map((header, index) => ({
    title: header.title,
    dataIndex: header.key,
    render: (_, row, i) => {
      const item = vaccines[i] || {};
      switch (header.key) {
        case "vaccine":
          return (
            <Form.Item className="mb-0">
              <Select
                options={[
                  { label: "BCG", value: "BCG" },
                  { label: "BTCS2", value: "BTCS2" },
                ]}
                onChange={(value) => {
                  handleChange({ vaccine: value }, i);
                }}
              />
            </Form.Item>
          );
        case "batchNumber":
          return (
            <Form.Item className="mb-0">
              <Select
                options={[
                  { label: "BCG", value: "BCG" },
                  { label: "BTCS2", value: "BTCS2" },
                ]}
                onChange={(value) => {
                  handleChange({ batchNumber: value }, i);
                }}
              />
            </Form.Item>
          );
        case "expiryDate":
          return (
            <Form.Item className="mb-0">
              <DatePicker className="w-full" disabled onChange={(date) => handleChange({ expiryDate: date }, i)} />
            </Form.Item>
          );
        case "stockQuantity":
          return (
            <Form.Item className="mb-0">
              <InputNumber min={0} disabled onChange={(value) => handleChange({ stockQuantity: value }, i)} />
            </Form.Item>
          );
        case "quantity":
          return (
            <Form.Item className="mb-0">
              <InputNumber min={0} onChange={(value) => handleChange({ quantity: value }, i)} />
            </Form.Item>
          );
        case "vvmStatus":
          return (
            <Form.Item className="mb-0">
              <Select
                options={[{ label: "Status", value: "Status" }]}
                onChange={(value) => handleChange({ vvmStatus: value }, i)}
              />
            </Form.Item>
          );
        case "manufacturerDetails":
          return (
            <Form.Item className="mb-0">
              <Input disabled onChange={(value) => handleChange({ manufacturerDetails: value }, i)} />
            </Form.Item>
          );
        case "actions":
          return (
            <Button className="p-0 m-0" type="link" danger onClick={() => removeRowFromVaccineList(i)}>
              Remove
            </Button>
          );
        default:
          return null;
      }
    },
  }));

  const onSubmit = (values) => {
    console.log(values);
  };

  const addRowToVaccineList = () => setVaccines([...vaccines, {}]);

  return (
    <Card
      className="mt-5"
      title={<div className="text-xl font-semibold">Receive Stock</div>}
      actions={[
        <div className="flex w-full justify-end px-6">
          <Button className="mr-4" onClick={() => form.resetFields()}>
            Cancel
          </Button>
          <Button className={classes.btnPrimary} onClick={() => form.submit()}>
            Save
          </Button>
        </div>,
      ]}
    >
      <Form layout="vertical" form={form} onFinish={onSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-6 mb-6">
          <Form.Item
            label="Date Received"
            name="dateReceived"
            rules={[{ required: true, message: "Please input the date received" }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item label="Origin" rules={[{ required: true, message: "Please input the origin" }]} name="origin">
            <Select
              name="origin"
              options={[
                { value: "NPHCDA", label: "NPHCDA" },
                { value: "State", label: "State" },
              ]}
              placeholder="Origin"
            />
          </Form.Item>

          <Form.Item
            label="Order Number"
            name="orderNumber"
            rules={[{ required: true, message: "Please input the order number" }]}
          >
            <Input size="small" placeholder="Order number" />
          </Form.Item>
        </div>
        <DataTable columns={columns} dataSource={vaccines} size="small" pagination={false} />
        <div className="flex w-full">
          <Button htmlType="button" className={`${classes.btnSuccess} ml-auto my-4`} onClick={addRowToVaccineList}>
            ADD
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default ReceiveStock;
