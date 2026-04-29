// src/pages/DispatchPage.jsx
import { useEffect } from "react";
import Layout from "../components/layout/Layout";
import DispatchForm from "../modules/dispatch/components/DispatchForm";
import DispatchTable from "../modules/dispatch/components/DispatchTable";
import { useDispatch } from "../modules/dispatch/hooks/useDispatch";

export default function DispatchPage() {
  const {
    formData, entries, editId, view, loading, error,
    loadRecords, handleChange, handleCylinderChange,
    addCylinder, removeCylinder, handleSave,
    handleEdit, handleNewEntry, handleCancel,
  } = useDispatch();

  useEffect(() => { loadRecords(); }, []);

  if (view === "list") {
    return (
      <Layout title="Dispatch Entry" subtitle="Manage cylinder dispatches to customers"
        breadcrumb={{ parent: "Inventory", current: "Dispatch Entry" }}>
        <div className="list-header">
          <span className="record-count">{entries.length} Record{entries.length !== 1 ? "s" : ""}</span>
          <button className="btn-new" onClick={handleNewEntry}>+ New Entry</button>
        </div>
        {loading && <p className="loading-text">Loading...</p>}
        <div className="list-card">
          <DispatchTable entries={entries} handleEdit={handleEdit} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={editId ? "Edit Dispatch" : "New Dispatch Entry"}
      subtitle="Record cylinder dispatch details"
      breadcrumb={{ parent: "Dispatch Entry", current: editId ? "Edit" : "New Entry" }}>
      <div className="form-topbar">
        <button className="btn-back" onClick={handleCancel}>← Back to Records</button>
      </div>
      <DispatchForm
        formData={formData} handleChange={handleChange}
        handleCylinderChange={handleCylinderChange}
        addCylinder={addCylinder} removeCylinder={removeCylinder}
        handleSave={handleSave} handleCancel={handleCancel}
        editId={editId} loading={loading} error={error}
      />
    </Layout>
  );
}
