import { Link, useNavigate } from 'react-router-dom'
import BaseTable from '../common/tables/BaseTable'
import Table from '../components/DataTable'
import { Button } from 'antd'
import ConvertObjectToArray from '../components/RegisterClient/convertObjectToArray'
import { useEffect, useState } from 'react'

export default function VaccinationDetails() {

  const [doseInfo, setDoseInfo] = useState([])
  const [clientInfo, setClientInfo] = useState([])

  const navigate = useNavigate()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const doseInformation = {
    'Dose administered': '1',
    'Date of last dose': 'Jan 1 2020',
    'Days since last dose': '23',
    'Months since last dose': '44',
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const clientInformation = {
    'Years since last dose': '23',
    'Age at last dose': '22',
    'Client has completed vaccine primary series': 'YES',
  }

  const columns = [
    {
      title: 'Symptoms',
      dataIndex: 'symptomName',
      key: 'symptomName',
    },
    {
      title: 'Date',
      dataIndex: 'occurenceDate',
      key: 'occurenceDate',
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (text, record) => (
        <Button
          onClick={() => {
            // setDialogOpen(true)
            // setSharedData(record)
          }}
          type="link"
          className="font-bold text=[#173C94]"
        >
          View
        </Button>
      ),
    },
  ]

  const aefis = [
    { symptomName: 'High Fever', occurenceDate: 'Jan 1 2020', actions: [{ title: 'view', url: '#'}]},
    { symptomName: 'Nausea', occurenceDate: 'Jan 1 2020', actions: [{ title: 'view', url: '#'}]},
    { symptomName: 'Migranes', occurenceDate: 'Jan 1 2020', actions: [{ title: 'view', url: '#'}]}
  ]

  useEffect(() => {
    setDoseInfo(ConvertObjectToArray(doseInformation))
    setClientInfo(ConvertObjectToArray(clientInformation))
  }, [clientInformation, doseInformation])

  return (
    <>
      <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow mt-5 full-width">
        <div className="flex flex-wrap bg-[#f9fafb00] items-center gap-6 rounded-lg px-10 sm:flex-nowrap sm:px-10 lg:px-10 shadow">
          <div className="text-2xl font-semibold py-5">
            Polio
          </div>
          <Link
            to="/view-contraindication/fh8hoi3h8348jj"
            className="ml-auto flex items-center gap-x-1 rounded-md bg-[#163C94] px-10 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Containdications
          </Link>
        </div>

        <div className="px-10 text-2xl font-semibold bg-gray-200 py-5 sm:px-10">
          Biovalent Oral Polio (bOPV)
        </div>

        <div className="grid grid-cols-2 gap-10 mx-7 px-10 py-10">
          <div>

            <BaseTable data={doseInfo} />

          </div>
          <div>

            <BaseTable data={clientInfo} />
          </div>
        </div>

        <div className="px-10 text-1xl font-semibold bg-gray-200 py-5 sm:px-10">
          AEFI
        </div>

        <div className="px-10 py-5">
          <Table
            dataSource={aefis}
            columns={columns}
            pagination={false}
            size="small"/>
        </div>

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