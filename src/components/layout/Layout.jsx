import { NavLink } from "react-router-dom";
import { FaTruck, FaUndo, FaMapMarkerAlt, FaTachometerAlt } from "react-icons/fa";
import "../../index.css";

export default function Layout({ children, title, subtitle, breadcrumb }) {
  return (
    <div className="container">
      <div className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z"/>
              <circle cx="12" cy="9" r="2.5" fill="white" stroke="none"/>
            </svg>
          </div>
          <div>
            <div className="brand-name">Main Menu</div>
            <div className="brand-sub">Inventory System</div>
          </div>
        </div>

        <div className="sidebar-section-label">OVERVIEW</div>
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <FaTachometerAlt className="nav-icon" /> Dashboard
        </NavLink>

        <div className="sidebar-section-label">INVENTORY MANAGEMENT</div>
        <NavLink to="/dispatch" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <FaTruck className="nav-icon" /> Dispatch Entry
        </NavLink>
        <NavLink to="/return" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <FaUndo className="nav-icon" /> Return Entry
        </NavLink>
        <NavLink to="/tracker" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <FaMapMarkerAlt className="nav-icon" /> Location Tracker
        </NavLink>
      </div>

      <div className="main">
        <div className="topbar">
          <div className="topbar-left">
            <button className="topbar-icon-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
              </svg>
            </button>
            {breadcrumb ? (
              <div className="breadcrumb">
                <span className="breadcrumb-parent">{breadcrumb.parent}</span>
                <span className="breadcrumb-sep">›</span>
                <span className="breadcrumb-current">{breadcrumb.current}</span>
              </div>
            ) : (
              <span className="breadcrumb-current">{title}</span>
            )}
          </div>
        </div>

        <div className="page-header">
          <h1 className="page-title">{title}</h1>
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </div>

        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  );
}
