import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { fetchApi } from "@/lib/api";

const ProcurementStoreContext = createContext(null);

export function ProcurementStoreProvider({ children }) {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const loadRecords = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetchApi("/procurements/", { raw: true });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result?.success || !Array.isArray(result.data)) {
        throw new Error(result?.message || "Failed to load procurement records");
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
  }, []);

  const createRecord = useCallback(async (payload) => {
    const requestBody = {
      vendorName: payload.vendorName,
      date: payload.date,
      gasType: payload.gasType,
      quantity: Number(payload.quantity),
      tankId: payload.tankId,
      transportDetails: payload.transportDetails || null,
      status: payload.status ?? "draft",
    };

    const response = await fetchApi("/procurements/", {
      raw: true,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result?.success || !result.data) {
      throw new Error(result?.message || "Failed to create procurement record");
    }
    setRecords((prev) => [result.data, ...prev]);
    loadRecords().catch(() => {});
    return result.data;
  }, [loadRecords]);

  const updateRecord = useCallback(async (id, payload) => {
    const requestBody = {
      vendorName: payload.vendorName,
      date: payload.date,
      gasType: payload.gasType,
      quantity: Number(payload.quantity),
      tankId: payload.tankId,
      transportDetails: payload.transportDetails || null,
      status: payload.status ?? "draft",
    };

    const response = await fetchApi(`/procurements/${id}`, {
      raw: true,
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result?.success || !result.data) {
      throw new Error(result?.message || "Failed to update procurement record");
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
    <ProcurementStoreContext.Provider value={value}>
      {children}
    </ProcurementStoreContext.Provider>
  );
}

export function useProcurementStore() {
  const context = useContext(ProcurementStoreContext);
  if (!context) {
    throw new Error("useProcurementStore must be used within ProcurementStoreProvider");
  }
  return context;
}
