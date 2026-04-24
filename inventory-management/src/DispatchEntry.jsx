import { useState, useEffect } from "react";
import Layout from "./Dashboard";
import { dispatchAPI } from "./api";

function DispatchEntry() {
  const empty = {
    dispatchId: "", customerName: "", vehicle: "",
    driver: "", route: "", date: "",
    cylinders: [{ serial: "", gasType: "", qty: "", unit: "" }],
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
      const data = await dispatchAPI.getAll();
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
    setFormData({ ...formData, cylinders: [...formData.cylinders, { serial: "", gasType: "", qty: "", unit: "" }] });

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
        await dispatchAPI.update(editId, payload);
        if (status === "posted") await dispatchAPI.post(editId);
      } else {
        const created = await dispatchAPI.create(payload);
        if (status === "posted") await dispatchAPI.post(created._id);
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
      <Layout title="Dispatch Entry" subtitle="Manage cylinder dispatches to customers"
        breadcrumb={{ parent: "Inventory", current: "Dispatch Entry" }}>
        <div className="list-header">
          <span className="record-count">{entries.length} Record{entries.length !== 1 ? "s" : ""}</span>
          <button className="btn-new" onClick={handleNewEntry}>+ New Entry</button>
        </div>
        {loading && <p className="loading-text">Loading...</p>}
        {error && <p className="error-text">{error}</p>}
        <div className="list-card">
          {entries.length === 0 ? (
            <div className="empty-state"><p>No dispatch records yet. Click <strong>+ New Entry</strong> to get started.</p></div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Dispatch ID</th><th>Customer</th><th>Vehicle</th><th>Driver</th>
                  <th>Route</th><th>Date</th><th>Serial</th><th>Gas</th><th>Qty</th><th>Unit</th>
                  <th>Status</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e, i) =>
                  e.cylinders.map((c, j) => (
                    <tr key={`${i}-${j}`}>
                      {j === 0 && (
                        <>
                          <td rowSpan={e.cylinders.length}>{e.dispatchId}</td>
                          <td rowSpan={e.cylinders.length}>{e.customerName}</td>
                          <td rowSpan={e.cylinders.length}>{e.vehicle}</td>
                          <td rowSpan={e.cylinders.length}>{e.driver}</td>
                          <td rowSpan={e.cylinders.length}>{e.route}</td>
                          <td rowSpan={e.cylinders.length}>{e.date}</td>
                        </>
                      )}
                      <td>{c.serial}</td><td>{c.gasType}</td><td>{c.qty}</td><td>{c.unit}</td>
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
    <Layout title={editId ? "Edit Dispatch" : "New Dispatch Entry"}
      subtitle="Record cylinder dispatch details"
      breadcrumb={{ parent: "Dispatch Entry", current: editId ? "Edit" : "New Entry" }}>
      <div className="form-topbar">
        <button className="btn-back" onClick={handleCancel}>← Back to Records</button>
      </div>
      {error && <p className="error-text">{error}</p>}
      <form className="form-card" onSubmit={(e) => e.preventDefault()}>
        <div className="row">
          <div className="field"><label>Dispatch ID</label>
            <input name="dispatchId" value={formData.dispatchId} onChange={handleChange} placeholder="e.g. DSP-001" />
          </div>
          <div className="field"><label>Customer Name</label>
            <input name="customerName" value={formData.customerName} onChange={handleChange} placeholder="e.g. Jivin C" />
          </div>
          <div className="field"><label>Vehicle Number</label>
            <input name="vehicle" value={formData.vehicle} onChange={handleChange} placeholder="e.g. TN 37 AB 9999" />
          </div>
        </div>
        <div className="row">
          <div className="field"><label>Driver Name</label>
            <input name="driver" value={formData.driver} onChange={handleChange} placeholder="Hari Senthil" />
          </div>
          <div className="field"><label>Route</label>
            <input name="route" value={formData.route} onChange={handleChange} placeholder="Route" />
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
            <div className="field"><label>Gas Type</label>
              <select name="gasType" value={cyl.gasType} onChange={(e) => handleCylinderChange(i, e)}>
                <option value="">Select Gas Type</option>
                <option value="O2">Oxygen</option>
                <option value="N2">Nitrogen</option>
                <option value="CO2">Carbon Dioxide</option>
              </select>
            </div>
            <div className="field"><label>Quantity</label>
              <input name="qty" value={cyl.qty} onChange={(e) => handleCylinderChange(i, e)} placeholder="Quantity" />
            </div>
            <div className="field"><label>Unit</label>
              <select name="unit" value={cyl.unit} onChange={(e) => handleCylinderChange(i, e)}>
                <option value="">Select Unit</option>
                <option value="m3">cubic meter (m³)</option>
                <option value="ft3">cubic feet (ft³)</option>
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

export default DispatchEntry;