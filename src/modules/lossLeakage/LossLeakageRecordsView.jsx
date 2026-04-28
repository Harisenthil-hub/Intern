import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Lock, Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLossLeakageStore } from "./LossLeakageStore";

const statusBadgeClass = (status) =>
  status === "posted" ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-700";

export function LossLeakageRecordsView() {
  const navigate = useNavigate();
  const { records } = useLossLeakageStore();
  const [selectedRecord, setSelectedRecord] = useState(null);

  return (
    <section className="mx-auto w-full max-w-7xl">
      <header className="mb-6 flex items-center justify-end gap-3">
        <Button
          type="button"
          className="h-9 bg-blue-700 px-4 hover:bg-blue-800"
          onClick={() => navigate("/loss-leakage-monitoring/new")}
        >
          <Plus className="size-4" />
          Add Record
        </Button>
      </header>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        {records.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-slate-500">
            No records available
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-100/90 hover:bg-slate-100/90">
                <TableHead className="px-4 py-3">Record ID</TableHead>
                <TableHead className="px-4 py-3">Tank ID</TableHead>
                <TableHead className="px-4 py-3">Date</TableHead>
                <TableHead className="px-4 py-3">Expected Quantity</TableHead>
                <TableHead className="px-4 py-3">Actual Quantity</TableHead>
                <TableHead className="px-4 py-3">Loss Quantity</TableHead>
                <TableHead className="px-4 py-3">Reason</TableHead>
                <TableHead className="px-4 py-3">Status</TableHead>
                <TableHead className="px-4 py-3">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id} className="transition-colors hover:bg-slate-50">
                  <TableCell className="px-4 py-3 font-medium text-slate-800">
                    {record.id}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-slate-700">{record.tankId}</TableCell>
                  <TableCell className="px-4 py-3 text-slate-700">{record.date}</TableCell>
                  <TableCell className="px-4 py-3 text-slate-700">
                    {record.expectedQuantity}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-slate-700">
                    {record.actualQuantity}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-slate-700">
                    {record.lossQuantity}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-slate-700">
                    {record.reason || "--"}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Badge className={statusBadgeClass(record.status)}>
                      {record.status === "posted" ? "Posted" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-slate-700"
                        onClick={() => setSelectedRecord(record)}
                      >
                        <Eye className="size-3.5" />
                        View
                      </Button>

                      {record.status === "draft" ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="text-slate-700"
                          onClick={() => navigate(`/loss-leakage-monitoring/${record.id}/edit`)}
                        >
                          <Pencil className="size-3.5" />
                          Edit
                        </Button>
                      ) : (
                        <Button type="button" variant="outline" size="sm" disabled>
                          <Lock className="size-3.5" />
                          Locked
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog
        open={Boolean(selectedRecord)}
        onOpenChange={(isOpen) => {
          if (!isOpen) setSelectedRecord(null);
        }}
      >
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Loss / Leakage Record Details</DialogTitle>
            <DialogDescription>
              Review the selected loss or leakage record before closing the dialog.
            </DialogDescription>
          </DialogHeader>

          {selectedRecord ? (
            <div className="space-y-4 text-sm text-slate-700">
              <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="grid gap-2 sm:grid-cols-2">
                  <p>
                    <span className="font-medium text-slate-900">Record ID:</span>{" "}
                    {selectedRecord.id}
                  </p>
                  <p>
                    <span className="font-medium text-slate-900">Tank ID:</span>{" "}
                    {selectedRecord.tankId}
                  </p>
                  <p>
                    <span className="font-medium text-slate-900">Date:</span>{" "}
                    {selectedRecord.date}
                  </p>
                  <p>
                    <span className="font-medium text-slate-900">Expected Quantity:</span>{" "}
                    {selectedRecord.expectedQuantity}
                  </p>
                  <p>
                    <span className="font-medium text-slate-900">Actual Quantity:</span>{" "}
                    {selectedRecord.actualQuantity}
                  </p>
                  <p>
                    <span className="font-medium text-slate-900">Loss Quantity:</span>{" "}
                    {selectedRecord.lossQuantity}
                  </p>
                  <p>
                    <span className="font-medium text-slate-900">Reason:</span>{" "}
                    {selectedRecord.reason || "--"}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-medium text-slate-900">Status:</span>
                    <Badge className={statusBadgeClass(selectedRecord.status)}>
                      {selectedRecord.status === "posted" ? "Posted" : "Draft"}
                    </Badge>
                  </p>
                </div>
              </section>
            </div>
          ) : null}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedRecord(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}

export default LossLeakageRecordsView;
