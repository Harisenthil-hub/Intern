import { createContext, useContext, useMemo, useState } from "react";

const LossLeakageStoreContext = createContext(null);

const formatRecordId = (number) => `LS-${String(number).padStart(3, "0")}`;

const getNextRecordId = (records) => {
  const maxIndex = records.reduce((max, record) => {
    const match = /^LS-(\d+)$/.exec(record.id);
    if (!match) return max;
    const parsed = Number(match[1]);
    if (!Number.isFinite(parsed)) return max;
    return Math.max(max, parsed);
  }, 0);

  return formatRecordId(maxIndex + 1);
};

export function LossLeakageStoreProvider({ children }) {
  const [records, setRecords] = useState([]);

  const createRecord = (payload) => {
    setRecords((prev) => {
      const nextId = getNextRecordId(prev);
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
