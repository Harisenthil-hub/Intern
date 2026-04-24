import { useState, useEffect } from "react";
import Layout from "./Dashboard";
import { trackerAPI } from "./api";

function LocationTracker() {
  const empty = { serial: "", location: "Plant", cylinderStatus: "Filled" };

  const [formData, setFormData] = useState(empty);
  const [entries, setEntries] = useState([]);
  const [editId, setEditId] = useState(null);
  const [view, setView] = useState("list");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { fetchRecords(); }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const data = await trackerAPI.getAll();
      setEntries(data);
    } catch (err) {
      setError("Failed to load records.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async (status) => {
    try {
      setLoading(true);
      setError("");
      const payload = { ...formData, status, date: new Date().toLocaleDateString() };
      if (editId) {
        await trackerAPI.update(editId, payload);
        if (status === "posted") await trackerAPI.post(editId);
      } else {
        const created = await trackerAPI.create(payload);
        if (status === "posted") await trackerAPI.post(created._id);
      }
      await fetchRecords();
      setFormData(empty);
      setEditId(null);
      setView("list");
    } catch (err) {
      setError(err.message || "Failed to save.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (entry) => {
    setFormData({ serial: entry.serial, location: entry.location, cylinderStatus: entry.cylinderStatus });
    setEditId(entry._id);
    setView("form");
  };

  const handleNewEntry = () => { setFormData(empty); setEditId(null); setError(""); setView("form"); };
  const handleCancel = () => { setFormData(empty); setEditId(null); setError(""); setView("list"); };

  if (view === "list") {
    return (
      <Layout title="Location Tracker" subtitle="Monitor cylinder locations and real-time status"
        breadcrumb={{ parent: "Inventory", current: "Location Tracker" }}>
        <div className="list-header">
          <span className="record-count">{entries.length} Record{entries.length !== 1 ? "s" : ""}</span>
          <button className="btn-new" onClick={handleNewEntry}>+ New Entry</button>
        </div>
        {loading && <p className="loading-text">Loading...</p>}
        {error && <p className="error-text">{error}</p>}
        <div className="list-card">
          {entries.length === 0 ? (
            <div className="empty-state"><p>No tracker records yet. Click <strong>+ New Entry</strong> to get started.</p></div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Serial Number</th><th>Location</th><th>Cylinder Status</th>
                  <th>Date</th><th>Entry Status</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((h, i) => (
                  <tr key={i}>
                    <td>{h.serial}</td><td>{h.location}</td><td>{h.cylinderStatus}</td><td>{h.date}</td>
                    <td>
                      <span className={`badge ${h.status === "posted" ? "badge-posted" : "badge-draft"}`}>
                        {h.status === "posted" ? "Posted" : "Draft"}
                      </span>
                    </td>
                    <td>
                      {h.status !== "posted" && (
                        <button className="btn-edit" onClick={() => handleEdit(h)}>Edit</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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
      {error && <p className="error-text">{error}</p>}
      <form className="form-card" onSubmit={(e) => e.preventDefault()}>
        <div className="row">
          <div className="field"><label>Serial Number</label>
            <input name="serial" value={formData.serial} onChange={handleChange} placeholder="CYL-0001" />
          </div>
          <div className="field"><label>Location</label>
            <select name="location" value={formData.location} onChange={handleChange}>
              <option value="Plant">Plant</option>
              <option value="Warehouse">Warehouse</option>
              <option value="In Transit">In Transit</option>
              <option value="Customer Site">Customer Site</option>
            </select>
          </div>
          <div className="field"><label>Status</label>
            <select name="cylinderStatus" value={formData.cylinderStatus} onChange={handleChange}>
              <option value="Filled">Filled</option>
              <option value="Empty">Empty</option>
              <option value="In Use">In Use</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
        </div>
        <div className="form-actions">
          <button type="button" className="btn-save" onClick={() => handleSave("draft")} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
          <button type="button" className="btn-post" onClick={() => handleSave("posted")} disabled={loading}>
            {loading ? "Posting..." : "Post"}
          </button>
          <button type="button" className="btn-cancel" onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </Layout>
  );
}

export default LocationTracker;