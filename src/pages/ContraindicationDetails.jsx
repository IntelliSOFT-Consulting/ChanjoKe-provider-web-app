import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import { Button } from 'antd'
import useVaccination from '../hooks/useVaccination'
import LoadingArrows from '../common/spinners/LoadingArrows'

const ContraindicationDetails = ({ notAdministered }) => {
  const [contraindications, setContraindications] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { contraindicationID } = useParams()
  const {
    immunization,
    getImmunization,
    getImmunizations,
    getRecommendations,
    recommendations,
  } = useVaccination()

  useEffect(() => {
    const fetchData = async () => {
      await getImmunization(contraindicationID)
    }
    fetchData()
  }, [contraindicationID])

  useEffect(() => {
    if (immunization) {
      const patientId = immunization?.patient?.reference?.split('/')[1]
      getRecommendations(patientId)
    }
  }, [immunization])

  useEffect(() => {
    const fetchContraindications = async () => {
      if (recommendations && immunization) {
        const patientId = immunization?.patient?.reference?.split('/')[1]
        const immunizations = await getImmunizations(
          patientId,
          `status=not-done&vaccine-code=${immunization.vaccineCode.coding[0].code}`
        )

        if (immunizations?.length) {
          const filteredImmunizations = immunizations.filter((imm) =>
            notAdministered
              ? imm.reasonCode?.[0].text === 'Not Administered'
              : imm.reasonCode?.[0].text === 'Rescheduled'
          )
          setContraindications(formatContraindications(filteredImmunizations))
        } else {
          setContraindications([])
        }
        setLoading(false)
      }
    }
    fetchContraindications()
  }, [recommendations, immunization, notAdministered])

  const formatContraindications = (immunizations) => {
    return immunizations?.map((imm) => {
      const status =
        imm?.reasonCode?.[0]?.text === 'Not Administered' &&
        imm?.statusReason?.text === 'Contraindication'
          ? 'Contraindication'
          : 'Not Done'

      const disease = recommendations?.recommendation?.find(
        (vaccine) =>
          vaccine.vaccineCode?.[0]?.coding[0].display ===
          imm.vaccineCode?.coding[0].display
      )

      const nextVaccinationDate = disease?.dateCriterion.find(
        (date) => date.code.coding[0].code === 'Earliest-date-to-administer'
      ).value

      return {
        vaccine: imm?.vaccineCode?.text,
        date: dayjs(imm?.occurrenceDateTime).format('DD-MM-YYYY'),
        status,
        statusReason: imm?.statusReason?.text,
        disease: disease?.targetDisease?.text,
        nextVaccinationDate: dayjs(nextVaccinationDate).format('DD-MM-YYYY'),
        doseNumber: imm?.doseQuantity?.value,
        details: imm?.reasonCode?.find(
          (item) => item?.coding[0].code === 'details'
        )?.text,
      }
    })
  }

  const renderContraindicationCard = (contraindication, index) => (
    <div key={index} className="w-full relative border p-2 rounded-md">
      <div
        className={`absolute right-0 top-2 inline-flex items-center rounded-l-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
          contraindication.status === 'Not Done'
            ? 'bg-red-50 text-red-700 ring-red-600/10'
            : 'bg-yellow-50 text-yellow-700 ring-yellow-600/10'
        }`}
      >
        {contraindication.status}
      </div>
      <div className="w-full border-b py-1">
        <h3 className="font-bold">{`${contraindication.vaccine} (${contraindication.disease})`}</h3>
        <p className="text-sm text-gray-500">
          {`Dose ${contraindication.doseNumber}`}
        </p>
      </div>
      <div className="py-2">
        <p className="text-sm text-black">
          <span className="font-semibold">Recorded On: </span>{' '}
          {contraindication.date}
        </p>
        <p className="text-sm text-black">
          <span className="font-semibold">Next Vaccination Date: </span>{' '}
          {contraindication.nextVaccinationDate}
        </p>
        <p className="text-sm text-black">
          <span className="font-semibold">Reason: </span>{' '}
          {contraindication.statusReason}
        </p>
        {contraindication.details && (
          <p className="text-sm text-black">
            <span className="font-semibold">Details: </span>{' '}
            {contraindication.details}
          </p>
        )}
      </div>
    </div>
  )

  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow mt-5 full-width">
      <div className="flex flex-wrap bg-[#f9fafb00] items-center gap-6 px-10 sm:flex-nowrap sm:px-10 lg:px-10 shadow">
        <div className="text-2xl font-semibold py-5">
          {notAdministered &&
          immunization?.statusReason?.text === 'Contraindication'
            ? 'Contraindications'
            : 'Not Administered'}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-4">
          <LoadingArrows />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 py-4 sm:px-6">
            {contraindications.map(renderContraindicationCard)}
          </div>

          {contraindications.length === 0 && (
            <div className="text-center mx-7 px-10 py-10">
              <p className="text-gray-500">
                {notAdministered
                  ? 'No Unadministered Vaccines Recorded'
                  : 'No Contraindications'}
              </p>
            </div>
          )}

          <div className="px-4 py-4 sm:px-6 flex justify-end">
            <Button type="primary" onClick={() => navigate(-1)}>
              Back
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

export default ContraindicationDetails
