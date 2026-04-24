import { createContext, useContext, useMemo, useState } from "react";

const GasIssueStoreContext = createContext(null);

const formatIssueId = (number) => `IS-${String(number).padStart(3, "0")}`;

const getNextIssueId = (records) => {
  const maxIndex = records.reduce((max, record) => {
    const match = /^IS-(\d+)$/.exec(record.id);
    if (!match) return max;
    const parsed = Number(match[1]);
    if (!Number.isFinite(parsed)) return max;
    return Math.max(max, parsed);
  }, 0);

  return formatIssueId(maxIndex + 1);
};

export function GasIssueStoreProvider({ children }) {
  const [records, setRecords] = useState([]);

  const createRecord = (payload) => {
    setRecords((prev) => {
      const nextId = getNextIssueId(prev);
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
