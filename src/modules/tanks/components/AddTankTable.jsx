import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function AddTankModal({ open, setOpen, onAdd }) {
  const [form, setForm] = useState({
    name: "",
    type: "",
    capacity: "",
    location: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.name) return;

    onAdd(form);
    setForm({ name: "", type: "", capacity: "", location: "" });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Tank</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Tank Name</Label>
            <Input name="name" value={form.name} onChange={handleChange} />
          </div>

          <div className="space-y-2 flex gap-4">
            <div className="space-y-2 flex-1/2">
              <Label>Gas Type</Label>
              <Select
                onValueChange={(value) => setForm({ ...form, gasType: value })}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder="Select Gas Type" />
                </SelectTrigger>
                <SelectContent className='w-full'>
                  <SelectItem value="Oxygen">Oxygen</SelectItem>
                  <SelectItem value="Nitrogen">Nitrogen</SelectItem>
                  <SelectItem value="LPG">LPG</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 flex-1/2">
              <Label>Status</Label>
              <Select
                onValueChange={(value) => setForm({ ...form, status: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Capacity</Label>
            <Input
              name="capacity"
              value={form.capacity}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label>Location</Label>
            <Input
              name="location"
              value={form.location}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label>Minimum Level</Label>
            <Input
              name="minLevel"
              value={form.minLevel}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label>Maximum Level</Label>
            <Input
              name="maxLevel"
              value={form.maxLevel}
              onChange={handleChange}
            />
          </div>

          <Button onClick={handleSubmit} className="w-full bg-blue-700">
            Save Tank
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
