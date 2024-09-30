import { Button, Descriptions } from 'antd'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Table from '../components/DataTable'
import usePatient from '../hooks/usePatient'
import {
  convertCamelCaseString,
  formatCardTitle,
  titleCase,
} from '../utils/methods'
import Loading from '../common/spinners/LoadingArrows'
import { useAccess } from '../hooks/useAccess'
import { useLocations } from '../hooks/useLocation'

export default function ClientRecords() {
  const [details, setDetails] = useState({})
  const [isOver18, setIsOver18] = useState(false)

  const { clientID } = useParams()
  const navigate = useNavigate()

  const { counties } = useLocations()

  const { canAccess } = useAccess()

  const { getPatient, patient } = usePatient()

  const formatDate = (date) => moment(date).format('DD-MM-YYYY')

  const getPatientName = (patient, index) =>
    patient?.name?.[0]?.given?.[index] || ''
  const getPatientAddress = (patient, index) =>
    patient?.address?.[0]?.line?.[index] || ''
  const findIdentifier = (identifiers, condition) =>
    identifiers.find((id) => condition(id)) || {}

  const formatDetails = (patient) => {
    const firstName = getPatientName(patient, 0)
    const middleName = getPatientName(patient, 1)
    const lastName = patient?.name?.[0]?.family || ''
    const gender = titleCase(patient?.gender || '')
    const dob = formatDate(patient?.birthDate)
    const clientNumber = patient?.telecom?.[0]?.value || ''

    const identifiers =
      patient?.identifier?.filter(
        (id) =>
          id?.type?.coding?.[0]?.code?.toLowerCase() === 'identification_type'
      ) || []

    let mainIdentifier = ''
    let identificationNumber = ''

    if (identifiers.length) {
      const otherId = findIdentifier(
        identifiers,
        (item) =>
          !item?.type?.coding?.[0]?.display
            ?.toLowerCase()
            ?.includes('notification')
      )

      mainIdentifier = titleCase(otherId?.type?.coding?.[0]?.display || '')
      identificationNumber = otherId?.value || ''

      if (!mainIdentifier) {
        mainIdentifier = titleCase(
          identifiers[0]?.type?.coding?.[0]?.display || ''
        )
        identificationNumber = identifiers[0]?.value || ''
      }
    }

    const county =
      getPatientAddress(patient, 0) || patient?.address?.[0]?.line?.[0] || ''
    const countyName = counties.find((item) => item.key === county)?.name
    const subCounty =
      getPatientAddress(patient, 1) || patient?.address?.[0]?.district || ''
    const ward =
      getPatientAddress(patient, 2) || patient?.address?.[0]?.state || ''

    const phoneNumber = patient?.contact?.[0]?.telecom?.[0]?.value || ''
    const communityUnit = patient?.address?.[0]?.line?.[3]
    const townCenter = patient?.address?.[0]?.line?.[4]
    const estateOrHouseNo = patient?.address?.[0]?.line?.[5]

    const caregivers = patient?.contact?.map((caregiver) => {
      const name = caregiver.name
      const identificationType = caregiver.extension?.find(
        (item) => item.url === 'caregiver_id_type'
      )?.valueString
      const identificationNumber = caregiver.extension?.find(
        (item) => item.url === 'caregiver_id_number'
      )?.valueString
      const kins = caregiver.extension?.filter(
        (item) => item.url === 'next-of-kin'
      )

      return {
        'Caregiver Name':
          name?.text ||
          `${name?.given?.join(' ') || ''} ${name?.family || ''}`.trim(),
        'Caregiver Relationship': caregiver.relationship?.[0]?.text || '',
        'Caregiver Phone Number': caregiver.telecom?.[0]?.value || '',
        'Caregiver Identification Type': identificationType || '',
        'Caregiver Identification Number': identificationNumber || '',
        'Next of Kin': kins?.map((kin) => ({
          'Next of Kin Name': kin?.extension?.find(
            (item) => item.url === 'name'
          )?.valueString,
          'Next of Kin Relationship': kin?.extension?.find(
            (item) => item.url === 'relationship'
          )?.valueString,
          'Next of Kin Phone Number': kin?.extension?.find(
            (item) => item.url === 'phone'
          )?.valueString,
        })),
      }
    })
    return {
      'First Name': firstName,
      'Middle Name': middleName,
      'Last Name': lastName,
      Sex: gender,
      'Date of Birth': dob,
      'Document Identification Type': formatCardTitle(mainIdentifier),
      'Document Number': identificationNumber,
      'Phone Number': clientNumber,
      'County of Residence': countyName,
      'Sub-County': titleCase(subCounty),
      Ward: titleCase(ward),
      'Town/Trading Center': townCenter,
      'Community Unit': communityUnit,
      'Estate & House Number/Village': estateOrHouseNo,
      caregivers,
    }
  }

  useEffect(() => {
    getPatient(clientID)
  }, [clientID])

  useEffect(() => {
    if (patient && counties?.length) {
      const age = moment().diff(patient.birthDate, 'years')
      setIsOver18(age >= 18)
      setDetails(formatDetails(patient))
    }
  }, [patient, counties])

  const columns = [
    {
      title: 'Caregiver Name',
      dataIndex: 'Caregiver Name',
      key: 'Caregiver Name',
    },
    {
      title: 'Caregiver Relationship',
      dataIndex: 'Caregiver Relationship',
      key: 'Caregiver Relationship',
    },
    {
      title: 'Phone Number',
      dataIndex: 'Caregiver Phone Number',
      key: 'Caregiver Phone Number',
    },
    {
      title: 'Caregiver Identification Type',
      dataIndex: 'Caregiver Identification Type',
      key: 'Caregiver Identification Type',
    },
    {
      title: 'Caregiver Identification Number',
      dataIndex: 'Caregiver Identification Number',
      key: 'Caregiver Identification Number',
      render: (text) => text || '-',
    },
  ]
  return (
    <div className="divide-y divide-gray-200 overflow-visible rounded-lg bg-white shadow mt-5">
      {!patient ? (
        <div className="flex justify-center items-center h-96">
          <Loading />
        </div>
      ) : (
        <>
          <div className="px-4 text-2xl font-semibold py-4 flex justify-end px-14">
            {canAccess('UPDATE_CLIENT') && (
              <Button
                onClick={() => navigate(`/register-client/${clientID}`)}
                type="primary"
              >
                Update record
              </Button>
            )}
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mx-7">
              {/* Column 1 */}
              <div>
                <h2 className="text-xl font-semibold mb-5">Client Details</h2>
                <Descriptions
                  bordered
                  size="small"
                  column={1}
                  className="w-full"
                >
                  {[
                    'First Name',
                    'Middle Name',
                    'Last Name',
                    'Sex',
                    'Date of Birth',
                    'Document Identification Type',
                    'Document Number',
                    'Phone Number',
                  ].map((key) => (
                    <Descriptions.Item
                      key={key}
                      label={convertCamelCaseString(key)}
                      labelStyle={{ fontWeight: 'bold', color: 'black' }}
                    >
                      {details[key]}
                    </Descriptions.Item>
                  ))}
                </Descriptions>
              </div>

              {/* Column 3 */}
              <div>
                <h2 className="text-xl font-semibold mb-5">
                  Administrative Area
                </h2>

                <Descriptions
                  bordered
                  size="small"
                  column={1}
                  className="w-full"
                >
                  {[
                    'County of Residence',
                    'Sub-County',
                    'Ward',
                    'Community Unit',
                    'Town/Trading Center',
                    'Estate & House Number/Village',
                  ].map((key) => (
                    <Descriptions.Item
                      key={key}
                      label={convertCamelCaseString(key)}
                      labelStyle={{ fontWeight: 'bold', color: 'black' }}
                    >
                      {details[key]}
                    </Descriptions.Item>
                  ))}
                </Descriptions>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold ml-7 mb-5 mt-5">
                {isOver18 ? 'Next of Kin' : 'Caregiver'} Details
              </h2>

              <Table
                columns={columns}
                dataSource={details?.caregivers || []}
                size="small"
                pagination={false}
                expandable={{
                  expandedRowRender: (record) => {
                    return (
                      <div className="flex flex-col">
                        {record['Next of Kin']?.map((kin) => (
                          <div className="flex space-x-4">
                            <div>
                              <b>Name:</b>
                              <span className="ml-2">
                                {kin['Next of Kin Name']}
                              </span>
                            </div>
                            <div>
                              <b>Relationship:</b>
                              <span className="ml-2">
                                {kin['Next of Kin Relationship']}
                              </span>
                            </div>
                            <div>
                              <b>Phone Number:</b>
                              <span className="ml-2">
                                {kin['Next of Kin Phone Number']}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  },
                  rowExpandable: (record) => record['Next of Kin']?.length > 0,
                }}
              />
            </div>
          </div>

          <div className="px-4 py-4 sm:px-6 flex justify-end mx-9">
            <Button
              onClick={() => navigate(-1)}
              className="ml-4  border-1 border-primary text-primary"
            >
              Back
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
