import { useState, useEffect } from 'react';
import { fetchStoreNames } from '../api/dashboardApi';

export const useStoreNames = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchStoreNames(); // Call the decoupled API function
        setData(result);
      } catch (err) {
        setError(err.message || "An error occurred");
        console.log(err)
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, []);

  // Returns all the necessary state variables
  return { data, isLoading, error };
};