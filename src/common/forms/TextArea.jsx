export default function TextArea(props) {
  return (
    <div>
      <label className='text-sm text-[#707070]'>
        { props.label }
        { props.required && <span className="text-red-500 ml-1 font-bold">*</span>}
      </label>

      <div className="relative mt-2 rounded-md shadow-sm mb-3">
        <textarea
          name={props.inputName}
          id={props.inputId}
          rows={props.rows}
          cols={props.cols}
          disabled={props.disabled}
          value={props.value}
          onChange={(e) => props.onInputChange(e.target.value)}
          className={
            props.leadingIcon
            ? 'block w-full ps-2 rounded-md border-0 py-3 pl-10 text-sm text-[#707070] ring-1 ring-inset ring-[#4E4E4E] placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#163C94]'
            : 'block w-full ps-2 rounded-md border-0 py-3 text-sm text-[#707070] ring-1 ring-inset ring-[#4E4E4E] placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#163C94]'
          }
          placeholder={props.inputPlaceholder}
        />
        
      </div>

      <small className='text-red-400'>{props.error}</small>
    </div>
  )
}