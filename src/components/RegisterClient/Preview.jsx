import { Descriptions } from 'antd'
import { camelToTitle, titleCase } from '../../utils/methods'

const defaultCaregiver = {
  caregiverType: '',
  caregiverName: '',
  phoneNumber: '',
}
export default function Preview({ form, caregivers, counties, caregiverType }) {
  const values = form.getFieldsValue()
  if (caregivers?.length === 0) {
    caregivers = [defaultCaregiver]
  }
  const sections = [
    {
      title: 'Client Details',
      data: [
        {
          label: 'First Name',
          value: values.firstName,
        },
        {
          label: 'Middle Name',
          value: values.middleName,
        },
        {
          label: 'Last Name',
          value: values.lastName,
        },
        {
          label: 'Sex',
          value: titleCase(values.gender),
        },
        {
          label: 'Age',
          value: values.age,
        },
        {
          label: 'Document Identification Type',
          value: titleCase(values.identificationType?.replace(/_/g, ' ')),
        },
        {
          label: 'Document Number',
          value: values.identificationNumber,
        },
      ],
    },
    {
      title: `${caregiverType()} Details`,
      data: caregivers.map((caregiver, index) => {
        const labels = [
          'caregiverType',
          'caregiverName',
          'phoneNumber',
          'caregiverIdentificationType',
          'caregiverID',
        ]
        return labels.map((label) => {
          return {
            label: camelToTitle(label)?.replace('Caregiver', caregiverType()),
            value:
              label === 'phoneNumber' && caregiver[label]
                ? `${caregiver[label]}`
                : caregiver[label],
          }
        })
      }),
    },

    {
      title: 'Administrative Area',
      data: [
        {
          label: 'County of Residence',
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
      {sections.map((section) => (
        <Descriptions
          key={section.title}
          title={section.title}
          bordered
          column={1}
          className="mt-5"
          size="small"
        >
          {section.data.map((item) => {
            if (Array.isArray(item)) {
              return item.map((subItem) => (
                <Descriptions.Item
                  key={subItem.label}
                  label={
                    <b className="text-black font-semibold">{subItem.label}</b>
                  }
                >
                  {subItem.value}
                </Descriptions.Item>
              ))
            }
            return (
              <Descriptions.Item
                key={item.label}
                label={<b className="text-black font-semibold">{item.label}</b>}
              >
                {item.value}
              </Descriptions.Item>
            )
          })}
        </Descriptions>
      ))}
    </div>
  )
}
