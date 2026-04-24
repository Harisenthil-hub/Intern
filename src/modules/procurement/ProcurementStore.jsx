import { createContext, useContext, useMemo, useState } from "react";

const ProcurementStoreContext = createContext(null);

const formatProcurementId = (number) => `PR-${String(number).padStart(3, "0")}`;

const getNextProcurementId = (records) => {
  const maxIndex = records.reduce((max, record) => {
    const match = /^PR-(\d+)$/.exec(record.id);
    if (!match) return max;
    const parsed = Number(match[1]);
    if (!Number.isFinite(parsed)) return max;
    return Math.max(max, parsed);
  }, 0);

  return formatProcurementId(maxIndex + 1);
};

export function ProcurementStoreProvider({ children }) {
  const [records, setRecords] = useState([]);

  const createRecord = (payload) => {
    setRecords((prev) => {
      const nextId = getNextProcurementId(prev);
      return [...prev, { ...payload, id: nextId, status: payload.status ?? "draft" }];
    });
  };

  const updateRecord = (id, payload) => {
    setRecords((prev) =>
      prev.map((record) => (record.id === id ? { ...record, ...payload } : record)),
    );
  };

  const value = useMemo(
    () => ({
      records,
      createRecord,
      updateRecord,
    }),
    [records],
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
