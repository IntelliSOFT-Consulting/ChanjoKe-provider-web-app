export default function RadioGroup(props) {
  return (
    <div>
      <p className="text-sm text-gray-500">
        { props.label }
      </p>
      <fieldset className="mt-6 mb-6">
        <legend className="sr-only">{ props.label }</legend>
        <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
          {props.data.map((item) => (
            <div key={item.id} className="flex items-center">
              <input
                id={item.id}
                name="notification-method"
                type="radio"
                className="h-4 w-4 border-gray-300 text-[#163C94] focus:ring-[#163C94]"
              />
              <label htmlFor={item.id} className="ml-3 block text-sm font-medium leading-6 text-gray-900">
                {item.title}
              </label>
            </div>
          ))}
        </div>
      </fieldset>
    </div>
  )
}