import { useState } from 'react'

const usePut = () => {
  const [data, setData] = useState(null)
  const [loading, setLoader] = useState(false)
  const [error, setError ] = useState(null)

  const SubmitUpdateForm = async (url, postData) => {

    const abortController = new AbortController()

    setLoader(true)

    try {
      const response = await fetch(`https://chanjoke.intellisoftkenya.com/hapi/fhir/${url}`, {
        signal: abortController.signal,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw Error('Could not fetch data for that resource');
      }

      const responseData = await response.json();

      setData(responseData);
      setLoader(false);
      setError(null);

      return responseData
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Fetch aborted');
      } else {
        setLoader(false);
        setError(err.message);
      }
    } finally {
      abortController.abort();
    }

  }

  return { data, loading, error, SubmitUpdateForm }
}

export default usePut