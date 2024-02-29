import { useState, useEffect } from "react";
import IssueStockLogo from "../common/icons/issueStockLogo";
import OrderStockLogo from "../common/icons/orderStockLogo";
import ReceiveStockLogo from "../common/icons/receiveStockLogo";
import StockLedgerLogo from "../common/icons/stockLedgerLogo";
import FormState from "../utils/formState";
import { Link } from "react-router-dom";
import DataTable from "../components/DataTable";
import { Input } from "antd";

const results = [
  { id: "", name: "BCG", batchNumber: "AG8998HH88", quantity: "30" },
  { id: "", name: "OPV 1", batchNumber: "UU8090DDD4", quantity: "20" },
  { id: "", name: "BCG", batchNumber: "77TYD66767", quantity: "30" },
];

export default function StockManagement() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Fetch stock data
    setData(results);
  }, []);
  const iconComponents = {
    IssueStockLogo,
    OrderStockLogo,
    ReceiveStockLogo,
    StockLedgerLogo,
  };

  const stats = [
    { name: "Receive Stock", icon: "ReceiveStockLogo", href: "receive-stock" },
    { name: "Order Stock", icon: "OrderStockLogo", href: "order-stock" },
    { name: "Issue Stock", icon: "IssueStockLogo", href: "issue-stock" },
    { name: "Stock Ledger", icon: "StockLedgerLogo", href: "stock-ledger" },
  ];

  const tHeaders = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Batch Number", dataIndex: "batchNumber", key: "batchNumber" },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_, _record) => <Link to="/">View</Link>,
    },
  ];

  const handleSearch = (e) => {
    const matched = results.filter((result) => {
      return (
        result.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        result.batchNumber.toLowerCase().includes(e.target.value.toLowerCase())
      );
    });
    setData(matched);
  };

  return (
    <div>
      <dl className="mx-auto max-w-7xl px-6 sm:px-6 lg:px-8 mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4 py-12 rounded-lg shadow-lg border bg-white">
        {stats.map((item) => {
          const IconComponent = iconComponents[item.icon];
          return (
            <Link
              to={item.href}
              key={item.name}
              className="overflow-hidden grid justify-items-center text-center rounded-lg bg-white px-4 py-5 shadow sm:p-6 border border-primary"
            >
              <IconComponent height="50" width="50" fillColor="#292929" className="h-12 block mx-auto mb-5" />
              <dt className="truncate mt-5 text-dark">{item.name}</dt>
            </Link>
          );
        })}
      </dl>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow mt-10">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex mb-6">
            <div className="col-span-3 absolute top-0 left-0 bg-primary">
              <div className="px-8 text-white font-semibold py-2">Current Stock</div>
            </div>
            <div className="w-1/2 ml-auto mt-8">
              <Input placeholder="Search" onChange={handleSearch} allowClear />
            </div>
          </div>

          {data && (
            <DataTable
              columns={tHeaders}
              loading={!data}
              dataSource={data}
              align="center"
              size="small"
              pagination={data?.length > 5 ? { pageSize: 5 } : false}
            />
          )}
        </div>
      </div>
    </div>
  );
}
