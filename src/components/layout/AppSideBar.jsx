import * as React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  BarChart3,
  Container,
  Droplets,
  Flame,
  Truck,
  Repeat,
  LayoutDashboard,
  ShieldAlert,
  Activity,
  Beaker,
  ArrowRightLeft,
  Undo2,
  MapPin,
  PackageCheck,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";

const navGroups = [
  {
    label: "Overview",
    items: [{ title: "Dashboard", url: "/", icon: LayoutDashboard }],
  },
  {
    label: "Inventory Management",
    items: [
      { title: "Tank Master", url: "/tanks", icon: Container },
      { title: "Tank Monitoring", url: "/monitoring", icon: Droplets },
      { title: "Gas Production", url: "/production", icon: Flame },
    ],
  },
  {
    label: "Operations",
    items: [
      { title: "Gas Procurement", url: "/procurement", icon: Truck },
      { title: "Issue to Filling", url: "/issue-to-filling", icon: Repeat },
      { title: "Loss / Leakage Monitoring", url: "/loss-leakage-monitoring", icon: ShieldAlert },
    ],
  },
  {
    label: "Cylinder Operations",
    items: [
      { title: "Cylinder Filling", url: "/filling", icon: Beaker },
      { title: "Cylinder Movement", url: "/movement", icon: ArrowRightLeft },
    ],
  },
  {
    label: "Dispatch & Returns",
    items: [
      { title: "Dispatch Entry", url: "/dispatch", icon: PackageCheck },
      { title: "Return Entry", url: "/return", icon: Undo2 },
      { title: "Location Tracker", url: "/tracker", icon: MapPin },
    ],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      className="border-r-0 shadow-xl transition-all duration-300"
      style={{
        "--sidebar-width": "16rem",
        "--sidebar-width-icon": "4rem",
      }}
    >
      {/* Logo / Brand */}
      <SidebarHeader className="h-16 flex items-center border-b border-sidebar-border px-3 w-full">
        <div className="flex items-center gap-3 w-full">
          <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-blue-500 text-white shadow-md shrink-0">
            <Activity className="size-5" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold text-sidebar-foreground truncate">
                Gas Track
              </span>
              <span className="text-xs text-sidebar-foreground/60 truncate">
                Inventory System
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3 gap-1">
        {navGroups.map((group, index) => (
          <SidebarGroup
            key={group.label ?? group.items[0]?.title ?? `group-${index}`}
            className="p-0 mb-1"
          >
            {!isCollapsed && group.label && (
              <SidebarGroupLabel className="text-[10px] font-semibold tracking-widest uppercase text-sidebar-foreground/40 px-3 py-2 mb-1">
                {group.label}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {group.items.map((item) => {
                  const isActive =
                    location.pathname === item.url ||
                    (item.url !== "/" &&
                      location.pathname.startsWith(item.url));

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.title}
                        isActive={isActive}
                        size="default"
                        className={`
                          h-10 rounded-lg transition-all duration-150 
                          ${isCollapsed ? "justify-center px-0" : "px-3"}
                          ${
                            isActive
                              ? "bg-blue-500 text-white shadow-sm"
                              : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                          }
                        `}
                      >
                        <NavLink
                          to={item.url}
                          className={`flex items-center gap-3 w-full ${
                            isCollapsed ? "justify-center" : ""
                          }`}
                        >
                          <item.icon
                            className={`shrink-0 ${
                              isActive ? "text-white" : ""
                            } ${isCollapsed ? "w-5 h-5" : "w-4 h-4"}`}
                          />
                          {!isCollapsed && (
                            <span className="text-sm font-medium">
                              {item.title}
                            </span>
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Footer hint 
      {!isCollapsed && (
        <div className="mt-auto px-4 py-3 border-t border-sidebar-border">
          <p className="text-[10px] text-sidebar-foreground/40 text-center">
            © 2025 GasTrack Pro v1.0
          </p>
        </div>
      )}
        */}
    </Sidebar>
  );
}
