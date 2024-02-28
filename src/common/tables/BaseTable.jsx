export default function BaseTable(props) {
  return (
    <table className="min-w-full divide-gray-300 border border-slate-400">
      <tbody>
        {props.data.map((item) => (
          <tr key={item.value}>
            {/* <td className="whitespace-nowrap border border-slate-400 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
              {item.name}
            </td> */}
            <td className="whitespace-nowrap border border-slate-400 px-3 py-4 text-sm text-gray-500">{item.title}</td>
            <td className="whitespace-nowrap border border-slate-400 px-3 py-4 text-sm text-gray-500">{item.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}