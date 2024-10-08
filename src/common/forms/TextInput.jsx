export default function TextInput(props) {
  return (
    <div>
      <label className='font-semibold'>
        { props.label }
        { props.required && <span className="text-red-500 ml-1 font-bold">*</span>}
      </label>

      <div className={`relative rounded-md shadow-sm mb-3 ${props.label ? 'mt-2' : 'mt-9'}`}>
        {
          props.leadingIcon ? (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="material-symbols-outlined text-[#707070]">
              { props.leadingIconName }
            </span>
          </div>
          ) : ''
        }
        <input
          type={props.inputType}
          name={props.inputName}
          id={props.inputId}
          disabled={props.disabled}
          min={props.min}
          max={props.max}
          autoComplete="off"
          value={props.value}
          {...props.inputType === 'date' && props.max && { max: new Date().toISOString().split('T')[0] }}
          onChange={(e) => props.onInputChange(e.target.value)}
          className={
            `${props.leadingIcon
            ? 'block w-full rounded-md border-0 py-3 pl-10 text-sm text-[#707070] ring-1 ring-gray-300 placeholder:text-gray-400'
            : 'block w-full rounded-md border-0 py-3 text-sm text-[#707070] ring-1 ring-gray-300 placeholder:text-gray-400'}
            
            ${props.disabled ? 'bg-gray-300' : ''}
            `
          }
          placeholder={props.inputPlaceholder}
        />

        {props.addOn && 
          <div className="absolute inset-y-0 right-0 flex items-center">
            <label htmlFor="currency" className="sr-only">
              {props.addOnTitle}
            </label>
            <select
              id="currency"
              name="currency"
              className="h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-7 text-gray-900 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
            >
              <option>Kgs</option>
              <option>Grams</option>
            </select>
          </div>
        }
        
      </div>

      <small className='text-red-400'>{props.error}</small>
    </div>
  )
}