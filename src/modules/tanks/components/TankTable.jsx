import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Lock } from "lucide-react";

const gasColors = {
  Oxygen:   "bg-blue-100 text-blue-700",
  Nitrogen: "bg-purple-100 text-purple-700",
  LPG:      "bg-orange-100 text-orange-700",
  CO2:      "bg-slate-200 text-slate-700",
  Argon:    "bg-indigo-100 text-indigo-700",
  Hydrogen: "bg-sky-100 text-sky-700",
};

const statusStyle = {
  Active:      "bg-green-100 text-green-700",
  Inactive:    "bg-red-100 text-red-700",
  Maintenance: "bg-yellow-100 text-yellow-700",
};

export function TankTable({ tanks, onView }) {
  if (!tanks || tanks.length === 0) {
    return (
      <div className="text-center text-slate-400 border border-dashed border-slate-200 rounded-xl p-12 bg-white">
        <div className="text-3xl mb-2">🛢️</div>
        <p className="font-medium text-slate-500">No tanks registered yet</p>
        <p className="text-sm text-slate-400 mt-1">Click "+ Add Tank" to get started</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 border-b border-slate-200">
            {["Tank ID", "Tank Name", "Gas Type", "Capacity", "Location", "Min", "Max", "Status", "Entry", ""].map((h, i) => (
              <TableHead key={i} className={`text-[11px] font-semibold uppercase tracking-wide text-slate-500 py-2.5 ${i === 9 ? "text-right" : ""}`}>
                {h}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tanks.map((tank, index) => (
            <TableRow key={index} className="hover:bg-blue-50/40 transition-colors border-b border-slate-50 last:border-0">
              <TableCell className="font-mono text-xs text-slate-500 py-2.5">{tank.tankId}</TableCell>
              <TableCell className="font-semibold text-sm text-slate-800 py-2.5">{tank.name}</TableCell>
              <TableCell className="py-2.5">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${gasColors[tank.gasType] || "bg-slate-100 text-slate-600"}`}>
                  {tank.gasType || "—"}
                </span>
              </TableCell>
              <TableCell className="text-sm text-slate-700 py-2.5">{tank.capacity || "—"}</TableCell>
              <TableCell className="text-sm text-slate-600 py-2.5">{tank.location || "—"}</TableCell>
              <TableCell className="text-sm text-slate-600 py-2.5">{tank.minLevel || "—"}</TableCell>
              <TableCell className="text-sm text-slate-600 py-2.5">{tank.maxLevel || "—"}</TableCell>
              <TableCell className="py-2.5">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusStyle[tank.status] || "bg-slate-100 text-slate-600"}`}>
                  {tank.status || "Active"}
                </span>
              </TableCell>
              <TableCell className="py-2.5">
                {tank._mode === "post" ? (
                  <span className="flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full w-fit">
                    <Lock className="w-2.5 h-2.5" /> Posted
                  </span>
                ) : (
                  <span className="text-xs text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-full w-fit block">
                    Draft
                  </span>
                )}
              </TableCell>
              <TableCell className="text-right py-2.5">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => onView && onView(tank)}
                  className="gap-1 text-xs h-7 px-2.5 text-blue-600 border-blue-200 hover:bg-blue-50 cursor-pointer"
                >
                  <Eye className="w-3 h-3" /> View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
