import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useAefi from '../../hooks/useAefi'
import useVaccination from '../../hooks/useVaccination'
import Table from '../DataTable'
import dayjs from 'dayjs'
import { Modal, Button, Descriptions } from 'antd'
import { FundViewOutlined } from '@ant-design/icons'

export default function AEFIDetails({ patientInfo }) {
  const [vaccinationAEFIs, setVaccinationAEFIs] = useState([])
  const [aefiSelected, setAefiSelected] = useState(null)
  const [patient, setPatient] = useState(patientInfo)
  const [loading, setLoading] = useState(true)

  const { getVaccineAefis } = useAefi()

  const { getImmunization } = useVaccination()

  const { vaccinationID } = useParams()

  const fetchVaccinationInfo = async () => {
    const immunization = await getImmunization(vaccinationID)
    setPatient({
      id: immunization?.patient?.reference?.split('/')[1],
    })
  }

  useEffect(() => {
    if (!patientInfo) {
      fetchVaccinationInfo()
    }
  }, [patientInfo])

  const formatAefis = (aefis) => {
    return aefis?.map((aefi) => {
      return {
        reportType: aefi?.identifier?.[0]?.value || '-',
        symptomName: aefi?.resource?.event?.coding?.[0]?.display,
        occurenceDate: dayjs(aefi?.resource?.detected).format('DD-MM-YYYY'),
        details: aefi?.resource?.event?.text,
        outcome:
          aefi?.resource?.outcome?.text ||
          aefi?.resource?.outcome?.coding?.[0]?.display,
      }
    })
  }

  const fetchAefiInfo = async () => {
    const response = await getVaccineAefis(patient?.id, vaccinationID)
    setVaccinationAEFIs(formatAefis(response))
    setLoading(false)
  }

  const columns = [
    {
      title: 'Report Type',
      dataIndex: 'reportType',
      key: 'reportType',
    },
    {
      title: 'AEFI Type',
      dataIndex: 'symptomName',
      key: 'symptomName',
    },
    {
      title: 'Date Reported',
      dataIndex: 'occurenceDate',
      key: 'occurenceDate',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          onClick={() => {
            setAefiSelected(record)
          }}
          type="link"
          className='text-primary font-semibold'
        >
          View Details
        </Button>
      ),
    },
  ]

  useEffect(() => {
    if (patient?.id) {
      fetchAefiInfo()
    }
  }, [patient])

  return (
    <div className='bg-white px-4 my-5 py-4 rounded-md'>
      <Table
        columns={columns}
        dataSource={vaccinationAEFIs}
        loading={loading}
        size="small"
        pagination={false}
      />

      <Modal
        title="AEFI Details"
        open={aefiSelected}
        onCancel={() => setAefiSelected(null)}
        footer={[
          <Button
            type="primary"
            key="back"
            onClick={() => setAefiSelected(null)}
          >
            Close
          </Button>,
        ]}
        width={700}
      >
        <Descriptions
          bordered
          column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}
          labelStyle={{ fontWeight: 'bold', color: 'black' }}
          size="small"
          contentStyle={{ color: 'black' }}
          style={{
            borderRadius: '0px',
          }}
        >
          <Descriptions.Item label="Type of AEFI Report">
            {aefiSelected?.reportType}
          </Descriptions.Item>
          <Descriptions.Item label="AEFI Type">
            {aefiSelected?.symptomName}
          </Descriptions.Item>
          <Descriptions.Item label="Onset of event">
            {aefiSelected?.occurenceDate}
          </Descriptions.Item>
          <Descriptions.Item label="Brief details on the AEFI">
            {aefiSelected?.details}
          </Descriptions.Item>
          <Descriptions.Item label="Past Medical History">
            {aefiSelected?.pastMedicalHistory}
          </Descriptions.Item>
          <Descriptions.Item label="Action Taken">
            {aefiSelected?.action}
          </Descriptions.Item>
          <Descriptions.Item label="AEFI Outcome">
            {aefiSelected?.outcome}
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    </div>
  )
}
