import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AddProductionModal } from "./components/AddProductionModal";
import { ProductionTable } from "./components/ProductionTable";

export function ProductionView() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);

  const handleAdd = (entry) => {
    setData((prev) => [...prev, entry]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold">Gas Production</h2>

        <Button onClick={() => setOpen(true)} className='bg-blue-700' >+ Add Production</Button>
      </div>

      <ProductionTable data={data} />

      <AddProductionModal open={open} setOpen={setOpen} onAdd={handleAdd} />
    </div>
  );
}
