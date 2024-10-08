import RenderActionButton from './RenderActionsButton'
import TextInput from '../forms/TextInput'
import SelectMenu from '../forms/SelectMenu'
import FormState from '../../utils/formState'

export default function FormTable({ headers, data, onActionBtn}) {

  const { formData, formErrors, handleChange } = FormState({
    dateReceived: '',
    origin: '',
    orderNumber: '',
  }, {
    dateReceived: { required: true },
    origin: { required: true },
    orderNumber: { required: true },
  })

  const handleActionBtn = ({ ...actionData }) => {
    onActionBtn && onActionBtn({ ...actionData });
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full border-collapse border border-slate-400">
              <thead>
                <tr>
                  {headers.map((header, index) => (
                    <th key={index} scope="col" className="border border-slate-300 py-3.5 pl-4 pr-3 text-center bg-slate-200 text-sm font-bold text-gray-900 uppercase sm:pl-0">
                      {header.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-center">
              {data.map((item, index) => (
                <tr key={index}>
                  {headers.map((header) => (
                    <td key={header.key} className={`border border-slate-300 whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 ${header.class}`}>
                      {(item[header.key].type === 'text' || item[header.key].type === 'date') ? (
                        <TextInput
                          inputType={item[header.key].type}
                          inputName={item[header.key].name}
                          inputId={item[header.key].name}
                          value={formData[item[header.key].name]}
                          error={formData[item[header.key].name]}
                          onInputChange={(value) => handleChange(item[header.key].name, value)}
                          inputPlaceholder={item[header.key].placeholder}/>
                      ) : header.key === 'actions' ? (
                        <RenderActionButton actions={item.actions} onBtnAction={handleActionBtn} />
                      ) : item[header.key].type === 'selectMenu' ? (
                        <SelectMenu
                          data={[]}
                          error={formData[item[header.key].name]}
                          value={formData[item[header.key].name] || item[header.key].name}
                          onInputChange={(value) => handleChange(item[header.key].name, value.name)}/>
                      ) : (
                        <></>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}