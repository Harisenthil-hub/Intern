// src/modules/returns/components/ReturnTable.jsx
export default function ReturnTable({ entries, handleEdit }) {
  if (entries.length === 0) {
    return <div className="empty-state"><p>No return records yet. Click <strong>+ New Entry</strong> to get started.</p></div>;
  }
  return (
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
  );
}
