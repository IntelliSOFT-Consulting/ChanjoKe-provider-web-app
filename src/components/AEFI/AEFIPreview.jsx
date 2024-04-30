import { Descriptions } from 'antd'
import React from 'react'
import { camelToTitle } from '../../utils/methods'

const AEFIPreview = ({ form }) => {
  const formValues = form.getFieldsValue()

  return (
    <div>
      <Descriptions title="AEFI Details" bordered column={2}>
        {Object.keys(formValues).map((key) => (
          <Descriptions.Item
            label={
              <span className="font-bold text-black">{camelToTitle(key)}</span>
            }
          >
            {typeof formValues[key] === 'object' && formValues[key]?.format
              ? formValues[key].format('DD-MM-YYYY')
              : formValues[key]}
          </Descriptions.Item>
        ))}
      </Descriptions>
    </div>
  )
}

export default AEFIPreview
