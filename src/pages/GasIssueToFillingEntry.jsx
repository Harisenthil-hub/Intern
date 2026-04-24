import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GasIssueToFillingView from "@/modules/filling/GasIssueToFillingView";
import { useGasIssueStore } from "@/modules/filling/GasIssueStore";

export function GasIssueToFillingEntry() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { records, createRecord, updateRecord } = useGasIssueStore();

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
    navigate("/issue-to-filling");
  };

  useEffect(() => {
    if (isEditMode && (!existingRecord || existingRecord.status !== "draft")) {
      navigate("/issue-to-filling");
    }
  }, [existingRecord, isEditMode, navigate]);

  if (isEditMode && (!existingRecord || existingRecord.status !== "draft")) return null;

  return (
    <GasIssueToFillingView
      mode={isEditMode ? "edit" : "create"}
      initialData={existingRecord}
      onSubmit={handleSubmit}
      onCancel={() => navigate("/issue-to-filling")}
    />
  );
}
