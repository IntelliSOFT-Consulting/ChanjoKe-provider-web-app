import SelectDialog from "../common/dialog/SelectDialog";
import BaseTabs from "../common/tabs/BaseTabs";
import SearchTable from "../common/tables/SearchTable";
import { useEffect, useState } from "react";
import useGet from "../api/useGet";
import { useParams, useNavigate } from "react-router-dom";
import calculateAge from "../utils/calculateAge";
import LoadingArrows from "../common/spinners/LoadingArrows";
import OptionsDialog from "../common/dialog/OptionsDialog";

export default function ClientDetailsView() {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [patientData, setPatientData] = useState({})

  const { clientID } = useParams()
  const navigate = useNavigate()
  const { data, loading, error } = useGet(`Patient/${clientID}`)

  useEffect(() => {
    setPatientData(data)
  }, [data])
  

  const handleDialogClose = (confirmed) => {
    setDialogOpen(false);
  };

  const stats = [
    { dob: patientData?.birthDate, age: calculateAge(patientData?.birthDate), gender: patientData?.gender }
  ]

  const tHeaders = [
    {title: 'D.O.B', class: '', key: 'dob'},
    {title: 'Age', class: '', key: 'age'},
    {title: 'Gender', class: '', key: 'gender'},
  ]

  return (
    <>

    <SelectDialog
      open={isDialogOpen}
      title='Info'
      description='Select Record to update'
      btnOne={{
        text: 'Client Record',
        url: `/update-client-history/${patientData?.id}`
      }}
      btnTwo={{
        text: 'Vaccine Details',
        url: '/update-vaccine-history'
      }}
      onClose={handleDialogClose} />
    
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow mt-5">
      <div className="flex justify-between px-4 text-2xl py-5 sm:px-6">
        <div className="text-3xl">
          Client Details
        </div>
        <div className="right-0">
          <button
            onClick={() => navigate(`/client-records/${patientData?.id}`)}
            className="ml-4 flex-shrink-0 rounded-md border border-[#163C94] outline outline-[#163C94] px-5 py-2 text-sm font-semibold text-[#163C94] shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#163C94]">
            View Client Details
          </button>
          <button
            onClick={() => setDialogOpen(true)}
            className="ml-4 flex-shrink-0 rounded-md bg-[#163C94] border border-[#163C94] outline outline-[#163C94] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#163C94] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#163C94]">
            Update personal details
          </button>
        </div>
      </div>
      
      <div className="px-4 py-5 sm:p-6">
        <div className="container grid grid-cols-2 gap-10">
          <div>
            {!patientData?.name &&  <div className="my-10 mx-auto flex justify-center"><LoadingArrows /></div>}
            {patientData?.name && <>
              <p className="text-3xl font-bold ml-8">
                {`${patientData?.name?.[0]?.family || ''}  ${patientData?.name?.[0]?.given[0] || ''}  `}
              </p>

              <SearchTable
                headers={tHeaders}
                data={stats} />
            </>}
          </div>
          <div>
          </div>
        </div>
      </div>

    </div>

    <div className="mt-10">
      <BaseTabs />
    </div>

    </>
  );
}