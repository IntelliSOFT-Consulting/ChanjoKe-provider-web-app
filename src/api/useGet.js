import { useState, useEffect } from 'react'

const useGet = (url) => {
  const [data, setData] = useState(null)
  const [loading, setLoader] = useState(false)
  const [error, setError ] = useState(null)

  useEffect(() => {

    const abortController = new AbortController()

    fetch(`https://chanjoke.intellisoftkenya.com/hapi/fhir/${url}`, { signal: abortController.signal })
      .then((res) => {
        if (!res.ok) {
          throw Error('could not fetch data for that resource')
        }
        return res.json()
      })
      .then((data) => {
        console.log({ data })
        if (data) {
          setData(data.entry)
          setLoader(false)
          setError(false)
        }
      })
      .catch((err) => {
        if (err.name === 'AbortError') {
          console.log('fetch aborted')
        } else {
          setLoader(false)
          setError(err.message)
        }
      })

    return () => abortController.abort()

  }, [url])

  return { data, loading, error }
}

export default useGet