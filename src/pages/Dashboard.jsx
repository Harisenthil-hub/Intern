import React from 'react';
import DashboardCards from '../modules/cylinder/components/DashboardCards';
import PageHeader from '../components/common/PageHeader';

const Dashboard = () => {
  return (
    <div>
      <PageHeader title="Cylinder Stock Dashboard" description="Overview of cylinder inventory and statuses." />
      <DashboardCards />
    </div>
  );
};

export default Dashboard;
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Container,
  Droplets,
  Flame,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  ChevronRight,
  Activity,
  Loader2,
} from "lucide-react";
import { fetchApi } from "@/lib/api";

const colorMap = {
  blue: { bg: "bg-blue-50", icon: "bg-blue-600", text: "text-blue-600", border: "border-blue-100" },
  green: { bg: "bg-green-50", icon: "bg-green-600", text: "text-green-600", border: "border-green-100" },
  orange: { bg: "bg-orange-50", icon: "bg-orange-500", text: "text-orange-600", border: "border-orange-100" },
  red: { bg: "bg-red-50", icon: "bg-red-600", text: "text-red-600", border: "border-red-100" },
};

const quickLinks = [
  { title: "Tank Master", desc: "Manage bulk storage tanks and their specifications", href: "/tanks", icon: Container, color: "blue" },
  { title: "Tank Monitoring", desc: "Track real-time inventory levels in storage tanks", href: "/monitoring", icon: Droplets, color: "green" },
  { title: "Gas Production", desc: "Record and review internally generated gas entries", href: "/production", icon: Flame, color: "orange" },
];

const statusStyle = {
  Posted: "bg-green-100 text-green-700",
  Saved: "bg-blue-100 text-blue-700",
  Active: "bg-emerald-100 text-emerald-700",
  Warning: "bg-red-100 text-red-700",
};

export function Dashboard() {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchApi("/dashboard");
        setStats(data.stats);
        setActivity(data.recent_activity || []);
      } catch (e) {
        console.error(e);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 gap-3 text-slate-500">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">Loading dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-48 text-red-500 text-sm gap-2">
        <AlertTriangle className="w-4 h-4" />
        {error}
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Tanks",
      value: stats?.total_tanks ?? "—",
      icon: Container,
      color: "blue",
      change: stats ? `${stats.inactive_tanks} inactive, ${stats.maintenance_tanks} in maintenance` : "—",
      trend: "neutral",
    },
    {
      label: "Active Tanks",
      value: stats?.active_tanks ?? "—",
      icon: CheckCircle2,
      color: "green",
      change: stats ? `of ${stats.total_tanks} total tanks` : "—",
      trend: "up",
    },
    {
      label: "Today's Production",
      value: stats
        ? stats.today_production_total > 0
          ? `${stats.today_production_total.toLocaleString()} ${stats.today_production_unit}`
          : "No entries today"
        : "—",
      icon: Flame,
      color: "orange",
      change: stats ? `${stats.today_production_entries} entr${stats.today_production_entries === 1 ? "y" : "ies"} today` : "—",
      trend: "up",
    },
    {
      label: "Low Level Alerts",
      value: stats?.low_level_alerts ?? "—",
      icon: AlertTriangle,
      color: "red",
      change: stats?.low_level_alerts > 0 ? "Requires attention" : "All tanks OK",
      trend: stats?.low_level_alerts > 0 ? "warning" : "neutral",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const c = colorMap[stat.color];
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`bg-white rounded-xl border ${c.border} shadow-sm p-5 flex items-start gap-4 card-hover`}
            >
              <div className={`${c.icon} rounded-xl p-2.5 shrink-0`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-500 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-800 leading-none">{stat.value}</p>
                <p className={`text-xs mt-1.5 ${c.text} flex items-center gap-1`}>
                  {stat.trend === "up" && <TrendingUp className="w-3 h-3" />}
                  {stat.trend === "warning" && <AlertTriangle className="w-3 h-3" />}
                  {stat.change}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Access */}
      <div>
        <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-3">
          Quick Access
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickLinks.map((link) => {
            const c = colorMap[link.color];
            const Icon = link.icon;
            return (
              <NavLink
                key={link.href}
                to={link.href}
                className={`bg-white rounded-xl border ${c.border} shadow-sm p-5 flex items-center gap-4 card-hover group`}
              >
                <div className={`${c.icon} rounded-xl p-3 shrink-0`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">
                    {link.title}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-snug">{link.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors shrink-0" />
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Recent Activity
          </h2>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {activity.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm">No recent activity found.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Type</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Detail</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Tank</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Time</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {activity.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-slate-700">{row.type}</td>
                    <td className="px-5 py-3.5 text-slate-600">{row.detail}</td>
                    <td className="px-5 py-3.5 text-slate-600">{row.tank || "—"}</td>
                    <td className="px-5 py-3.5 text-slate-400 text-xs">{row.time}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyle[row.status] || "bg-slate-100 text-slate-600"}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
