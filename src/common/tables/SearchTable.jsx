import RenderActionButton from './RenderActionsButton';

export default function SearchTable(props) {

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300 border border-gray-300">
              <thead>
                <tr>
                  {props.headers.map((header, index) => (
                    <th key={index} scope="col" className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-0">
                      {header.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-center">
              {props.data.map((item, index) => (
                <tr key={index}>
                  {props.headers.map((header) => (
                    <td key={header.key} className={`whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 ${header.class}`}>
                      {header.key === 'actions' ? (
                        RenderActionButton(item)
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