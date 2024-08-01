import { useEffect, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import useAefi from '../../hooks/useAefi'
import useVaccination from '../../hooks/useVaccination'
import Table from '../DataTable'
import dayjs from 'dayjs'
import { Modal, Button, Descriptions } from 'antd'
import usePatient from '../../hooks/usePatient'
import { flattenPatientData } from '../../utils/flattenData'
import { CalendarOutlined, UserOutlined } from '@ant-design/icons'
import { formatExtensions } from './aefiController'

export default function AEFIDetails({ patientInfo }) {
  const [vaccinationAEFIs, setVaccinationAEFIs] = useState([])
  const [aefiSelected, setAefiSelected] = useState(null)
  const [patient, setPatient] = useState(null)
  const [loading, setLoading] = useState(true)

  const { getVaccineAefis } = useAefi()

  const { getImmunization } = useVaccination()
  const { getPatient } = usePatient()

  const { vaccinationID } = useParams()

  const { pathname } = useLocation()

  const fetchVaccinationInfo = async () => {
    const immunization = await getImmunization(vaccinationID)
    const response = await getPatient(
      immunization?.patient?.reference?.split('/')[1]
    )
    setPatient(flattenPatientData(response))
  }

  useEffect(() => {
    if (!patientInfo) {
      fetchVaccinationInfo()
    } else {
      setPatient(flattenPatientData(patientInfo))
    }
  }, [patientInfo])

  const formatAefis = (aefis) => {
    return aefis?.map((aefi) => {
      const extensions = formatExtensions(aefi?.resource?.extension)
      return {
        reportType: aefi?.identifier?.[0]?.value || '-',
        symptomName: aefi?.resource?.event?.coding?.[0]?.display,
        occurenceDate: dayjs(aefi?.resource?.detected).format('DD-MM-YYYY'),
        details: aefi?.resource?.event?.text,
        outcome:
          aefi?.resource?.outcome?.text ||
          aefi?.resource?.outcome?.coding?.[0]?.display,
        ...extensions,
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
      dataIndex: 'aefiReportType',
      key: 'aefiReportType',
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
          className="text-primary font-semibold"
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
    <div className="bg-white px-4 my-5 pb-4 rounded-md">
      {patient && pathname?.includes('aefi-details') && (
        <>
          <div className="w-full py-4 font-bold mb-4 border-b">
            AEFI Reports
          </div>

          <div className="py-4 px-2 mb-4 bg-gray-50 rounded-lg flex items-center">
            <div className="w-16 h-16 rounded-lg bg-primary text-white font-extrabold flex justify-center items-center mr-4">
              {patient?.name
                ?.split(' ')
                .map((name) => name.charAt(0))
                .join('')}
            </div>

            <div className="">
              <h2 className="font-bold">{patient?.name}</h2>
              <div className="flex gap-2 text-xs font-semibold">
                <div className="after:content-['|'] after:ml-0.5 after:text-primary">
                  <CalendarOutlined />
                  <span>{patient?.ageString}</span>
                </div>

                <div>
                  <UserOutlined />
                  <span>{patient?.gender}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
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
            {aefiSelected?.aefiReportType}
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
          <Descriptions.Item label="AEFI Outcome">
            {aefiSelected?.outcome}
          </Descriptions.Item>
          <Descriptions.Item label="Action Taken">
            {aefiSelected?.treatmentGiven === 'Yes' && (
              <div className="flex space-x-2">
                <h4 className="font-semibold">Treatment Given:</h4>
                <p>
                  {aefiSelected?.treatmentDetails || 'No details specified'}
                </p>
              </div>
            )}
            {aefiSelected?.specimenCollected === 'Yes' && (
              <div
                className={`flex space-x-2 ${
                  aefiSelected?.treatmentGiven === 'Yes' ? 'mt-4' : ''
                }`}
              >
                <h4 className="font-semibold">Specimen Collected:</h4>
                <p>{aefiSelected?.specimenDetails || 'No details specified'}</p>
              </div>
            )}
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    </div>
  )
}
