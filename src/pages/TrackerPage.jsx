// src/pages/TrackerPage.jsx
import { useEffect } from "react";
import Layout from "../components/layout/Layout";
import TrackerForm from "../modules/tracker/components/TrackerForm";
import TrackerTable from "../modules/tracker/components/TrackerTable";
import { useTracker } from "../modules/tracker/hooks/useTracker";

export default function TrackerPage() {
  const {
    formData, entries, editId, view, loading, error,
    loadRecords, handleChange, handleSave,
    handleEdit, handleNewEntry, handleCancel,
  } = useTracker();

  useEffect(() => { loadRecords(); }, []);

  if (view === "list") {
    return (
      <Layout title="Location Tracker" subtitle="Monitor cylinder locations and real-time status"
        breadcrumb={{ parent: "Inventory", current: "Location Tracker" }}>
        <div className="list-header">
          <span className="record-count">{entries.length} Record{entries.length !== 1 ? "s" : ""}</span>
          <button className="btn-new" onClick={handleNewEntry}>+ New Entry</button>
        </div>
        {loading && <p className="loading-text">Loading...</p>}
        <div className="list-card">
          <TrackerTable entries={entries} handleEdit={handleEdit} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={editId ? "Edit Tracker" : "New Tracker Entry"}
      subtitle="Record cylinder location and status"
      breadcrumb={{ parent: "Location Tracker", current: editId ? "Edit" : "New Entry" }}>
      <div className="form-topbar">
        <button className="btn-back" onClick={handleCancel}>← Back to Records</button>
      </div>
      <TrackerForm
        formData={formData} handleChange={handleChange}
        handleSave={handleSave} handleCancel={handleCancel}
        loading={loading} error={error}
      />
    </Layout>
  );
}
