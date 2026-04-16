import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function LevelEntryModal({ open, setOpen, tank, onUpdate }) {
  const [form, setForm] = useState({
    opening: tank.level,
    added: "",
    issued: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const closing =
    Number(form.opening || 0) +
    Number(form.added || 0) -
    Number(form.issued || 0);

  const handleSubmit = () => {
    onUpdate({ ...tank, level: closing });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Tank Level</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Opening Level</Label>
            <Input name="opening" value={form.opening} disabled />
          </div>

          <div className="space-y-2">
            <Label>Quantity Added</Label>
            <Input name="added" onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <Label>Quantity Issued</Label>
            <Input name="issued" onChange={handleChange} />
          </div>

          <div className="text-sm font-medium text-blue-600">
            Closing Level: {closing} L
          </div>

          <Button onClick={handleSubmit} className="w-full bg-blue-700">
            Save Entry
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
