// src/modules/returns/components/ReturnForm.jsx
export default function ReturnForm({ formData, handleChange, handleCylinderChange, addCylinder, removeCylinder, handleSave, handleCancel, loading, error }) {
  return (
    <>
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
    </>
  );
}
