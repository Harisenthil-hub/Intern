import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GasProcurementEntryForm from "@/modules/procurement/GasProcurementEntryForm";
import { useProcurementStore } from "@/modules/procurement/ProcurementStore";

export function GasProcurementEntry() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { records, createRecord, updateRecord } = useProcurementStore();

  const existingRecord = useMemo(
    () => records.find((record) => record.id === id) ?? null,
    [records, id],
  );

  const isEditMode = Boolean(id);

  const handleSubmit = (payload) => {
    if (isEditMode && existingRecord) {
      const nextStatus = payload.status === "posted" ? "posted" : "draft";
      updateRecord(existingRecord.id, { ...payload, status: nextStatus });
    } else {
      createRecord(payload);
    }
    navigate("/procurement");
  };

  useEffect(() => {
    if (isEditMode && (!existingRecord || existingRecord.status === "posted")) {
      navigate("/procurement");
    }
  }, [existingRecord, isEditMode, navigate]);

  if (isEditMode && (!existingRecord || existingRecord.status === "posted")) return null;

  return (
    <GasProcurementEntryForm
      mode={isEditMode ? "edit" : "create"}
      initialData={existingRecord}
      onSubmit={handleSubmit}
      onCancel={() => navigate("/procurement")}
    />
  );
}
