import RenderActionButton from './RenderActionsButton';

function getStatusColorClass(status) {
  switch (status) {
    case 'Administered':
      return 'text-green-300';
    case 'Due':
      return 'text-blue-300';
      case 'Contraindicated':
      return 'text-yellow-400';
    case 'Missed':
      return 'text-red-300';
    default:
      return 'text-blue-gray'; // Default class when the status is not recognized
  }
}

export default function SearchTable({ headers, data, onActionBtn}) {

  const handleActionBtn = (actionData, data) => {
    onActionBtn && onActionBtn(actionData, data);
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
                    <td key={header.key} className={`border border-slate-300 whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 ${header.class} ${header.key === 'status' && getStatusColorClass(item[header.key])}`}>
                      {header.key === 'checkbox' ? (
                        <input
                          type="checkbox"
                          checked={item.selected}
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
          </div>
        </div>
      </div>
    </div>
  )
}