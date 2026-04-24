import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LossLeakageMonitoringView } from "@/modules/lossLeakage/LossLeakageMonitoringView";
import { useLossLeakageStore } from "@/modules/lossLeakage/LossLeakageStore";

export function LossLeakageMonitoringEntry() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { records, createRecord, updateRecord } = useLossLeakageStore();

  const existingRecord = useMemo(
    () => records.find((record) => record.id === id) ?? null,
    [records, id],
  );

  const isEditMode = Boolean(id);

  const handleSubmit = (payload) => {
    if (isEditMode && existingRecord) {
      updateRecord(existingRecord.id, payload);
    } else {
      createRecord(payload);
    }
    navigate("/loss-leakage-monitoring");
  };

  useEffect(() => {
    if (isEditMode && (!existingRecord || existingRecord.status !== "draft")) {
      navigate("/loss-leakage-monitoring");
    }
  }, [existingRecord, isEditMode, navigate]);

  if (isEditMode && (!existingRecord || existingRecord.status !== "draft")) return null;

  return (
    <LossLeakageMonitoringView
      mode={isEditMode ? "edit" : "create"}
      initialData={existingRecord}
      onSubmit={handleSubmit}
      onCancel={() => navigate("/loss-leakage-monitoring")}
    />
  );
}
