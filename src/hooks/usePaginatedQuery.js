import { useState } from 'react'
import { getOffset } from '../utils/methods'

export default function usePaginatedQuery(props) {
  const [currentPage, setCurrentPage] = useState(1)
  // eslint-disable-next-line no-unused-vars
  const [pageSize, setPageSize] = useState(props?.pageSize || 12)

  const handlePageChange = (page, func) => {
    setCurrentPage(page)
    const offset = getOffset(page, pageSize)
    func(offset)
  }

  return { currentPage, pageSize, handlePageChange }
}
