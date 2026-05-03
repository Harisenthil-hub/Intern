import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ProductionTable } from "./components/ProductionTable";
import { AddProductionPage } from "./components/AddProductionPage";
import { ViewProductionPage } from "./components/ViewProductionPage";
import { Plus, Flame } from "lucide-react";



export function ProductionView() {
  const [data, setData] = useState([]);
  const [viewMode, setViewMode] = useState("list"); // list | add | view | edit
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchProduction = async () => {
    try {
      const result = await fetchApi("/production");
      setData(result.map(p => ({
        ...p,
        productionId: p.production_id,
        gasType: p.gas_type,
        quantityUnit: p.quantity_unit,
        quantityDisplay: p.quantity_display,
        linkedTankId: p.linked_tank_id,
        isPosted: p.is_posted
      })));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchProduction();
  }, []);

  const calculateNextId = (prefix, list, idField) => {
    if (!list || list.length === 0) return `${prefix}-2001`;
    const ids = list.map(item => {
      const parts = (item[idField] || "").split("-");
      return parts.length === 2 ? parseInt(parts[1], 10) : 0;
    }).filter(n => !isNaN(n));
    const max = Math.max(2000, ...ids);
    return `${prefix}-${max + 1}`;
  };

  const handleAdd = async (entry) => {
    try {
      const parsedDate = new Date(entry.date);
      const isoDate = !isNaN(parsedDate) 
        ? `${parsedDate.getFullYear()}-${String(parsedDate.getMonth() + 1).padStart(2, '0')}-${String(parsedDate.getDate()).padStart(2, '0')}`
        : entry.date;

      await fetchApi("/production", {
        method: "POST",
        body: JSON.stringify({
          ...entry,
          date: isoDate,
          production_id: entry.productionId,
          gas_type: entry.gasType,
          quantity_unit: entry.quantityUnit,
          linked_tank_id: entry.linkedTankId || null,
          is_posted: entry.isPosted,
        })
      });
      fetchProduction();
      setViewMode("list");
    } catch (e) { console.error(e); }
  };

  const handleEdit = async (updatedEntry) => {
    try {
      const parsedDate = new Date(updatedEntry.date);
      const isoDate = !isNaN(parsedDate) 
        ? `${parsedDate.getFullYear()}-${String(parsedDate.getMonth() + 1).padStart(2, '0')}-${String(parsedDate.getDate()).padStart(2, '0')}`
        : updatedEntry.date;

      await fetchApi(`/production/${updatedEntry.production_id || updatedEntry.productionId}`, {
        method: "PUT",
        body: JSON.stringify({
          ...updatedEntry,
          date: isoDate,
          production_id: updatedEntry.productionId || updatedEntry.production_id,
          gas_type: updatedEntry.gasType || updatedEntry.gas_type,
          quantity_unit: updatedEntry.quantityUnit || updatedEntry.quantity_unit,
          linked_tank_id: updatedEntry.linkedTankId || null,
          is_posted: updatedEntry.isPosted !== undefined ? updatedEntry.isPosted : updatedEntry.is_posted,
        })
      });
      fetchProduction();
      setViewMode("list");
    } catch (e) { console.error(e); }
  };

  if (viewMode === "add") {
    return <AddProductionPage nextId={calculateNextId("PROD", data, "production_id")} onAdd={handleAdd} onCancel={() => setViewMode("list")} />;
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
