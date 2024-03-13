function convertUnderscoresAndCapitalize(inputString) {
  if (inputString) {
    const stringWithSpaces = inputString.replace(/_/g, ' ');
    const capitalizedString =
      stringWithSpaces.charAt(0).toUpperCase() + stringWithSpaces.slice(1);

    return capitalizedString;
  } else {
    return ''
  }
}

export default function BaseTable(props) {
  return (
    <table className="min-w-full divide-gray-300 border border-slate-400">
      <tbody>
        {props.data.map((item) => (
          <tr key={item.title}>
            <td className="whitespace-nowrap border border-slate-400 px-3 py-4 text-sm text-gray-900 font-bold">{item.title}</td>
            <td className="whitespace-nowrap border border-slate-400 px-3 py-4 text-sm text-gray-900">{convertUnderscoresAndCapitalize(item.value)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}