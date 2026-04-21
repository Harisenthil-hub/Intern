import { Outlet, useLocation, NavLink } from "react-router-dom";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "../ui/sidebar";
import { TooltipProvider } from "../ui/tooltip";
import { AppSidebar } from "./AppSideBar";
import { ChevronRight } from "lucide-react";

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
};

export function Layout() {
  const location = useLocation();
  const page = PAGES[location.pathname] || PAGES["/"];
  const crumbs = BREADCRUMBS[location.pathname] || BREADCRUMBS["/"];

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

            {/* Right side: user info 
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-800">Admin User</p>
                <p className="text-xs text-slate-500">Plant Manager</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold shadow">
                A
              </div>
            </div>
            */}
          </header>

          {/* Page sub-header */}
          <div className="bg-white border-b px-6 py-3">
            <h1 className="text-base font-semibold text-slate-800">
              {page.title}
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
