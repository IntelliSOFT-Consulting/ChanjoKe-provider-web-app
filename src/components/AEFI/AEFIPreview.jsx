import { Descriptions } from 'antd'
import React from 'react'
import { camelToTitle } from '../../utils/methods'

const AEFIPreview = ({ form }) => {
  const formValues = form.getFieldsValue()

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
      title: 'Treatment Given',
      value: formValues.actionTaken?.includes('Treatment Given') ? 'Yes' : 'No',
    },
    {
      title: 'Specimen collected for investigation',
      value: formValues.actionTaken?.includes(
        'Specimen collected for investigation'
      )
        ? 'Yes'
        : 'No',
    },
    {
      title: 'Specify treatment Details',
      value: formValues.treatmentDetails,
    },
    {
      title: 'Specify specimen Details',
      value: formValues.specimenDetails,
    },
    {
      title: 'AEFI Outcome',
      value: formValues.aefiOutcome,
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
