import { Button } from "@/components/ui/button";
import { ArrowLeft, Container, Lock, Pencil, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

const statusStyle = {
  Active:      "bg-green-100 text-green-700 border border-green-200",
  Inactive:    "bg-red-100 text-red-700 border border-red-200",
  Maintenance: "bg-yellow-100 text-yellow-700 border border-yellow-200",
};
const gasColors = {
  Oxygen:   "bg-blue-100 text-blue-700",
  Nitrogen: "bg-purple-100 text-purple-700",
  LPG:      "bg-orange-100 text-orange-700",
  CO2:      "bg-slate-200 text-slate-700",
  Argon:    "bg-indigo-100 text-indigo-700",
  Hydrogen: "bg-sky-100 text-sky-700",
};

function Row({ label, value }) {
  return (
    <div className="flex items-start py-2 border-b border-slate-50 last:border-0">
      <span className="w-40 shrink-0 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
      <span className="text-sm text-slate-800 font-medium">{value || <span className="text-slate-400 font-normal italic text-xs">Not set</span>}</span>
    </div>
  );
}

export function ViewTankPage({ tank, onBack, onEdit }) {
  if (!tank) return null;
  const isPosted = tank._mode === "post";

  return (
    <div className="grid grid-cols-3 gap-5">
      {/* ── Left: Details (2/3) ── */}
      <div className="col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 shrink-0">
          <div className="bg-white/20 rounded-lg p-1.5">
            <Container className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">{tank.name}</h2>
            <p className="text-blue-100 text-xs">Tank Master Detail View</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {isPosted ? (
              <span className="flex items-center gap-1 bg-white/20 text-white text-xs px-2.5 py-1 rounded-full font-medium">
                <Lock className="w-3 h-3" /> Posted
              </span>
            ) : (
              <span className="bg-yellow-400 text-yellow-900 text-xs px-2.5 py-1 rounded-full font-semibold">
                Draft
              </span>
            )}
            <span className="bg-white/20 text-white text-xs px-2.5 py-1 rounded-full font-mono">{tank.tankId}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 px-5 pt-4 pb-1">
          {tank.gasType && (
            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${gasColors[tank.gasType] || "bg-slate-100 text-slate-700"}`}>
              {tank.gasType}
            </span>
          )}
          {tank.status && (
            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusStyle[tank.status] || ""}`}>
              {tank.status}
            </span>
          )}
        </div>

        {/* Detail rows */}
        <div className="px-5 pb-3 flex-1">
          <div className="grid grid-cols-2 gap-x-10 mt-2">
            <div>
              <Row label="Tank ID" value={tank.tankId} />
              <Row label="Tank Name" value={tank.name} />
              <Row label="Gas Type" value={tank.gasType} />
              <Row label="Capacity" value={tank.capacity} />
            </div>
            <div>
              <Row label="Location" value={tank.location} />
              <Row label="Min Level" value={tank.minLevel ? `${tank.minLevel} ${tank.capacityUnit || ""}` : null} />
              <Row label="Max Level" value={tank.maxLevel ? `${tank.maxLevel} ${tank.capacityUnit || ""}` : null} />
              <Row label="Calibration Ref" value={tank.calibrationRef} />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 bg-slate-50 shrink-0">
          <Button variant="outline" size="sm" onClick={onBack} className="gap-1.5 h-8">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to List
          </Button>
          {!isPosted && onEdit && (
            <Button size="sm" onClick={() => onEdit(tank)} className="bg-blue-600 hover:bg-blue-700 gap-1.5 h-8">
              <Pencil className="w-3.5 h-3.5" /> Edit Tank
            </Button>
          )}
        </div>
      </div>

      {/* ── Right: Status panel (1/3) ── */}
      <div className="col-span-1 space-y-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Entry Status</p>
          {isPosted ? (
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <Lock className="w-5 h-5 text-slate-500 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-slate-700">Posted & Locked</p>
                <p className="text-xs text-slate-500 mt-0.5">This record is finalized and cannot be modified</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <Pencil className="w-5 h-5 text-yellow-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-yellow-800">Draft</p>
                <p className="text-xs text-yellow-700 mt-0.5">This record can still be edited or posted</p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-2.5">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Specifications</p>
          {[
            { label: "Capacity", value: tank.capacity },
            { label: "Min Level", value: tank.minLevel ? `${tank.minLevel} ${tank.capacityUnit || "L"}` : "—" },
            { label: "Max Level", value: tank.maxLevel ? `${tank.maxLevel} ${tank.capacityUnit || "L"}` : "—" },
            { label: "Location", value: tank.location },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-center text-sm py-1 border-b border-slate-50 last:border-0">
              <span className="text-xs text-slate-500">{label}</span>
              <span className="text-xs font-semibold text-slate-700">{value || "—"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
