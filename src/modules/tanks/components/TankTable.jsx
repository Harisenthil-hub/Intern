import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";

export function TankTable({ tanks }) {
  if (tanks.length === 0) {
    return (
      <div className="text-center text-slate-500 border rounded-xl p-10 bg-white shadow-sm">
        No tanks added yet
      </div>
    );
  }

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
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead className="font-semibold">Tank Name</TableHead>
            <TableHead>Gas Type</TableHead>
            <TableHead>Capacity</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {tanks.map((tank, index) => (
            <TableRow key={index} className="hover:bg-slate-50 transition">
              {/* Name */}
              <TableCell className="font-medium text-slate-800">
                {tank.name}
              </TableCell>

              {/* Gas Type */}
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-md text-xs font-medium ${getGasTypeStyle(
                    tank.gasType
                  )}`}
                >
                  {tank.gasType || "—"}
                </span>
              </TableCell>

              {/* Capacity */}
              <TableCell>{tank.capacity}</TableCell>

              {/* Location */}
              <TableCell>{tank.location}</TableCell>

              {/* Status */}
              <TableCell>
                <Badge
                  className={
                    tank.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }
                >
                  {tank.status || "Active"}
                </Badge>
              </TableCell>

              {/* Actions */}
              <TableCell className="text-right space-x-2">
                <Button variant="outline" size="icon">
                  <Pencil className="w-4 h-4" />
                </Button>

                <Button variant="destructive" size="icon">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
