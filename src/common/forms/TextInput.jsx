export default function TextInput(props) {
  return (
    <div>
      <label className='text-sm text-[#707070]'>
        { props.label }
      </label>

      <div className="relative mt-2 rounded-md shadow-sm mb-4">
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
          className={
            props.leadingIcon
            ? 'block w-full rounded-md border-0 py-3 pl-10 text-sm text-[#707070] ring-1 ring-inset ring-[#4E4E4E] placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600'
            : 'block w-full rounded-md border-0 py-3 text-sm text-[#707070] ring-1 ring-inset ring-[#4E4E4E] placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600'
          }
          placeholder={props.inputPlaceholder}
        />
      </div>
    </div>
  )
}