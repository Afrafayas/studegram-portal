import { useEffect, useState } from 'react';
import API from '../api/axios';

export default function useApiCollection(endpoint) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    API.get(endpoint, { signal: controller.signal }).then(response => {
      if (!response.data?.success || !Array.isArray(response.data.data)) {
        throw new Error(response.data?.message || 'Unable to load records.');
      }
      setRecords(response.data.data);
    }).catch(err => {
      if (!controller.signal.aborted) {
        setRecords([]);
        setError(err.response?.data?.message || err.message || 'Unable to load records.');
      }
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false);
    });
    return () => controller.abort();
  }, [endpoint]);
  return { records, loading, error };
}
