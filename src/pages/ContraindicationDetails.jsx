import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useVaccination from '../hooks/useVaccination'
import LoadingArrows from '../common/spinners/LoadingArrows'

export default function ContraindicationDetails() {
  const [contraindicationInfo, setContraindicationInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  const { contraindicationID } = useParams()

  const { immunization, getImmunization, getRecommendations, recommendations } =
    useVaccination()

  useEffect(() => {
    getImmunization(contraindicationID)
  }, [])

  useEffect(() => {
    if (immunization) {
      const patientId = immunization?.patient?.reference?.split('/')[1]
      getRecommendations(patientId)
    }
  }, [immunization])

  useEffect(() => {
    if (recommendations) {
      setLoading(false)
    }
    if (immunization?.status === 'entered-in-error' && recommendations) {
      const reason = immunization?.statusReason?.text
      const date = dayjs(immunization?.occurrenceDateTime).format('DD-MM-YYYY')
      const nextVaccine = recommendations?.recommendation?.find(
        (vaccine) =>
          vaccine.vaccineCode?.[0]?.coding[0].display ===
          immunization.vaccineCode?.coding?.[0]?.display
      )

      if (nextVaccine) {
        const nextVaccineDate = dayjs(
          nextVaccine.dateCriterion.find(
            (date) => date.code.coding[0].code === 'Earliest-date-to-administer'
          ).value
        ).format('DD-MM-YYYY')

        setContraindicationInfo({
          vaccine: immunization.vaccineCode?.text,
          date,
          reason,
          nextVaccine: nextVaccine.vaccineCode?.[0]?.text,
          nextDueDate: nextVaccineDate,
        })
      }
    }
  }, [recommendations])

  return (
    <>
      <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow mt-5 full-width">
        <div className="flex flex-wrap bg-[#f9fafb00] items-center gap-6 px-10 sm:flex-nowrap sm:px-10 lg:px-10 shadow">
          <div className="text-2xl font-semibold py-5">Contraindications</div>
        </div>

        {loading ? (
          <div className="flex justify-center py-4">
            <LoadingArrows />
          </div>
        ) : (
          <>
            {contraindicationInfo && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mx-7 px-10 py-10">
                <h1 className="col-span-1 md:col-span-2 font-bold text-2xl">
                  {contraindicationInfo?.vaccine}
                </h1>
                <div>
                  <p className="border-b py-1">
                    <span className="font-bold mr-4">
                      Contraindication Date:
                    </span>
                    <span className="text-gray-500">
                      {contraindicationInfo?.date}
                    </span>
                  </p>
                  <p className="py-1">
                    <span className="font-bold mr-4">
                      Next Vaccination Date:
                    </span>
                    <span className="text-gray-500">
                      {contraindicationInfo?.nextDueDate}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="font-bold">Contraindications</p>

                  <p className="text-gray-500 py-1">
                    {contraindicationInfo?.reason}
                  </p>
                </div>
              </div>
            )}

            {!contraindicationInfo && (
              <div className="text-center  mx-7 px-10 py-10">
                <p className="text-gray-500">
                  No Contraindication Details Found
                </p>
              </div>
            )}

            <div className="px-4 py-4 sm:px-6 flex justify-end">
              <button
                onClick={() => navigate(-1)}
                className="ml-4 flex-shrink-0 rounded-md outline bg-[#163C94] outline-[#163C94] px-10 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#163C94] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#163C94"
              >
                Back
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}
