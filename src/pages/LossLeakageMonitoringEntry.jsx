import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LossLeakageMonitoringView } from "@/modules/lossLeakage/LossLeakageMonitoringView";
import { useLossLeakageStore } from "@/modules/lossLeakage/LossLeakageStore";

export function LossLeakageMonitoringEntry() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { records, loading, error, createRecord, updateRecord, getRecordByCode, clearError } =
    useLossLeakageStore();
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const existingRecord = useMemo(() => getRecordByCode(id) ?? null, [records, id, getRecordByCode]);

  const isEditMode = Boolean(id);

  const handleSubmit = async (payload) => {
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      if (isEditMode && existingRecord) {
        await updateRecord(existingRecord.recordCode, payload);
      } else {
        await createRecord(payload);
      }
      // Success - navigate away
      navigate("/loss-leakage-monitoring");
    } catch (err) {
      // Error already logged by store, just display it
      setSubmitError(err.message || "An error occurred while saving the record");
      setIsSubmitting(false);
    }
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
      isSubmitting={isSubmitting}
      submitError={submitError}
      onDismissError={() => setSubmitError(null)}
    />
  );
}
