export default function Pagination({ link, updateURL }) {

  const next = link.find((item) => item.relation === 'next')
  const previous = link.find((item) => item.relation === 'previous')

  return (
    <nav
      className="flex items-center justify-between bg-white px-5 py-3 sm:px-6 mx-3 mt-3"
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