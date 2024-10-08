import React from 'react';
import { Button, InputNumber, Select, Table, Typography, Space } from 'antd';
import { Link } from 'react-router-dom';
import { uniqueVaccineOptions } from '../../../data/vaccineData';

const { Text } = Typography;

const getVaccineQuantity = (inventory, vaccine) => {
  const vaccineInventory = inventory?.find((item) => item.vaccine === vaccine);
  return vaccineInventory?.quantity ?? 0;
};

const getVaccineLevel = (vaccine, vaccineLevels) => {
  return vaccineLevels?.find((item) => item.name === vaccine);
};

const InputColumn = ({ value, onChange, placeholder, disabled = false, status, ...rest }) => (
  <InputNumber
    style={{ width: '100%' }}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    disabled={disabled}
    min={0}
    status={status}
    {...rest}
  />
);

const NewOrderTable = ({
  inventoryItems,
  tableData,
  setTableData,
  hasErrors,
  handleValidate,
  vaccineLevels,
}) => {
  const handleChange = (index, key, value) => {
    const newData = [...tableData];
    newData[index][key] = value;
    setTableData(newData);
  };

  const columns = [
    {
      title: 'Antigen',
      dataIndex: 'vaccine',
      width: '20%',
      render: (_, record, index) => (
        <Select
          style={{ width: '100%' }}
          options={uniqueVaccineOptions}
          value={record.vaccine}
          allowClear
          placeholder="Select Antigen"
          status={hasErrors?.[index]?.vaccine ? 'error' : undefined}
          onChange={(value) => {
            const qty = getVaccineQuantity(inventoryItems, value);
            const vaccineLevel = getVaccineLevel(value, vaccineLevels);

            if (vaccineLevel) {
              handleChange(index, 'minimum', Number(vaccineLevel.min));
              handleChange(index, 'maximum', Number(vaccineLevel.max));
              const recommendedStock = Math.floor((vaccineLevel.max - vaccineLevel.min) / 2) + vaccineLevel.min;
              handleChange(index, 'recommendedStock', recommendedStock);
            } else {
              handleChange(index, 'minimum', 0);
              handleChange(index, 'maximum', 0);
              handleChange(index, 'recommendedStock', 0);
            }
            handleChange(index, 'vaccine', value);
            handleChange(index, 'dosesInStock', qty);
          }}
        />
      ),
    },
    {
      title: 'Doses in Stock',
      dataIndex: 'dosesInStock',
      render: (value, _, index) => (
        <InputColumn
          value={value}
          placeholder="Doses in Stock"
          disabled
          status={hasErrors?.[index]?.dosesInStock ? 'error' : undefined}
        />
      ),
    },
    {
      title: 'Consumed last month',
      dataIndex: 'consumedLastMonth',
    },
    {
      title: 'Minimum',
      dataIndex: 'minimum',
      render: (value, _, index) => (
        <InputColumn
          value={value}
          placeholder="Minimum"
          disabled
          onChange={(value) => handleChange(index, 'minimum', value)}
          status={hasErrors?.[index]?.minimum ? 'error' : undefined}
        />
      ),
    },
    {
      title: 'Maximum',
      dataIndex: 'maximum',
      render: (value, _, index) => (
        <InputColumn
          value={value}
          placeholder="Maximum"
          disabled
          onChange={(value) => handleChange(index, 'maximum', value)}
          status={hasErrors?.[index]?.maximum ? 'error' : undefined}
        />
      ),
    },
    {
      title: 'Recommended Stock',
      dataIndex: 'recommendedStock',
      render: (value, _, index) => (
        <InputColumn
          value={value}
          placeholder="Recommended Stock"
          disabled
          onChange={(value) => handleChange(index, 'recommendedStock', value)}
          status={hasErrors?.[index]?.recommendedStock ? 'error' : undefined}
        />
      ),
    },
    {
      title: 'Ordered Amount',
      dataIndex: 'quantity',
      render: (value, record, index) => (
        <Space direction="vertical" style={{ width: '100%' }}>
          <InputColumn
            value={value}
            placeholder="Ordered Amount"
            min={record.minimum || 0}
            max={record.maximum || 0}
            readOnly={!record.minimum || !record.maximum}
            onBlur={(e) => {
              const { value } = e.target;
              const min = record.minimum || 0;
              const max = record.maximum || 0;
              if (value < min) {
                handleChange(index, 'quantity', min);
              } else if (value > max) {
                handleChange(index, 'quantity', max);
              } else {
                handleChange(index, 'quantity', value);
              }
            }}
            onChange={(value) => handleChange(index, 'quantity', value)}
            status={
              hasErrors?.[index]?.quantity ||
              (!record.minimum && !record.maximum && record.vaccine)
                ? 'error'
                : undefined
            }
          />
          {(!record.minimum || !record.maximum) && record.vaccine && (
            <Text type="danger" style={{ fontSize: '12px' }}>
              Please set minimum and maximum values for this vaccine{' '}
              <Link to="/stock-management/stock-configuration" style={{ textDecoration: 'underline' }}>
                here
              </Link>
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: null,
      dataIndex: 'action',
      render: (_, __, index) => (
        index > 0 && (
          <Button
            type="link"
            onClick={() => {
              const newData = [...tableData];
              newData.splice(index, 1);
              setTableData(newData);
            }}
            danger
          >
            Delete
          </Button>
        )
      ),
    },
  ];

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Table
        size="small"
        columns={columns}
        dataSource={tableData}
        pagination={false}
        rowKey={(_, index) => index}
      />
      <Space direction="vertical" align="end" style={{ width: '100%' }}>
        {Object.keys(hasErrors).length > 0 && (
          <Text type="danger" style={{ padding: '8px', backgroundColor: '#fff1f0' }}>
            {hasErrors.empty
              ? 'Please add at least one row to proceed.'
              : 'Please complete all required fields to proceed.'}
          </Text>
        )}
        <Button
          type="primary"
          style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
          onClick={() => {
            const err = handleValidate();
            if (Object.keys(err).length === 0) {
              setTableData([...tableData, { vaccine: '' }]);
            }
          }}
        >
          Add Row
        </Button>
      </Space>
    </Space>
  );
};

export default NewOrderTable;