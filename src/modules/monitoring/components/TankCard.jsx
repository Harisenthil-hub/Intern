import { useState } from "react";
import { LevelEntryModal } from "./LevelEntryModal";

export function TankCard({ tank, onUpdate }) {
  const [open, setOpen] = useState(false);

  const percentage = Math.round((tank.level / tank.capacity) * 100);

  const getColor = () => {
    if (percentage < 30) return "bg-red-500";
    if (percentage < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getTextColor = () => {
    if (percentage < 30) return "text-red-600";
    if (percentage < 70) return "text-yellow-600";
    return "text-green-600";
  };

  const getGasTypeStyle = (type) => {
    switch (type) {
      case "Oxygen":
        return "bg-blue-100 text-blue-700";
      case "Nitrogen":
        return "bg-purple-100 text-purple-700";
      case "LPG":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{tank.name}</h3>

          {/* Gas Type Badge */}
          <span
            className={`text-xs px-2 py-1 rounded-md ${getGasTypeStyle(
              tank.gasType
            )}`}
          >
            {tank.gasType}
          </span>
        </div>

        <div className={`font-bold ${getTextColor()}`}>{percentage}%</div>
      </div>

      {/* Progress */}
      <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
        <div
          className={`${getColor()} h-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Info */}
      <div className="text-sm text-slate-600">
        <p>Capacity: {tank.capacity} L</p>
        <p>Current Level: {tank.level} L</p>
      </div>

      {/* Action */}
      <button
        onClick={() => setOpen(true)}
        className="text-sm text-blue-600 hover:underline"
      >
        + Add Entry
      </button>

      {/* Modal */}
      <LevelEntryModal
        open={open}
        setOpen={setOpen}
        tank={tank}
        onUpdate={onUpdate}
      />
    </div>
  );
}
