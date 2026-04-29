import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GasIssueToFillingView from "@/modules/filling/GasIssueToFillingView";
import { useGasIssueStore } from "@/modules/filling/GasIssueStore";

export function GasIssueToFillingEntry() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { records, isLoading, hasLoaded, createRecord, updateRecord } = useGasIssueStore();

  const existingRecord = useMemo(
    () => records.find((record) => record.id === id) ?? null,
    [records, id],
  );

  const isEditMode = Boolean(id);
  const shouldRedirectMissingRecord =
    isEditMode &&
    hasLoaded &&
    !isLoading &&
    (!existingRecord || existingRecord.status !== "draft");

  const handleSubmit = async (payload) => {
    try {
      if (isEditMode && existingRecord) {
        const nextStatus = payload.status === "posted" ? "posted" : "draft";
        await updateRecord(existingRecord.id, { ...payload, status: nextStatus });
      } else {
        await createRecord(payload);
      }
      navigate("/issue-to-filling");
    } catch (error) {
      window.alert(error?.message || "Unable to save issue record.");
    }
  };

  useEffect(() => {
    if (shouldRedirectMissingRecord) {
      navigate("/issue-to-filling");
    }
  }, [navigate, shouldRedirectMissingRecord]);

  if (isEditMode && !hasLoaded) {
    return (
      <section className="mx-auto w-full max-w-6xl rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
        Loading issue record...
      </section>
    );
  }

  if (shouldRedirectMissingRecord) return null;

  return (
    <GasIssueToFillingView
      mode={isEditMode ? "edit" : "create"}
      initialData={existingRecord}
      onSubmit={handleSubmit}
      onCancel={() => navigate("/issue-to-filling")}
    />
  );
}
