import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { fetchApi } from "@/lib/api";

const LossLeakageStoreContext = createContext(null);

// Convert snake_case from API to camelCase for frontend
const apiToCamelCase = (apiRecord) => {
  return {
    id: apiRecord.id || apiRecord.record_code || apiRecord.recordCode,
    recordCode: apiRecord.id || apiRecord.record_code || apiRecord.recordCode,
    tankId: apiRecord.tankId || apiRecord.tank_id,
    date: apiRecord.date,
    expectedQuantity: apiRecord.expectedQuantity ?? apiRecord.expected_quantity,
    actualQuantity: apiRecord.actualQuantity ?? apiRecord.actual_quantity,
    lossQuantity: apiRecord.lossQuantity ?? apiRecord.loss_quantity,
    reason: apiRecord.reason || "",
    status: apiRecord.status,
    createdAt: apiRecord.createdAt || apiRecord.created_at,
    updatedAt: apiRecord.updatedAt || apiRecord.updated_at,
  };
};

// Convert camelCase from frontend to snake_case for API
const camelCaseToApi = (frontendRecord) => {
  return {
    tank_id: frontendRecord.tankId,
    date: frontendRecord.date,
    expected_quantity: frontendRecord.expectedQuantity,
    actual_quantity: frontendRecord.actualQuantity,
    reason: frontendRecord.reason || "",
    status: frontendRecord.status || "draft",
  };
};

export function LossLeakageStoreProvider({ children }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch records on mount
  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchApi("/loss-records/", { raw: true });
        if (!response.ok) {
          throw new Error(`Failed to fetch records: ${response.statusText}`);
        }
        const json = await response.json();
        const data = json.data || [];
        setRecords(Array.isArray(data) ? data.map(apiToCamelCase) : []);
      } catch (err) {
        console.error("Error fetching records:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  const createRecord = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const apiPayload = camelCaseToApi(payload);
      const response = await fetchApi("/loss-records/", {
        raw: true,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiPayload),
      });

      if (!response.ok) {
        const json = await response.json();
        throw new Error(json.message || `Failed to create record: ${response.statusText}`);
      }

      const json = await response.json();
      const newRecord = apiToCamelCase(json.data);
      setRecords((prev) => [...prev, newRecord]);
      return newRecord;
    } catch (err) {
      console.error("Error creating record:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateRecord = async (recordCode, payload) => {
    setLoading(true);
    setError(null);
    try {
      const apiPayload = camelCaseToApi(payload);
      const response = await fetchApi(`/loss-records/${recordCode}`, {
        raw: true,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiPayload),
      });

      if (!response.ok) {
        const json = await response.json();
        throw new Error(json.message || `Failed to update record: ${response.statusText}`);
      }

      const json = await response.json();
      const updatedRecord = apiToCamelCase(json.data);
      setRecords((prev) =>
        prev.map((record) => (record.recordCode === recordCode ? updatedRecord : record)),
      );
      return updatedRecord;
    } catch (err) {
      console.error("Error updating record:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getRecordByCode = (recordCode) => {
    return records.find((record) => record.recordCode === recordCode) ?? null;
  };

  const value = useMemo(
    () => ({
      records,
      loading,
      error,
      createRecord,
      updateRecord,
      getRecordByCode,
      clearError: () => setError(null),
    }),
    [records, loading, error],
  );

  return (
    <LossLeakageStoreContext.Provider value={value}>
      {children}
    </LossLeakageStoreContext.Provider>
  );
}

export function useLossLeakageStore() {
  const context = useContext(LossLeakageStoreContext);
  if (!context) {
    throw new Error("useLossLeakageStore must be used within LossLeakageStoreProvider");
  }
  return context;
}
