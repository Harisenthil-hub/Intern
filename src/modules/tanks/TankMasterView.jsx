import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TankTable } from "./components/TankTable";
import { AddTankPage } from "./components/AddTankPage";
import { ViewTankPage } from "./components/ViewTankPage";
import { Plus, Container } from "lucide-react";

const DUMMY_TANKS = [
  { tankId: "TK-1001", name: "Oxygen Storage Unit 1", gasType: "Oxygen",   capacity: "5000 Liters",  capacityValue: "5000", capacityUnit: "Liters", location: "Plant A - Zone 1", minLevel: "500",  maxLevel: "4800", calibrationRef: "CAL-2024-001", status: "Active",      _mode: "post" },
  { tankId: "TK-1002", name: "Nitrogen Reserve Tank", gasType: "Nitrogen", capacity: "8000 Liters",  capacityValue: "8000", capacityUnit: "Liters", location: "Plant A - Zone 2", minLevel: "800",  maxLevel: "7500", calibrationRef: "CAL-2024-002", status: "Active",      _mode: "post" },
  { tankId: "TK-1003", name: "LPG Storage Vessel A",  gasType: "LPG",     capacity: "3000 Kg",      capacityValue: "3000", capacityUnit: "Kg",     location: "Plant B - Zone 1", minLevel: "300",  maxLevel: "2800", calibrationRef: "",             status: "Active",      _mode: "post" },
  { tankId: "TK-1004", name: "CO₂ Bulk Tank",         gasType: "CO2",     capacity: "2500 Liters",  capacityValue: "2500", capacityUnit: "Liters", location: "Plant B - Zone 3", minLevel: "250",  maxLevel: "2400", calibrationRef: "CAL-2024-004", status: "Maintenance", _mode: "save" },
  { tankId: "TK-1005", name: "Argon Cylinder Bank",   gasType: "Argon",   capacity: "1200 m³",      capacityValue: "1200", capacityUnit: "m³",     location: "Plant C",          minLevel: "100",  maxLevel: "1150", calibrationRef: "",             status: "Active",      _mode: "save" },
];

export function TankMasterView() {
  const [tanks, setTanks] = useState(DUMMY_TANKS);
  const [viewMode, setViewMode] = useState("list"); // list | add | view | edit
  const [selectedTank, setSelectedTank] = useState(null);

  const handleAddTank = (tank) => {
    setTanks((prev) => [...prev, tank]);
    setViewMode("list");
  };

  const handleEditTank = (updatedTank) => {
    setTanks((prev) =>
      prev.map((t) => (t.tankId === updatedTank.tankId ? updatedTank : t))
    );
    setViewMode("list");
  };

  if (viewMode === "add") {
    return <AddTankPage onAdd={handleAddTank} onCancel={() => setViewMode("list")} />;
  }

  if (viewMode === "edit" && selectedTank) {
    return (
      <AddTankPage
        initialData={selectedTank}
        onAdd={handleEditTank}
        onCancel={() => setViewMode("list")}
      />
    );
  }

  if (viewMode === "view") {
    return (
      <ViewTankPage
        tank={selectedTank}
        onBack={() => setViewMode("list")}
        onEdit={(tank) => {
          setSelectedTank(tank);
          setViewMode("edit");
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Container className="w-4 h-4 text-blue-700" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-800">Storage Tanks</h2>
            <p className="text-xs text-slate-500">{tanks.length} tank{tanks.length !== 1 ? "s" : ""} registered</p>
          </div>
        </div>
        <Button onClick={() => setViewMode("add")} className="bg-blue-600 hover:bg-blue-700 gap-1.5 shadow-sm h-9 text-sm">
          <Plus className="w-4 h-4" /> Add Tank
        </Button>
      </div>

      <TankTable
        tanks={tanks}
        onView={(tank) => { setSelectedTank(tank); setViewMode("view"); }}
      />
    </div>
  );
}
