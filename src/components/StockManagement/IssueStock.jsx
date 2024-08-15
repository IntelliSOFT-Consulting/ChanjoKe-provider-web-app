import { Card } from 'antd'
import React from 'react'
import SingleLocation from './issueStock/SingleLocation'

const IssueStock = () => {
  return (
    <Card
      className="mt-5"
      title={<div className="text-xl font-semibold">Issue Stock</div>}
    >
      <SingleLocation />
    </Card>
  )
}

export default IssueStock
