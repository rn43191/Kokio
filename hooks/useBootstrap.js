import { useState, useEffect } from "react";
import { fetchBootstrapDataAPI } from "@/services/general";
import AppBootstrap from "@/utils/appBootstrap";

export default function useBootstrap() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBootstrapData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchBootstrapDataAPI();
      const { countries, regions } = response?.data || {};
      new AppBootstrap({ countries, regions });
    } catch (err) {
      console.error("Failed to fetch bootstrap data:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch bootstrap data on mount
  useEffect(() => {
    fetchBootstrapData();
  }, []);

  return {
    isLoading,
    error,
    refresh: fetchBootstrapData,
  };
}
