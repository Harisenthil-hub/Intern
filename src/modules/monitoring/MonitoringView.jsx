import { useState } from "react";
import { TankCard } from "./components/TankCard";
import { AddLevelEntryPage } from "./components/AddLevelEntryPage";
import { Droplets, AlertTriangle, Lock, Pencil, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

const INITIAL_TANKS = [
  { tankId: "TK-1001", name: "Oxygen Storage Unit 1", capacity: 5000, level: 3900, gasType: "Oxygen",  location: "Plant A - Zone 1" },
  { tankId: "TK-1002", name: "Nitrogen Reserve Tank",  capacity: 8000, level: 1800, gasType: "Nitrogen",location: "Plant A - Zone 2" },
  { tankId: "TK-1003", name: "LPG Storage Vessel A",   capacity: 3000, level: 800,  gasType: "LPG",     location: "Plant B - Zone 1" },
];

const INITIAL_ENTRIES = [
  { entryId: "ENT-3001", tankId: "TK-1001", datetime: "19 Apr 2025", openingLevel: "4000", quantityAdded: "0",   quantityIssued: "500",  closingLevel: 3500, measurementMethod: "Sensor",      _mode: "post" },
  { entryId: "ENT-3002", tankId: "TK-1002", datetime: "18 Apr 2025", openingLevel: "2200", quantityAdded: "0",   quantityIssued: "400",  closingLevel: 1800, measurementMethod: "Manual Dip",  _mode: "post" },
  { entryId: "ENT-3003", tankId: "TK-1003", datetime: "18 Apr 2025", openingLevel: "1100", quantityAdded: "200", quantityIssued: "500",  closingLevel: 800,  measurementMethod: "Flow Meter",  _mode: "post" },
  { entryId: "ENT-3004", tankId: "TK-1001", datetime: "17 Apr 2025", openingLevel: "4500", quantityAdded: "0",   quantityIssued: "500",  closingLevel: 4000, measurementMethod: "Manual Dip",  _mode: "save" },
];

export function MonitoringView() {
  const [tanks, setTanks] = useState(INITIAL_TANKS);
  const [entries, setEntries] = useState(INITIAL_ENTRIES);
  const [viewMode, setViewMode] = useState("grid"); // grid | add | edit
  const [selectedTank, setSelectedTank] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);

  const handleUpdate = (updatedTank) => {
    const entry = updatedTank._entry;
    if (entry) {
      if (selectedEntry) {
        // editing existing entry
        setEntries((prev) => prev.map((e) => e.entryId === entry.entryId ? entry : e));
      } else {
        setEntries((prev) => [...prev, entry]);
      }
      setTanks((prev) =>
        prev.map((t) => (t.tankId === updatedTank.tankId ? { ...t, level: updatedTank.level } : t))
      );
    }
    setViewMode("grid");
    setSelectedEntry(null);
  };

  if ((viewMode === "add" || viewMode === "edit") && selectedTank) {
    return (
      <AddLevelEntryPage
        tank={selectedTank}
        initialData={viewMode === "edit" ? selectedEntry : null}
        onUpdate={handleUpdate}
        onCancel={() => { setViewMode("grid"); setSelectedEntry(null); }}
      />
    );
  }

  const lowAlerts = tanks.filter(t => t.capacity && (t.level / t.capacity) < 0.25).length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-teal-100 p-2 rounded-lg">
            <Droplets className="w-4 h-4 text-teal-700" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-800">Tank Level Monitoring</h2>
            <p className="text-xs text-slate-500">{tanks.length} tanks · {entries.length} level entries</p>
          </div>
        </div>
        {lowAlerts > 0 && (
          <div className="flex items-center gap-2 bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg text-xs font-medium">
            <AlertTriangle className="w-3.5 h-3.5" />
            {lowAlerts} critically low
          </div>
        )}
      </div>

      {/* Tank cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {tanks.map((tank, index) => (
          <TankCard
            key={index}
            tank={tank}
            onAddEntry={(t) => { setSelectedTank(t); setSelectedEntry(null); setViewMode("add"); }}
          />
        ))}
      </div>

      {/* Entry Log */}
      <div>
        <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-2">Entry Log</h3>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["Entry ID", "Tank", "Date", "Opening", "Added", "Issued", "Closing", "Method", "Status", ""].map((h, i) => (
                  <th key={i} className={`text-left px-4 py-2.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wide ${i === 9 ? "text-right" : ""}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {entries.map((entry, i) => (
                <tr key={i} className="hover:bg-teal-50/30 transition-colors">
                  <td className="px-4 py-2.5 font-mono text-xs text-slate-500">{entry.entryId}</td>
                  <td className="px-4 py-2.5 text-xs font-mono text-slate-600">{entry.tankId}</td>
                  <td className="px-4 py-2.5 text-sm text-slate-700">{entry.datetime}</td>
                  <td className="px-4 py-2.5 text-sm">{entry.openingLevel} L</td>
                  <td className="px-4 py-2.5 text-sm text-green-700">+{entry.quantityAdded} L</td>
                  <td className="px-4 py-2.5 text-sm text-red-600">−{entry.quantityIssued} L</td>
                  <td className="px-4 py-2.5 text-sm font-semibold text-teal-700">{entry.closingLevel} L</td>
                  <td className="px-4 py-2.5 text-xs text-slate-500">{entry.measurementMethod}</td>
                  <td className="px-4 py-2.5">
                    {entry._mode === "post" ? (
                      <span className="flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full w-fit">
                        <Lock className="w-2.5 h-2.5" /> Posted
                      </span>
                    ) : (
                      <span className="text-xs text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-full w-fit block">Draft</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    {entry._mode !== "post" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 text-xs h-7 px-2.5 text-teal-600 border-teal-200 hover:bg-teal-50"
                        onClick={() => {
                          const t = tanks.find(tk => tk.tankId === entry.tankId);
                          setSelectedTank(t || tanks[0]);
                          setSelectedEntry(entry);
                          setViewMode("edit");
                        }}
                      >
                        <Pencil className="w-3 h-3" /> Edit
                      </Button>
                    ) : (
                      <span className="text-xs text-slate-300 px-2">—</span>
                    )}
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
