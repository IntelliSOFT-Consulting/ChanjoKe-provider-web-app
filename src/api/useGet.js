import { useState, useEffect } from 'react';

const useGet = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const abortController = new AbortController();

      try {
        setLoading(true);
        const response = await fetch(`https://chanjoke.intellisoftkenya.com/hapi/fhir/${url}`, {
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error('Could not fetch data for that resource');
        }

        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        if (err.name === 'AbortError') {
          // console.log('Fetch aborted');
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }

      return () => abortController.abort();
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

export default useGet;
