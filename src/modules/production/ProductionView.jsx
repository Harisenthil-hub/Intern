import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProductionTable } from "./components/ProductionTable";
import { AddProductionPage } from "./components/AddProductionPage";
import { ViewProductionPage } from "./components/ViewProductionPage";
import { Plus, Flame } from "lucide-react";

const DUMMY_PRODUCTION = [
  { productionId: "PROD-2001", date: "19 Apr 2025", plant: "Plant A", gasType: "Oxygen",   quantity: "1200", quantityUnit: "Liters", quantityDisplay: "1200 Liters", batch: "BATCH-2025-041", linkedTankId: "TK-1001", _mode: "post" },
  { productionId: "PROD-2002", date: "18 Apr 2025", plant: "Plant A", gasType: "Nitrogen",  quantity: "800",  quantityUnit: "Liters", quantityDisplay: "800 Liters",  batch: "BATCH-2025-040", linkedTankId: "TK-1002", _mode: "post" },
  { productionId: "PROD-2003", date: "17 Apr 2025", plant: "Plant B", gasType: "LPG",       quantity: "500",  quantityUnit: "Kg",     quantityDisplay: "500 Kg",      batch: "BATCH-2025-039", linkedTankId: "TK-1003", _mode: "post" },
  { productionId: "PROD-2004", date: "17 Apr 2025", plant: "Plant A", gasType: "Oxygen",   quantity: "950",  quantityUnit: "Liters", quantityDisplay: "950 Liters",  batch: "BATCH-2025-038", linkedTankId: "TK-1001", _mode: "save" },
  { productionId: "PROD-2005", date: "16 Apr 2025", plant: "Plant C", gasType: "Argon",     quantity: "300",  quantityUnit: "m³",     quantityDisplay: "300 m³",      batch: "BATCH-2025-037", linkedTankId: "TK-1005", _mode: "save" },
];

export function ProductionView() {
  const [data, setData] = useState(DUMMY_PRODUCTION);
  const [viewMode, setViewMode] = useState("list"); // list | add | view | edit
  const [selectedItem, setSelectedItem] = useState(null);

  const handleAdd = (entry) => {
    setData((prev) => [...prev, entry]);
    setViewMode("list");
  };

  const handleEdit = (updatedEntry) => {
    setData((prev) =>
      prev.map((d) => (d.productionId === updatedEntry.productionId ? updatedEntry : d))
    );
    setViewMode("list");
  };

  if (viewMode === "add") {
    return <AddProductionPage onAdd={handleAdd} onCancel={() => setViewMode("list")} />;
  }

  if (viewMode === "edit" && selectedItem) {
    return (
      <AddProductionPage
        initialData={selectedItem}
        onAdd={handleEdit}
        onCancel={() => setViewMode("list")}
      />
    );
  }

  if (viewMode === "view") {
    return (
      <ViewProductionPage
        item={selectedItem}
        onBack={() => setViewMode("list")}
        onEdit={(item) => { setSelectedItem(item); setViewMode("edit"); }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-orange-100 p-2 rounded-lg">
            <Flame className="w-4 h-4 text-orange-600" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-800">Production Entries</h2>
            <p className="text-xs text-slate-500">{data.length} entr{data.length !== 1 ? "ies" : "y"} recorded</p>
          </div>
        </div>
        <Button onClick={() => setViewMode("add")} className="bg-orange-500 hover:bg-orange-600 gap-1.5 shadow-sm h-9 text-sm">
          <Plus className="w-4 h-4" /> Add Production
        </Button>
      </div>

      <ProductionTable
        data={data}
        onView={(item) => { setSelectedItem(item); setViewMode("view"); }}
      />
    </div>
  );
}
