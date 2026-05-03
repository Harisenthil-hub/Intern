import { useState, useEffect } from "react";
import Layout from "./Dashboard";
import { returnAPI } from "./api";

function ReturnEntry() {
  const empty = {
    returnId: "", customerName: "", date: "",
    cylinders: [{ serial: "", condition: "Good" }],
  };

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
      const data = await returnAPI.getAll();
      setEntries(data);
    } catch (err) {
      setError("Failed to load records.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCylinderChange = (i, e) => {
    const updated = [...formData.cylinders];
    updated[i][e.target.name] = e.target.value;
    setFormData({ ...formData, cylinders: updated });
  };

  const addCylinder = () =>
    setFormData({ ...formData, cylinders: [...formData.cylinders, { serial: "", condition: "Good" }] });

  const removeCylinder = (i) => {
    if (formData.cylinders.length === 1) return;
    setFormData({ ...formData, cylinders: formData.cylinders.filter((_, idx) => idx !== i) });
  };

  const handleSave = async (status) => {
    try {
      setLoading(true);
      setError("");
      const payload = { ...formData, status };
      if (editId) {
        await returnAPI.update(editId, payload);
        if (status === "posted") await returnAPI.post(editId);
      } else {
        const created = await returnAPI.create(payload);
        if (status === "posted") await returnAPI.post(created._id);
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

  const handleEdit = (entry) => { setFormData({ ...entry }); setEditId(entry._id); setView("form"); };
  const handleNewEntry = () => { setFormData(empty); setEditId(null); setError(""); setView("form"); };
  const handleCancel = () => { setFormData(empty); setEditId(null); setError(""); setView("list"); };

  if (view === "list") {
    return (
      <Layout title="Return Entry" subtitle="Track cylinder returns and conditions"
        breadcrumb={{ parent: "Inventory", current: "Return Entry" }}>
        <div className="list-header">
          <span className="record-count">{entries.length} Record{entries.length !== 1 ? "s" : ""}</span>
          <button className="btn-new" onClick={handleNewEntry}>+ New Entry</button>
        </div>
        {loading && <p className="loading-text">Loading...</p>}
        {error && <p className="error-text">{error}</p>}
        <div className="list-card">
          {entries.length === 0 ? (
            <div className="empty-state"><p>No return records yet. Click <strong>+ New Entry</strong> to get started.</p></div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Return ID</th><th>Customer</th><th>Date</th>
                  <th>Serial</th><th>Condition</th><th>Status</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e, i) =>
                  e.cylinders.map((c, j) => (
                    <tr key={`${i}-${j}`}>
                      {j === 0 && (
                        <>
                          <td rowSpan={e.cylinders.length}>{e.returnId}</td>
                          <td rowSpan={e.cylinders.length}>{e.customerName}</td>
                          <td rowSpan={e.cylinders.length}>{e.date}</td>
                        </>
                      )}
                      <td>{c.serial}</td>
                      <td>{c.condition}</td>
                      {j === 0 && (
                        <>
                          <td rowSpan={e.cylinders.length}>
                            <span className={`badge ${e.status === "posted" ? "badge-posted" : "badge-draft"}`}>
                              {e.status === "posted" ? "Posted" : "Draft"}
                            </span>
                          </td>
                          <td rowSpan={e.cylinders.length}>
                            {e.status !== "posted" && (
                              <button className="btn-edit" onClick={() => handleEdit(e)}>Edit</button>
                            )}
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
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
      {error && <p className="error-text">{error}</p>}
      <form className="form-card" onSubmit={(e) => e.preventDefault()}>
        <div className="row">
          <div className="field"><label>Return ID</label>
            <input name="returnId" value={formData.returnId} onChange={handleChange} placeholder="RET-001" />
          </div>
          <div className="field"><label>Customer Name</label>
            <input name="customerName" value={formData.customerName} onChange={handleChange} placeholder="Jivin C" />
          </div>
          <div className="field"><label>Date</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} />
          </div>
        </div>
        <p className="section-label">Cylinders</p>
        {formData.cylinders.map((cyl, i) => (
          <div key={i} className="row cylinder-row">
            <div className="field"><label>Serial Number</label>
              <input name="serial" value={cyl.serial} onChange={(e) => handleCylinderChange(i, e)} placeholder="CYL-0001" />
            </div>
            <div className="field"><label>Condition</label>
              <select name="condition" value={cyl.condition} onChange={(e) => handleCylinderChange(i, e)}>
                <option>Good</option>
                <option>Damaged</option>
              </select>
            </div>
            {formData.cylinders.length > 1 && (
              <button type="button" className="btn-remove" onClick={() => removeCylinder(i)}>×</button>
            )}
          </div>
        ))}
        <button type="button" className="btn-add-cyl" onClick={addCylinder}>+ Add Cylinder</button>
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

export default ReturnEntry;