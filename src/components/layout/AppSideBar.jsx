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

const navItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Tank Master",
    url: "/tanks",
    icon: Container,
  },
  {
    title: "Tank Monitoring",
    url: "/monitoring",
    icon: Droplets,
  },
  {
    title: "Gas Production",
    url: "/production",
    icon: Flame,
  },
  {
    title: "Gas Procurement",
    url: "/procurement",
    icon: Truck,
  },
  {
    title: "Issue to Filling",
    url: "/issue-to-filling",
    icon: Repeat,
  },
  {
    title: "Loss / Leakage Monitoring",
    url: "/loss-leakage-monitoring",
    icon: ShieldAlert,
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();

  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      className="border-r shadow-sm transition-all duration-300"
      style={{
        "--sidebar-width": "16rem",
        "--sidebar-width-icon": "3.8rem",
      }}
    >
      <SidebarHeader className="h-16 flex items-center justify-center border-b px-4 w-full">
        <div className="flex items-center gap-2 font-bold text-xl text-blue-600 w-full ">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600 text-white shrink-0">
            <BarChart3 className="size-5" />
          </div>
          {state === "expanded" && (
            <span className="truncate transition-opacity duration-300">
              Tank Admin
            </span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4 gap-4">
        <SidebarGroup className="text-center">
          <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {navItems.map((item) => {
                const isActive =
                  location.pathname === item.url ||
                  (item.url !== "/" && location.pathname.startsWith(item.url));

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={isActive}
                      size="lg"
                      className={`
                        justify-start gap-3
                        flex items-center gap-3 ${
                          state === "collapsed"
                            ? "justify-center"
                            : "justify-start"
                        }
                        ${
                          isActive
                            ? "bg-blue-50 text-blue-700 font-medium shadow-sm ring-1 ring-blue-500/20"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        }
                      `}
                    >
                      <NavLink
                        to={item.url}
                        className="flex items-center gap-3 w-full"
                      >
                        <div
                          className={`flex items-center justify-center ${
                            state === "collapsed" ? "w-10 h-10" : ""
                          }`}
                        >
                          <item.icon
                            className={
                              state === "collapsed" ? "w-9 h-9" : "w-5 h-5"
                            }
                          />
                        </div>

                        <span
                          className={state === "collapsed" ? "hidden" : "block"}
                        >
                          {item.title}
                        </span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
