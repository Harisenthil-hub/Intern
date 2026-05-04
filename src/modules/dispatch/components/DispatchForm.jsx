// src/modules/dispatch/components/DispatchForm.jsx
export default function DispatchForm({ formData, handleChange, handleCylinderChange, addCylinder, removeCylinder, handleSave, handleCancel, editId, loading, error }) {
  return (
    <>
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
    </>
  );
}
