export default function SearchTable() {

  const patients = [
    { name: 'Lindsay Walton', id: '12983476', phone: '0700 000000', action: 'View' },
    { name: 'Lindsay Walton', id: '12983476', phone: '0700 000000', action: 'View' },
  ]

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300 border border-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-0">
                    Client Name
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                    ID Number
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                    Phone Number
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-center">
                {patients.map((patient) => (
                  <tr key={patient}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-0">
                      {patient.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{patient.id}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{patient.phone}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{patient.action}</td>
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