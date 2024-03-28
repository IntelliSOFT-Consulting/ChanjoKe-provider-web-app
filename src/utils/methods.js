export const debounce = (func, delay) => {
  let debounceTimer
  return function () {
    const context = this
    const args = arguments
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => func.apply(context, args), delay)
  }
}

export const getOffset = (page, pageSize=12)=> {
  return page === 1 ? 0 : (page - 1) * pageSize
}