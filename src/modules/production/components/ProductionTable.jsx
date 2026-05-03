import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
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

export function ProductionTable({ data, onView }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center text-slate-400 border border-dashed border-slate-200 rounded-xl p-12 bg-white">
        <div className="text-3xl mb-2">🔥</div>
        <p className="font-medium text-slate-500">No production entries yet</p>
        <p className="text-sm text-slate-400 mt-1">Click "+ Add Production" to record the first entry</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 border-b border-slate-200">
            {["Prod. ID", "Date", "Plant", "Gas Type", "Quantity", "Batch No.", "Linked Tank", "Entry", ""].map((h, i) => (
              <TableHead key={i} className={`text-[11px] font-semibold uppercase tracking-wide text-slate-500 py-2.5 ${i === 8 ? "text-right" : ""}`}>
                {h}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, i) => (
            <TableRow key={i} className="hover:bg-orange-50/30 transition-colors border-b border-slate-50 last:border-0">
              <TableCell className="font-mono text-xs text-slate-500 py-2.5">{item.productionId}</TableCell>
              <TableCell className="text-sm font-medium text-slate-700 py-2.5">{item.date || "—"}</TableCell>
              <TableCell className="text-sm text-slate-600 py-2.5">{item.plant || "—"}</TableCell>
              <TableCell className="py-2.5">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${gasColors[item.gasType] || "bg-slate-100 text-slate-600"}`}>
                  {item.gasType || "—"}
                </span>
              </TableCell>
              <TableCell className="text-sm text-slate-700 py-2.5">{item.quantityDisplay || (item.quantity ? `${item.quantity} L` : "—")}</TableCell>
              <TableCell className="text-xs font-mono text-slate-600 py-2.5">{item.batch || "—"}</TableCell>
              <TableCell className="text-xs font-mono text-slate-600 py-2.5">{item.linkedTankId || "—"}</TableCell>
              <TableCell className="py-2.5">
                {item.isPosted === 1 || item.is_posted === 1 ? (
                  <span className="flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full w-fit">
                    <Lock className="w-2.5 h-2.5" /> Posted
                  </span>
                ) : (
                  <span className="text-xs text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-full w-fit block">Saved</span>
                )}
              </TableCell>
              <TableCell className="text-right py-2.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onView && onView(item)}
                  className="gap-1 text-xs h-7 px-2.5 text-orange-600 border-orange-200 hover:bg-orange-50"
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
