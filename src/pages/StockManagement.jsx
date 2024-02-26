import IssueStockLogo from '../common/icons/issueStockLogo'
import OrderStockLogo from '../common/icons/orderStockLogo'
import ReceiveStockLogo from '../common/icons/receiveStockLogo'
import StockLedgerLogo from '../common/icons/stockLedgerLogo'
import LoadingArrows from "../common/spinners/LoadingArrows"
import SearchTable from "../common/tables/SearchTable"
import TextInput from "../common/forms/TextInput"
import FormState from '../utils/formState'
import { Link } from 'react-router-dom'

export default function StockManagement() {

  const iconComponents = {
    IssueStockLogo,
    OrderStockLogo,
    ReceiveStockLogo,
    StockLedgerLogo,
  };
  
  const stats = [
    { name: 'Receive Stock', icon: 'ReceiveStockLogo', href: 'search/searchClient' },
    { name: 'Order Stock', icon: 'OrderStockLogo', href: 'register-client' },
    { name: 'Issue Stock', icon: 'IssueStockLogo', href: 'search/updateClient' },
    { name: 'Stock Ledger', icon: 'StockLedgerLogo', href: 'search/administerVaccine' },
  ]

  const tHeaders = [
    {title: 'Name', class: '', key: 'name'},
    {title: 'Batch Number', class: '', key: 'batchNumber'},
    {title: 'Quantity', class: '', key: 'quantity'},
    {title: 'Actions', class: '', key: 'actions'},
  ]

  const defaultAction = {
    title: 'view',
    url: '/',
  }

  const results = [
    { id: '', name: 'BCG', batchNumber: 'AG8998HH88', quantity: '30', actions: [defaultAction] },
    { id: '', name: 'OPV 1', batchNumber: 'UU8090DDD4', quantity: '20', actions: [defaultAction] },
    { id: '', name: 'BCG', batchNumber: '77TYD66767', quantity: '30', actions: [defaultAction] },
  ]

  const { formData, formErrors, handleChange} = FormState({
    searchInput: '',
  })

  const handleAction = ({ ...onActionBtn }) => {
    console.log({ onActionBtn })
    // if (onActionBtn.type === 'modal') {
    //   setIsDialogOpen(true)
    // }
  }

  const SubmitDetails = () => {
    // Search for Vaccine using name/batch number
  }

  return (
    <div>
      <dl className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10 grid grid-cols-1 gap-5 sm:grid-cols-4 p-6 rounded-lg shadow-xl border bg-white">
        {stats.map((item) => {
          const IconComponent = iconComponents[item.icon];
          return (
            <Link to={item.href} key={item.name} className="overflow-hidden grid justify-items-center text-center rounded-lg bg-white px-4 py-5 shadow sm:p-6 border border-[#5370B0]">
              <IconComponent height="120" width="120" fillColor="#163C94" className="h-12 block mx-auto mb-5" />
              <dt className="truncate text-xl mt-5 font-medium text-gray-500">{item.name}</dt>
            </Link>
          );
        })}
      </dl>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow mt-10">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-5 gap-4 mx-10">
            <div className="col-span-3">
              <div className="px-4 text-2xl font-semibold py-5 sm:px-6">
                Current Stock
              </div>
            </div>
            <div className='col-span-2'>
              <TextInput
                inputType="text"
                inputName="searchInput"
                inputId="searchInput"
                value={formData.searchInput}
                onInputChange={(value) => {
                  handleChange('searchInput', value)
                  SubmitDetails()
                }}
                inputPlaceholder="Search"/>
            </div>
          </div>

          {/* {error && <div className="my-10 text-center">{error}</div> }
          {loading && <div className="my-10 mx-auto flex justify-center"><LoadingArrows /></div>}
          {!data && !loading && <div className="my-10 text-center">No records to view</div>} */}
          {results &&
            <SearchTable
              headers={tHeaders}
              data={results}
              onActionBtn={handleAction}/>
          }
        </div>
      </div>
    </div>
  );
}