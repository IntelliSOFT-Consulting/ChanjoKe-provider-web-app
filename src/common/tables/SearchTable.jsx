import RenderActionButton from './RenderActionsButton';
import Pagination from '../Pagination';

function getStatusColorClass(status) {
  switch (status) {
    case 'completed':
      return 'text-green-300';
    case 'upcoming':
      return 'text-amber-300';
    case 'contraindicated':
      return 'text-yellow-400';
    case 'missed':
      return 'text-red-300';
    default:
      return 'text-blue-gray'; // Default class when the status is not recognized
  }
}

export default function SearchTable({ headers, data, onActionBtn, onCheckbox, disabledChechboxes, link, updatePaginationURL }) {

  const handleActionBtn = (actionData, data) => {
    onActionBtn && onActionBtn(actionData, data);
  }

  const handleCheckbox = (value, item) => {
    onCheckbox && onCheckbox(value, item)
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
                    <th key={index} scope="col" className="border border-slate-300 py-3.5 pl-4 text-left pr-3 bg-slate-200 text-sm font-bold text-gray-900">
                      {header.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
              {data.map((item, index) => (
                <tr key={index}>
                  {headers.map((header) => (
                    <td key={header.key} className={`border border-slate-300 whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-900 ${header.class} ${header.key === 'status' && getStatusColorClass(item[header.key])}`}>
                      {header.key === 'checkbox' ? (
                        <input
                          type="checkbox"
                          disabled={item.status !== 'upcoming'}
                          checked={item.status === 'completed'}
                          className={item.status === 'completed' ? 'bg-slate-300' : ''}
                          onChange={(e) => handleCheckbox(e.target.value, item)}
                        />
                      ) : header.key === 'actions' ? (
                        <RenderActionButton actions={item.actions} onBtnAction={handleActionBtn} data={item} />
                      ) : (
                        item[header.key]
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              </tbody>
            </table>

            <Pagination link={link} updateURL={updatePaginationURL} />
          </div>
        </div>
      </div>
    </div>
  )
}