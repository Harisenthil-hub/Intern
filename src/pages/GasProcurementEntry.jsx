import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GasProcurementEntryForm from "@/modules/procurement/GasProcurementEntryForm";
import { useProcurementStore } from "@/modules/procurement/ProcurementStore";

export function GasProcurementEntry() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { records, isLoading, hasLoaded, createRecord, updateRecord } = useProcurementStore();

  const existingRecord = useMemo(
    () => records.find((record) => record.id === id) ?? null,
    [records, id],
  );

  const isEditMode = Boolean(id);
  const shouldRedirectMissingRecord =
    isEditMode &&
    hasLoaded &&
    !isLoading &&
    (!existingRecord || existingRecord.status === "posted");

  const handleSubmit = async (payload) => {
    try {
      if (isEditMode && existingRecord) {
        const nextStatus = payload.status === "posted" ? "posted" : "draft";
        await updateRecord(existingRecord.id, { ...payload, status: nextStatus });
      } else {
        await createRecord(payload);
      }
      navigate("/procurement");
    } catch (error) {
      window.alert(error?.message || "Unable to save procurement record.");
    }
  };

  useEffect(() => {
    if (shouldRedirectMissingRecord) {
      navigate("/procurement");
    }
  }, [navigate, shouldRedirectMissingRecord]);

  if (isEditMode && !hasLoaded) {
    return (
      <section className="mx-auto w-full max-w-6xl rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
        Loading procurement record...
      </section>
    );
  }

  if (shouldRedirectMissingRecord) return null;

  return (
    <GasProcurementEntryForm
      mode={isEditMode ? "edit" : "create"}
      initialData={existingRecord}
      onSubmit={handleSubmit}
      onCancel={() => navigate("/procurement")}
    />
  );
}
