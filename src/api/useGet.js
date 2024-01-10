import { useState, useEffect } from 'react'

const useGet = (url) => {
  const [data, setData] = useState(null)
  const [loading, setLoader] = useState(false)
  const [error, setError ] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoader(true)
      const data = await fetch(`https://chanjoke.intellisoftkenya.com/hapi/fhir/${url}`)
      const res = await data.json()
      setLoader(false)
      setData(res.entry)
      setError(null)

      console.log({ res })
    }

    fetchData().catch((error) => {
      setError(error.message)
      setLoader(false)
    })
  }, [url])

  return { data, loading, error }
}

export default useGet