import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "../ui/sidebar";
import { TooltipProvider } from "../ui/tooltip";
import { AppSidebar } from "./AppSideBar";

const PAGE_TITLES = {
  "/": "Dashboard Overview",
  "/tanks": "Tank Master",
  "/monitoring": "Tank Level Monitoring",
  "/production": "Gas Production Entry",
  "/procurement": "Gas Procurement Records",
  "/procurement/new": "Gas Procurement Entry",
  "/issue-to-filling": "Gas Issue to Filling",
  "/loss-leakage-monitoring": "Loss / Leakage Monitoring",
};

export function Layout() {
  const location = useLocation();
  const isProcurementEditRoute = /^\/procurement\/[^/]+\/edit$/.test(
    location.pathname,
  );
  const pageTitle = isProcurementEditRoute
    ? "Gas Procurement Entry"
    : PAGE_TITLES[location.pathname] || "Dashboard";
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />

        <SidebarInset className="bg-slate-50 flex-1 overflow-hidden flex flex-col transition-all duration-300 ">
          <div className="flex items-center justify-between bg-white px-6 py-4 border-b shrink-0 h-16">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="-ml-1" />
              <div className="h-6 w-px bg-slate-200" />
              <h1 className="text-lg font-semibold text-slate-800">
                {pageTitle}
              </h1>
            </div>
          </div>

          <main className="flex-1 p-6 md:p-8 overflow-auto">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
