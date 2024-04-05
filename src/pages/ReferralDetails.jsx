import { useNavigate, useParams } from 'react-router-dom'
import BaseTable from '../common/tables/BaseTable'
import ConvertObjectToArray from '../components/RegisterClient/convertObjectToArray'
import { useApiRequest } from '../api/useApiRequest'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

export default function ReferralDetails() {

  const navigate = useNavigate()

  const chpDetails = ConvertObjectToArray({
    'Referring CHP': 'James Kamau',
    'Vaccine Referred': 'OPV II',
    'Details': 'Provide a small section for detail on type of treatment'
  })

  const scheduleDetails = ConvertObjectToArray({
    'Date of Referral': '02/05/2023',
    'Scheduled Vaccine Date': '02/05/2023',
    'Date Vaccine Administered': '-',
    'Health Facility Referred to': 'Facility XYZ'
  })

  return (
    <>
      <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow mt-5 full-width">
        <div className="flex flex-wrap bg-[#f9fafb00] items-center gap-6 px-10 sm:flex-nowrap sm:px-10 lg:px-10 shadow">
          <div className="text-2xl font-semibold py-5">
            Referral Details
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10 mx-7 px-10 py-10">
          <div>

            <BaseTable data={chpDetails} />

          </div>
          <div>

            <BaseTable data={scheduleDetails} />
          </div>
        </div>

        <div className="px-4 py-4 sm:px-6 flex justify-end">
          <button
            onClick={() => navigate(-1)}
            className="ml-4 flex-shrink-0 rounded-md outline outline-[#163C94] px-10 py-2 text-sm font-semibold text-[#163C94] shadow-sm hover:bg-[#163C94] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Back
          </button>

          <button
            className="ml-4 flex-shrink-0 rounded-md outline bg-[#163C94] outline-[#163C94] px-10 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#163C94] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#163C94">
            Administer
          </button>
          
        </div>
        
      </div>
    </>
  )
}