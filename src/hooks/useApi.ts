import { useState, useEffect } from 'react';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  isFromCache: boolean;
}

export function useApi<T>(url: string) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: true,
    error: null,
    isFromCache: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        setState({
          data: data,
          loading: false,
          error: null,
          isFromCache: response.headers.get('x-from-cache') === 'true'
        });
      } catch (error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error : new Error('An unknown error occurred')
        }));
      }
    };

    fetchData();
  }, [url]);

  return state;
}