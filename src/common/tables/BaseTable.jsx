export default function BaseTable(props) {
  return (
    <table className="min-w-full divide-y divide-gray-300">
      <tbody className="divide-y divide-gray-200">
        {props.data.map((item) => (
          <tr key={item.email}>
            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
              {item.name}
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.title}</td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}