import { useState } from "react";
import { TankCard } from "./components/TankCard";

export function MonitoringView() {
  const [tanks, setTanks] = useState([
    { name: "Tank A", capacity: 1000, level: 700, gasType: "Oxygen" },
    { name: "Tank B", capacity: 1000, level: 200, gasType: "Nitrogen" },
    { name: "Tank B", capacity: 1000, level: 200, gasType: "LPG" },
  ]);

  const handleUpdate = (updatedTank) => {
    setTanks((prev) =>
      prev.map((t) => (t.name === updatedTank.name ? updatedTank : t))
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tanks.map((tank, index) => (
        <TankCard key={index} tank={tank} onUpdate={handleUpdate} />
      ))}
    </div>
  );
}
