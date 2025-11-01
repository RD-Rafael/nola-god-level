import { useState, useEffect } from "react";
import { fetchMetricData } from "../api/dashboardApi";

export const useMetricData = (params) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const paramsString = JSON.stringify(params);

  useEffect(() => {
    if (!params) return;

    const controller = new AbortController();
    const signal = controller.signal;

    setIsLoading(true);
    setError(null);

    const getData = async () => {
      try {
        const result = await fetchMetricData(params, signal);
        setData(result);
      } catch (err) {
        if (err.name !== "CanceledError" && err.name !== "AbortError") {
          setError(err.message || "An error occurred");
        }
      } finally {
        // Only set loading to false if the request wasn't aborted
        if (!signal.aborted) setIsLoading(false);
      }
    };

    getData();

    // Cleanup old request
    return () => controller.abort();
  }, [paramsString]);

  return { data, isLoading, error };
};
