import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { fetchApi } from "@/lib/api";

const GasIssueStoreContext = createContext(null);

export function GasIssueStoreProvider({ children }) {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const loadRecords = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetchApi("/issues/", { raw: true });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result?.success || !Array.isArray(result.data)) {
        throw new Error(result?.message || "Failed to load issue records");
      }
      setRecords(result.data);
      return result.data;
    } finally {
      setIsLoading(false);
      setHasLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadRecords().catch(() => {
      setRecords([]);
    });
  }, [loadRecords]);

  const createRecord = useCallback(async (payload) => {
    const requestBody = {
      tankId: payload.tankId,
      gasType: payload.gasType,
      date: payload.date,
      quantity: Number(payload.quantity),
      batchId: payload.batchId,
      status: payload.status ?? "draft",
    };

    const response = await fetchApi("/issues/", {
      raw: true,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result?.success || !result.data) {
      throw new Error(result?.message || "Failed to create issue record");
    }
    setRecords((prev) => [result.data, ...prev]);
    loadRecords().catch(() => {});
    return result.data;
  }, [loadRecords]);

  const updateRecord = useCallback(async (id, payload) => {
    const requestBody = {
      tankId: payload.tankId,
      gasType: payload.gasType,
      date: payload.date,
      quantity: Number(payload.quantity),
      batchId: payload.batchId,
      status: payload.status ?? "draft",
    };

    const response = await fetchApi(`/issues/${id}`, {
      raw: true,
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result?.success || !result.data) {
      throw new Error(result?.message || "Failed to update issue record");
    }
    setRecords((prev) =>
      prev.map((record) => (record.id === id ? result.data : record)),
    );
    loadRecords().catch(() => {});
    return result.data;
  }, [loadRecords]);

  const value = useMemo(
    () => ({
      records,
      isLoading,
      hasLoaded,
      loadRecords,
      createRecord,
      updateRecord,
    }),
    [records, isLoading, hasLoaded, loadRecords, createRecord, updateRecord],
  );

  return (
    <GasIssueStoreContext.Provider value={value}>
      {children}
    </GasIssueStoreContext.Provider>
  );
}

export function useGasIssueStore() {
  const context = useContext(GasIssueStoreContext);
  if (!context) {
    throw new Error("useGasIssueStore must be used within GasIssueStoreProvider");
  }
  return context;
}
