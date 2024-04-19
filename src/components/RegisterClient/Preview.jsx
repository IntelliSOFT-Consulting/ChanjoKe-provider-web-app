import { Descriptions } from 'antd'
import { camelToTitle, titleCase } from '../../utils/methods'


export default function Preview({ form, caregivers, counties }) {
  const values = form.getFieldsValue()
  const sections = [
    {
      title: 'Client Details',
      data: [
        {
          label: 'First Name',
          value: values.firstName,
        },
        {
          label: 'Last Name',
          value: values.lastName,
        },
        {
          label: 'Middle Name',
          value: values.middleName,
        },
        {
          label: 'Gender',
          value: values.gender,
        },
        {
          label: 'Age',
          value: values.age,
        },
        {
          label: 'Identification Type',
          value: titleCase(values.identificationType?.replace(/_/g, ' ')),
        },
        {
          label: 'ID Number',
          value: values.identificationNumber,
        },
      ],
    },
    {
      title: 'Caregiver Details',
      data: caregivers.map((caregiver, index) => {
        const labels = Object.keys(caregiver)
        return labels.map((label) => {
          return {
            label: camelToTitle(label),
            value: caregiver[label],
          }
        })
      }),
    },

    {
      title: 'Administrative Area',
      data: [
        {
          label: 'Residence of child - County',
          value: counties.find((county) => county.key === values.county)?.name,
        },
        {
          label: 'Subcounty',
          value: titleCase(values.subCounty),
        },
        {
          label: 'Ward',
          value: titleCase(values.ward),
        },
        {
          label: 'Town/Trading Center',
          value: values.townCenter,
        },
        {
          label: 'Estate & House Number/Village',
          value: values.estateOrHouseNo,
        },
      ],
    },
  ]

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6'>
      {sections.map((section) => (
        <Descriptions
          key={section.title}
          title={section.title}
          bordered
          column={1}
          size="small"
        >
          {section.data.map((item) => {
            if (Array.isArray(item)) {
              return item.map((subItem) => (
                <Descriptions.Item key={subItem.label} label={subItem.label}>
                  {subItem.value}
                </Descriptions.Item>
              ))
            }
            return (
              <Descriptions.Item key={item.label} label={item.label}>
                {item.value}
              </Descriptions.Item>
            )
          })}
        </Descriptions>
      ))}
    </div>
  )
}
