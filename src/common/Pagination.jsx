import { useEffect, useState } from "react"

export default function Pagination({ link, updateURL }) {

  const [next, setNext] = useState('')
  const [previous, setPrevious] = useState('')

  useEffect(() => {
    if (Array.isArray(link) && link.length > 0) {
      setNext(link.find((item) => item.relation === 'next'))
      setPrevious(link.find((item) => item.relation === 'previous'))
    }
  }, [link])

  return (
    <nav
      className="flex items-center justify-between bg-white py-3 mt-3"
      aria-label="Pagination">
      <div className="hidden sm:block">
      </div>
      <div className="flex flex-1 justify-between sm:justify-end">
        {previous && 
          <a
            href="#"
            onClick={() => updateURL(previous?.url)}
            className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0">
            Previous
          </a>
        }

        {next && 
          <a
            onClick={() => updateURL(next?.url)}
            className="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0">
            Next
          </a>
        }

      </div>
    </nav>
  )
}