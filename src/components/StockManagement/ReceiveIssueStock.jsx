import TextInput from '../../common/forms/TextInput'
import SelectMenu from '../../common/forms/SelectMenu'
import FormState from '../../utils/formState'
import FormTable from '../../common/tables/FormTable'

export default function ReceiveIssueStock({ status }) {
  const { formData, formErrors, handleChange } = FormState({
    dateReceived: '',
    origin: '',
    orderNumber: '',
  }, {
    dateReceived: { required: true },
    origin: { required: true },
    orderNumber: { required: true },
  })

  const defaultAction = {
    title: 'Remove',
    url: '/',
  }

  const tHeaders = [
    {title: 'Vaccine/Diluents', class: '', key: 'vaccine'},
    {title: 'Batch Number', class: '', key: 'batchNumber'},
    {title: 'Expiry Date', class: '', key: 'expiryDate'},
    {title: 'Stock Quantity', class: '', key: 'stockQuantity'},
    {title: 'Quantity', class: '', key: 'quantity'},
    {title: 'VVM Status', class: '', key: 'vvmStatus'},
    {title: 'Manufacturer Details', class: '', key: 'manufacturerDetails'},
    {title: 'Action', class: '', key: 'actions'},
  ]

  const results = [
    {
      vaccine: {
        type: 'selectMenu',
        name: 'vaccine',
      },
      batchNumber: {
        type: 'selectMenu',
        name: 'batchNumber',
      },
      expiryDate: {
        type: 'date',
        name: 'expiryDate',
      },
      stockQuantity: {
        type: 'text',
        name: 'stockQuantity',
      },
      quantity: {
        type: 'text',
        name: 'quantity',
      },
      vvmStatus: {
        type: 'text',
        name: 'stockQuantity',
      },
      manufacturerDetails: {
        type: 'text',
        name: 'manufacturerDetails',
      },
      actions: [defaultAction]
    }, 
  ]

  return (
    <>
      <div className="divide-y divide-gray-200 overflow-visible rounded-lg bg-white shadow mt-5">
        <div className="px-4 text-2xl font-normal py-5 sm:px-6" style={{ textTransform: 'capitalize' }}>
          { status } Stock
        </div>

        {status === 'receive' && <>
          <div className="grid grid-cols-3 gap-4 px-10 pt-5">
            <div>
              <TextInput
                inputType="date"
                inputName="dateReceived"
                inputId="dateReceived"
                label="Date Received"
                required={true}
                value={formData.dateReceived}
                error={formErrors.dateReceived}
                onInputChange={(value) => handleChange('dateReceived', value)}
                inputPlaceholder="Date Received"/>
            </div>
            <div>
              <TextInput
                inputType="text"
                inputName="origin"
                inputId="origin"
                label="Origin"
                required={true}
                value={formData.origin}
                error={formErrors.origin}
                onInputChange={(value) => handleChange('origin', value)}
                inputPlaceholder="Origin"/>
            </div>
            <div>
              <SelectMenu
                label="Order Number"
                required={true}
                data={[{name: '88999JJK-990'}, {name: '778839K-998'}]}
                error={formErrors.orderNumber}
                value={formData.orderNumber || 'Order Number'}
                onInputChange={(value) => handleChange('orderNumber', value.name)}/>
            </div>
          </div>

          <FormTable
            headers={tHeaders}
            data={results}/>

            <div className="grid grid-cols-5 gap-4 py-5 justify-stretch mt-5">
              <div className='col-span-4'></div>
              <button
                className="flex-shrink-0 rounded-md bg-[#4E8D6E] border border-[#4E8D6E] outline outline-[#4E8D6E] px-5 mx-7 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#4E8D6E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4E8D6E]">
                Add
              </button>
            </div>

            <div className="px-4 py-4 sm:px-6 flex justify-end">
              <button
                className="ml-4 flex-shrink-0 rounded-md outline outline-[#163C94] px-10 py-2 text-sm font-semibold text-[#163C94] shadow-sm hover:bg-[#163C94] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Cancel
              </button>
              <button
                className='bg-[#163C94] border-[#163C94] outline-[#163C94] hover:bg-[#163C94] focus-visible:outline-[#163C94] ml-4 flex-shrink-0 rounded-md border outline  px-10 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'>
                Save
              </button>
            </div>

        </>}
      </div>
    </>
  )
}