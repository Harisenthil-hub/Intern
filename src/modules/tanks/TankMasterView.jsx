import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AddTankModal } from "./components/AddTankTable";
import { TankTable } from "./components/TankTable";

export function TankMasterView() {
  const [tanks, setTanks] = useState([]);
  const [open, setOpen] = useState(false);

  const handleAddTank = (tank) => {
    setTanks((prev) => [...prev, tank]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-end">
        <Button onClick={() => setOpen(true)} className='bg-blue-700'>+ Add Tank</Button>
      </div>

      {/* Table */}
      <TankTable tanks={tanks} />

      {/* Modal */}
      <AddTankModal open={open} setOpen={setOpen} onAdd={handleAddTank} />
    </div>
  );
}
