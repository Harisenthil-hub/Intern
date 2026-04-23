import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Dashboard";
import { dispatchAPI, returnAPI, trackerAPI } from "./api";
import { FaTruck, FaUndo, FaMapMarkerAlt } from "react-icons/fa";

export default function DashboardHome() {
  const navigate = useNavigate();
  const [dispatchEntries, setDispatchEntries] = useState([]);
  const [returnEntries, setReturnEntries]     = useState([]);
  const [trackerEntries, setTrackerEntries]   = useState([]);

  useEffect(() => {
    dispatchAPI.getAll().then(setDispatchEntries).catch(() => {});
    returnAPI.getAll().then(setReturnEntries).catch(() => {});
    trackerAPI.getAll().then(setTrackerEntries).catch(() => {});
  }, []);

  const totalCylinders  = dispatchEntries.reduce((sum, e) => sum + (e.cylinders?.length || 0), 0);
  const activeCylinders = trackerEntries.filter(t => t.cylinderStatus === "Filled" || t.cylinderStatus === "In Use").length;
  const totalDispatched = dispatchEntries.filter(e => e.status === "posted").length;
  const pendingReturns  = returnEntries.filter(e => e.status === "draft").length;

  const recentActivity = [
    ...dispatchEntries.map(e => ({
      type: "Dispatch",
      detail: e.cylinders?.map(c => `${c.gasType || "Gas"} — ${c.qty} ${c.unit}`).join(", ") || "—",
      ref: e.dispatchId, customer: e.customerName, date: e.date || "—", status: e.status,
    })),
    ...returnEntries.map(e => ({
      type: "Return",
      detail: e.cylinders?.map(c => `${c.serial} (${c.condition})`).join(", ") || "—",
      ref: e.returnId, customer: e.customerName, date: e.date || "—", status: e.status,
    })),
    ...trackerEntries.map(e => ({
      type: "Tracker",
      detail: `${e.serial} — ${e.location}`,
      ref: e.serial, customer: e.cylinderStatus, date: e.date || "—", status: e.status,
    })),
  ].slice(-10).reverse();

  const statCards = [
    { label: "Total Cylinders Dispatched", value: totalCylinders,
      sub: `${totalDispatched} posted`, color: "#3b82f6",
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg> },
    { label: "Active Cylinders", value: activeCylinders,
      sub: `${trackerEntries.length - activeCylinders} inactive`, color: "#22c55e",
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> },
    { label: "Total Returns", value: returnEntries.length,
      sub: `${returnEntries.filter(e => e.status === "posted").length} posted`, color: "#f97316",
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M3 12h14M3 12l4-4M3 12l4 4M21 6v12"/></svg> },
    { label: "Pending Returns", value: pendingReturns,
      sub: pendingReturns > 0 ? "Requires attention" : "All clear", color: "#ef4444",
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg> },
  ];

  const quickAccess = [
    { label: "Dispatch Entry",   desc: "Manage cylinder dispatches to customers", color: "#3b82f6", path: "/dispatch", icon: <FaTruck size={22} color="white" /> },
    { label: "Return Entry",     desc: "Track cylinder returns and conditions",    color: "#22c55e", path: "/return",   icon: <FaUndo size={22} color="white" /> },
    { label: "Location Tracker", desc: "Monitor cylinder locations and status",    color: "#f97316", path: "/tracker",  icon: <FaMapMarkerAlt size={22} color="white" /> },
  ];

  const statusClass = (s) => s === "posted" ? "badge-table-posted" : s === "draft" ? "badge-table-draft" : "badge-table-default";
  const statusLabel = (s) => s === "posted" ? "Posted" : s === "draft" ? "Saved" : s;

  return (
    <Layout title="Dashboard" subtitle="System overview & quick stats">
      <div className="stat-grid">
        {statCards.map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-icon-wrap" style={{ background: s.color }}>{s.icon}</div>
            <div className="stat-body">
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-sub" style={{ color: s.color }}>{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="section-heading">QUICK ACCESS</div>
      <div className="quick-grid">
        {quickAccess.map((q, i) => (
          <div className="quick-card" key={i} onClick={() => navigate(q.path)}>
            <div className="quick-icon" style={{ background: q.color }}>{q.icon}</div>
            <div className="quick-body">
              <div className="quick-title">{q.label}</div>
              <div className="quick-desc">{q.desc}</div>
            </div>
            <div className="quick-arrow">›</div>
          </div>
        ))}
      </div>

      <div className="section-heading" style={{ marginTop: 28 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          style={{ marginRight: 6, verticalAlign: "middle" }}>
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
        RECENT ACTIVITY
      </div>
      <div className="list-card" style={{ marginTop: 10 }}>
        {recentActivity.length === 0 ? (
          <div className="empty-state">No activity yet. Start by creating a dispatch entry.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>TYPE</th><th>DETAIL</th><th>REFERENCE</th>
                <th>CUSTOMER / INFO</th><th>DATE</th><th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.map((a, i) => (
                <tr key={i}>
                  <td><span className="activity-type">{a.type}</span></td>
                  <td style={{ maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.detail}</td>
                  <td><span style={{ fontFamily: "monospace", fontSize: 12 }}>{a.ref}</span></td>
                  <td>{a.customer}</td>
                  <td style={{ color: "#888", fontSize: 12 }}>{a.date}</td>
                  <td><span className={`badge-table ${statusClass(a.status)}`}>{statusLabel(a.status)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}