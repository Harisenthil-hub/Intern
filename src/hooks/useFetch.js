// src/hooks/useFetch.js
import { useState, useEffect } from "react";

export function useFetch(apiFn) {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await apiFn();
      setData(result);
    } catch (err) {
      setError("Failed to load records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  return { data, setData, loading, error, refetch: fetchData };
}
