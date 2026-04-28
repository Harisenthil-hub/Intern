// src/modules/dispatch/components/DispatchTable.jsx
export default function DispatchTable({ entries, handleEdit }) {
  if (entries.length === 0) {
    return <div className="empty-state"><p>No dispatch records yet. Click <strong>+ New Entry</strong> to get started.</p></div>;
  }
  return (
    <table>
      <thead>
        <tr>
          <th>Dispatch ID</th><th>Customer</th><th>Vehicle</th><th>Driver</th>
          <th>Route</th><th>Date</th><th>Serial</th><th>Gas</th>
          <th>Qty</th><th>Unit</th><th>Status</th><th>Action</th>
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
  );
}
