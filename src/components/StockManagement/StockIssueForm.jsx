import React from "react";
import { Form, Select, DatePicker, InputNumber } from "antd";

export default function StockIssueForm({ form, onSubmit, InputTable }) {
  return (
    <Form layout="vertical" form={form} onFinish={onSubmit} className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-0 md:gap-6 mb-6">
        <Form.Item
          label="Vaccine/Diluent"
          rules={[{ required: true, message: "Please select a vaccine" }]}
          name="vaccine"
          className="mb-0"
        >
          <Select options={[{ value: "BCH", label: "BCG" }]} placeholder="Select Vaccine" />
        </Form.Item>
        <Form.Item label="Stock Quantity" name="stockQuantity" className="mb-0">
          <InputNumber placeholder="Stock quantity" className="w-full" min={1} disabled />
        </Form.Item>
        <Form.Item label="Allocated Quantity" name="allocatedQuantity" className="mb-0">
          <InputNumber placeholder="Allocated quantity" className="w-full" min={1} disabled />
        </Form.Item>
        <Form.Item label="Remaining Quantity" name="remainingQuantity" className="mb-0">
          <InputNumber placeholder="Remaining quantity" className="w-full" min={1} disabled />
        </Form.Item>

        <Form.Item
          label="Issue Date"
          name="issueDate"
          rules={[{ required: true, message: "Please enter issue date" }]}
          className="mb-0"
        >
          <DatePicker className="w-full" placeholder="Issue date" />
        </Form.Item>
      </div>
      <InputTable />
    </Form>
  );
}
