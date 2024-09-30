import { Descriptions } from 'antd'
import React from 'react'
import { camelToTitle, titleCase } from '../../utils/methods'
import { useSelector } from 'react-redux'

const AEFIPreview = ({ form, selectedVaccines }) => {
  const formValues = form.getFieldsValue()
  const { user } = useSelector((state) => state.userInfo)

  const fields = [
    {
      title: 'Type of AEFI Report',
      value: formValues.aefiReportType,
    },
    {
      title: 'Type of AEFI',
      value: formValues.aefiType,
    },
    {
      title: 'Onset of Event',
      value: formValues.eventOnset?.format('DD-MM-YYYY'),
    },
    {
      title: 'Brief details on the AEFI',
      value: formValues.aefiDetails,
    },
    {
      title: 'Past Medical History',
      value: formValues.pastMedicalHistory,
    },
    {
      title: 'Facility Name',
      value: titleCase(user?.facilityName),
    },
    {
      title: 'Vaccines',
      value: selectedVaccines?.map((vaccine) => `${vaccine?.vaccine} (${vaccine?.batchNumber})`)?.join(', '),
    },
  ]

  return (
    <div>
      <Descriptions
        title="AEFI Details"
        bordered
        column={2}
        size="small"
        labelStyle={{ fontWeight: 'bold', color: 'black' }}
      >
        {fields.map((field, index) => (
          <Descriptions.Item key={index} label={camelToTitle(field.title)}>
            {field.value}
          </Descriptions.Item>
        ))}
      </Descriptions>
    </div>
  )
}

export default AEFIPreview
