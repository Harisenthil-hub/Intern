// src/pages/ReturnPage.jsx
import { useEffect } from "react";
import Layout from "../components/layout/Layout";
import ReturnForm from "../modules/returns/components/ReturnForm";
import ReturnTable from "../modules/returns/components/ReturnTable";
import { useReturn } from "../modules/returns/hooks/useReturn";

export default function ReturnPage() {
  const {
    formData, entries, editId, view, loading, error,
    loadRecords, handleChange, handleCylinderChange,
    addCylinder, removeCylinder, handleSave,
    handleEdit, handleNewEntry, handleCancel,
  } = useReturn();

  useEffect(() => { loadRecords(); }, []);

  if (view === "list") {
    return (
      <Layout title="Return Entry" subtitle="Track cylinder returns and conditions"
        breadcrumb={{ parent: "Inventory", current: "Return Entry" }}>
        <div className="list-header">
          <span className="record-count">{entries.length} Record{entries.length !== 1 ? "s" : ""}</span>
          <button className="btn-new" onClick={handleNewEntry}>+ New Entry</button>
        </div>
        {loading && <p className="loading-text">Loading...</p>}
        <div className="list-card">
          <ReturnTable entries={entries} handleEdit={handleEdit} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={editId ? "Edit Return" : "New Return Entry"}
      subtitle="Record cylinder return details"
      breadcrumb={{ parent: "Return Entry", current: editId ? "Edit" : "New Entry" }}>
      <div className="form-topbar">
        <button className="btn-back" onClick={handleCancel}>← Back to Records</button>
      </div>
      <ReturnForm
        formData={formData} handleChange={handleChange}
        handleCylinderChange={handleCylinderChange}
        addCylinder={addCylinder} removeCylinder={removeCylinder}
        handleSave={handleSave} handleCancel={handleCancel}
        loading={loading} error={error}
      />
    </Layout>
  );
}
