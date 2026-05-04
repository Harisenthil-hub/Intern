// src/pages/ReturnEntry.jsx
import { useEffect } from "react";
import ReturnForm from "../modules/returns/components/ReturnForm";
import ReturnTable from "../modules/returns/components/ReturnTable";
import { useReturn } from "../modules/returns/hooks/useReturn";
import "../styles/inventory.css";

export default function ReturnEntry() {
  const {
    formData, entries, editId, view, loading, error,
    loadRecords, handleChange, handleCylinderChange,
    addCylinder, removeCylinder, handleSave,
    handleEdit, handleNewEntry, handleCancel,
  } = useReturn();

  useEffect(() => { loadRecords(); }, []);

  if (view === "list") {
    return (
      <div className="inv-page">
        <div className="list-header">
          <span className="record-count">{entries.length} Record{entries.length !== 1 ? "s" : ""}</span>
          <button className="btn-new" onClick={handleNewEntry}>+ New Entry</button>
        </div>
        {loading && <p className="loading-text">Loading...</p>}
        <div className="list-card">
          <ReturnTable entries={entries} handleEdit={handleEdit} />
        </div>
      </div>
    );
  }

  return (
    <div className="inv-page">
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
    </div>
  );
}
