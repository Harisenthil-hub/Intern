import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Outlet, useLocation, NavLink } from "react-router-dom";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "../ui/sidebar";
import { TooltipProvider } from "../ui/tooltip";
import { AppSidebar } from "./AppSideBar";
import { ChevronRight } from "lucide-react";

export const SimpleLayout = () => {
  return (
    <div className="flex h-screen w-full bg-gray-50/50">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Navbar />
        <main className="flex-1 overflow-auto p-6 md:p-8">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

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
  "/dispatch": "Dispatch Entry",
  "/return": "Return Entry",
  "/tracker": "Location Tracker",
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
  "/dispatch": {
    title: "Dispatch Entry",
    desc: "Manage cylinder dispatches to customers",
  },
  "/return": {
    title: "Return Entry",
    desc: "Track cylinder returns and conditions",
  },
  "/tracker": {
    title: "Location Tracker",
    desc: "Monitor cylinder locations and real-time status",
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
  "/dispatch": [
    { label: "Dispatch & Returns" },
    { label: "Dispatch Entry", href: "/dispatch" },
  ],
  "/return": [
    { label: "Dispatch & Returns" },
    { label: "Return Entry", href: "/return" },
  ],
  "/tracker": [
    { label: "Dispatch & Returns" },
    { label: "Location Tracker", href: "/tracker" },
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

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />

        <SidebarInset className="bg-slate-50 flex-1 overflow-hidden flex flex-col transition-all duration-300">
          {/* Top Header */}
          <header className="flex items-center justify-between bg-white px-6 h-16 border-b shrink-0 shadow-sm">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="-ml-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md p-1.5 transition-colors" />
              <div className="h-5 w-px bg-slate-200" />
              {/* Breadcrumb */}
              <nav className="flex items-center gap-1.5 text-sm">
                {crumbs.map((crumb, index) => (
                  <span key={index} className="flex items-center gap-1.5">
                    {index > 0 && (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    )}
                    {crumb.href ? (
                      <NavLink
                        to={crumb.href}
                        className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        {crumb.label}
                      </NavLink>
                    ) : (
                      <span className="text-slate-400">{crumb.label}</span>
                    )}
                  </span>
                ))}
              </nav>
            </div>
          </header>

          {/* Page sub-header */}
          <div className="bg-white border-b px-6 py-3">
            <h1 className="text-base font-semibold text-slate-800">
              {pageTitle}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">{page.desc}</p>
          </div>

          <main className="flex-1 p-6 overflow-auto page-fade-in">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}

export default Layout;
