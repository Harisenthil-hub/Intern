import { Outlet, useLocation, NavLink } from "react-router-dom";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "../ui/sidebar";
import { TooltipProvider } from "../ui/tooltip";
import { AppSidebar } from "./AppSideBar";
import { ChevronRight } from "lucide-react";

const PAGE_TITLES = {
  "/": "Dashboard Overview",
  "/tanks": "Tank Master",
  "/monitoring": "Tank Level Monitoring",
  "/production": "Gas Production Entry",
  "/procurement": "Gas Procurement Records",
  "/procurement/new": "Gas Procurement Entry",
  "/issue-to-filling": "Gas Issue to Filling",
  "/loss-leakage-monitoring": "Loss / Leakage Records",
  "/loss-leakage-monitoring/new": "Loss / Leakage Monitoring",
  "/issue-to-filling/new": "Gas Issue Entry",
};
const PAGES = {
  "/": { title: "Dashboard", desc: "System overview & quick stats" },
  "/tanks": {
    title: "Bulk Storage Tank Master",
    desc: "Define and manage gas storage tanks",
  },
  "/monitoring": {
    title: "Tank Level Monitoring",
    desc: "Track and update current tank levels",
  },
  "/production": {
    title: "Gas Production Entry",
    desc: "Record internally generated gas production",
  },
  "/procurement": {
    title: "Gas Procurement Records",
    desc: "Review and manage bulk gas purchases",
  },
  "/procurement/new": {
    title: "Gas Procurement Entry",
    desc: "Capture a new procurement or finalize a draft entry",
  },
  "/issue-to-filling": {
    title: "Gas Issue to Filling",
    desc: "Track transfers from bulk storage to filling operations",
  },
  "/issue-to-filling/new": {
    title: "Gas Issue Entry",
    desc: "Record a new issue from storage to filling",
  },
  "/loss-leakage-monitoring": {
    title: "Loss / Leakage Records",
    desc: "Monitor inventory variance and investigate losses",
  },
  "/loss-leakage-monitoring/new": {
    title: "Loss / Leakage Monitoring",
    desc: "Create and review loss or leakage entries",
  },
};

const BREADCRUMBS = {
  "/": [{ label: "Dashboard", href: "/" }],
  "/tanks": [{ label: "Inventory" }, { label: "Tank Master", href: "/tanks" }],
  "/monitoring": [
    { label: "Inventory" },
    { label: "Tank Monitoring", href: "/monitoring" },
  ],
  "/production": [
    { label: "Inventory" },
    { label: "Gas Production", href: "/production" },
  ],
  "/procurement": [
    { label: "Operations" },
    { label: "Gas Procurement", href: "/procurement" },
  ],
  "/procurement/new": [
    { label: "Operations" },
    { label: "Gas Procurement", href: "/procurement" },
    { label: "New Entry" },
  ],
  "/issue-to-filling": [
    { label: "Operations" },
    { label: "Issue to Filling", href: "/issue-to-filling" },
  ],
  "/issue-to-filling/new": [
    { label: "Operations" },
    { label: "Issue to Filling", href: "/issue-to-filling" },
    { label: "New Entry" },
  ],
  "/loss-leakage-monitoring": [
    { label: "Operations" },
    { label: "Loss / Leakage", href: "/loss-leakage-monitoring" },
  ],
  "/loss-leakage-monitoring/new": [
    { label: "Operations" },
    { label: "Loss / Leakage", href: "/loss-leakage-monitoring" },
    { label: "New Entry" },
  ],
};

export function Layout() {
  const location = useLocation();
  const isProcurementEditRoute = /^\/procurement\/[^/]+\/edit$/.test(
    location.pathname,
  );
  const isIssueEditRoute = /^\/issue-to-filling\/[^/]+\/edit$/.test(location.pathname);
  const isLossLeakageEditRoute = /^\/loss-leakage-monitoring\/[^/]+\/edit$/.test(
    location.pathname,
  );
  const pageTitle =
    isProcurementEditRoute
      ? "Gas Procurement Entry"
      : isIssueEditRoute
        ? "Gas Issue Entry"
        : isLossLeakageEditRoute
          ? "Loss / Leakage Monitoring"
          : PAGE_TITLES[location.pathname] || "Dashboard";
  const page = isProcurementEditRoute
    ? PAGES["/procurement/new"]
    : isIssueEditRoute
      ? PAGES["/issue-to-filling/new"]
      : isLossLeakageEditRoute
        ? PAGES["/loss-leakage-monitoring/new"]
        : PAGES[location.pathname] || PAGES["/"];
  const crumbs = isProcurementEditRoute
    ? [...BREADCRUMBS["/procurement"], { label: "Edit Entry" }]
    : isIssueEditRoute
      ? [...BREADCRUMBS["/issue-to-filling"], { label: "Edit Entry" }]
      : isLossLeakageEditRoute
        ? [...BREADCRUMBS["/loss-leakage-monitoring"], { label: "Edit Entry" }]
        : BREADCRUMBS[location.pathname] || BREADCRUMBS["/"];

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
