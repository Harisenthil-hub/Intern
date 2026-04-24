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
} from "lucide-react";

const stats = [
  {
    label: "Total Tanks",
    value: "12",
    icon: Container,
    color: "blue",
    change: "+2 this month",
    trend: "up",
  },
  {
    label: "Active Tanks",
    value: "10",
    icon: CheckCircle2,
    color: "green",
    change: "2 inactive",
    trend: "neutral",
  },
  {
    label: "Today's Production",
    value: "3,200 L",
    icon: Flame,
    color: "orange",
    change: "+12% vs yesterday",
    trend: "up",
  },
  {
    label: "Low Level Alerts",
    value: "2",
    icon: AlertTriangle,
    color: "red",
    change: "Requires attention",
    trend: "warning",
  },
];

const colorMap = {
  blue: { bg: "bg-blue-50", icon: "bg-blue-600", text: "text-blue-600", border: "border-blue-100" },
  green: { bg: "bg-green-50", icon: "bg-green-600", text: "text-green-600", border: "border-green-100" },
  orange: { bg: "bg-orange-50", icon: "bg-orange-500", text: "text-orange-600", border: "border-orange-100" },
  red: { bg: "bg-red-50", icon: "bg-red-600", text: "text-red-600", border: "border-red-100" },
};

const quickLinks = [
  {
    title: "Tank Master",
    desc: "Manage bulk storage tanks and their specifications",
    href: "/tanks",
    icon: Container,
    color: "blue",
  },
  {
    title: "Tank Monitoring",
    desc: "Track real-time inventory levels in storage tanks",
    href: "/monitoring",
    icon: Droplets,
    color: "green",
  },
  {
    title: "Gas Production",
    desc: "Record and review internally generated gas entries",
    href: "/production",
    icon: Flame,
    color: "orange",
  },
];

const recentActivity = [
  { type: "Production", detail: "Oxygen — 500 L", tank: "Tank A", time: "Today, 09:15 AM", status: "Posted" },
  { type: "Level Entry", detail: "Nitrogen — Closing: 420 L", tank: "Tank B", time: "Today, 08:40 AM", status: "Saved" },
  { type: "Tank Added", detail: "LPG Storage Unit 3", tank: "Tank C", time: "Yesterday, 04:00 PM", status: "Active" },
  { type: "Production", detail: "LPG — 1,200 Kg", tank: "Tank C", time: "Yesterday, 02:30 PM", status: "Posted" },
  { type: "Alert", detail: "Tank D below minimum level", tank: "Tank D", time: "Yesterday, 11:00 AM", status: "Warning" },
];

const statusStyle = {
  Posted: "bg-green-100 text-green-700",
  Saved: "bg-blue-100 text-blue-700",
  Active: "bg-emerald-100 text-emerald-700",
  Warning: "bg-red-100 text-red-700",
};

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => {
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


      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Recent Activity
          </h2>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
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
              {recentActivity.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-slate-700">{row.type}</td>
                  <td className="px-5 py-3.5 text-slate-600">{row.detail}</td>
                  <td className="px-5 py-3.5 text-slate-600">{row.tank}</td>
                  <td className="px-5 py-3.5 text-slate-400 text-xs">{row.time}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyle[row.status]}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
