import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { TankTable } from "./components/TankTable";
import { AddTankPage } from "./components/AddTankPage";
import { ViewTankPage } from "./components/ViewTankPage";
import { Plus, Container } from "lucide-react";



export function TankMasterView() {
  const [tanks, setTanks] = useState([]);
  const [viewMode, setViewMode] = useState("list"); // list | add | view | edit
  const [selectedTank, setSelectedTank] = useState(null);

  const calculateNextId = (prefix, list, idField) => {
    if (!list || list.length === 0) return `${prefix}-1001`;
    const ids = list.map(item => {
      const parts = (item[idField] || "").split("-");
      return parts.length === 2 ? parseInt(parts[1], 10) : 0;
    }).filter(n => !isNaN(n));
    const max = Math.max(1000, ...ids);
    return `${prefix}-${max + 1}`;
  };

  const fetchTanks = () => {
    fetchApi("/tanks").then(setTanks).catch(console.error);
  };

  useEffect(() => {
    fetchTanks();
  }, []);

  const handleAddTank = async (tank) => {
    try {
      if (tank.tankId && tank.tankId.startsWith("TK-") && !tank.tankId.includes("100")) {
         // The logic for detecting new tank might be tricky if we use dummy IDs, 
         // but wait, if it's edit, it comes from handleEditTank.
      }
      await fetchApi("/tanks", {
        method: "POST",
        body: JSON.stringify({
          ...tank,
          capacity_value: Number(tank.capacityValue),
          capacity_unit: tank.capacityUnit,
          min_level: tank.minLevel ? Number(tank.minLevel) : null,
          max_level: tank.maxLevel ? Number(tank.maxLevel) : null,
          gas_type: tank.gasType,
          calibration_ref: tank.calibrationRef,
          is_posted: tank.isPosted,
        })
      });
      fetchTanks();
      setViewMode("list");
    } catch (e) { console.error(e); }
  };

  const handleEditTank = async (updatedTank) => {
    try {
      await fetchApi(`/tanks/${updatedTank.tank_id || updatedTank.tankId}`, {
        method: "PUT",
        body: JSON.stringify({
          ...updatedTank,
          capacity_value: Number(updatedTank.capacityValue || updatedTank.capacity_value),
          capacity_unit: updatedTank.capacityUnit || updatedTank.capacity_unit,
          min_level: updatedTank.minLevel ? Number(updatedTank.minLevel) : null,
          max_level: updatedTank.maxLevel ? Number(updatedTank.maxLevel) : null,
          gas_type: updatedTank.gasType || updatedTank.gas_type,
          calibration_ref: updatedTank.calibrationRef || updatedTank.calibration_ref,
          is_posted: updatedTank.isPosted !== undefined ? updatedTank.isPosted : updatedTank.is_posted,
        })
      });
      fetchTanks();
      setViewMode("list");
    } catch (e) { console.error(e); }
  };

  if (viewMode === "add") {
    return <AddTankPage nextId={calculateNextId("TK", tanks, "tank_id")} onAdd={handleAddTank} onCancel={() => setViewMode("list")} />;
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
