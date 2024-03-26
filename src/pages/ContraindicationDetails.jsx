import { useNavigate, useParams } from 'react-router-dom'
import BaseTable from '../common/tables/BaseTable'
import ConvertObjectToArray from '../components/RegisterClient/convertObjectToArray'
import { useApiRequest } from '../api/useApiRequest'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

export default function ContraindicationDetails() {

  const [contraindicationInfo, setContraindicationInfo] = useState([])
  const [vaccinationDetails, setVaccinationDetails] = useState(null)

  const navigate = useNavigate()
  const { get } = useApiRequest()
  const { contraindicationID } = useParams()

  useEffect(() => {

    if (vaccinationDetails !== null) {
      console.log({ vaccinationDetails })
      setContraindicationInfo(ConvertObjectToArray({
        'Contraindication Date': dayjs(vaccinationDetails?.occurrenceDateTime).format('Do MMM YYYY'),
        'Next Vaccination Date': dayjs(vaccinationDetails?.education?.[0]?.presentationDate).format('Do MMM YYYY'),
      }))
    }
  }, [vaccinationDetails])

  const fetchVaccinationDetails = async () => {
    const response = await get(`/hapi/fhir/Immunization/${contraindicationID}`)
    setVaccinationDetails(response)
  }

  useEffect(() => {
    fetchVaccinationDetails()
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow mt-5 full-width">
        <div className="flex flex-wrap bg-[#f9fafb00] items-center gap-6 px-10 sm:flex-nowrap sm:px-10 lg:px-10 shadow">
          <div className="text-2xl font-semibold py-5">
            Contraindications
          </div>
        </div>

        {vaccinationDetails?.note?.[1]?.authorString && <div className="grid grid-cols-2 gap-10 mx-7 px-10 py-10">
          <div>

            <BaseTable data={contraindicationInfo} />

          </div>
          <div>

            <p className='font-bold'>Contraindications</p>

            <p>
              { vaccinationDetails?.note?.[1]?.authorString}
            </p>
          </div>
        </div>
        }

        {!vaccinationDetails?.note?.[1]?.authorString && <div className="text-center  mx-7 px-10 py-10">
            Contraindication not found
          </div>
        }

        <div className="px-4 py-4 sm:px-6 flex justify-end">
          <button
            onClick={() => navigate(-1)}
            className="ml-4 flex-shrink-0 rounded-md outline bg-[#163C94] outline-[#163C94] px-10 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#163C94] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#163C94">
            Back
          </button>
          
        </div>
        
      </div>
    </>
  )
}