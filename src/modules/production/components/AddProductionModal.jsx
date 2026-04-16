import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { format } from "date-fns";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AddProductionModal({ open, setOpen, onAdd }) {
  const [form, setForm] = useState({
    date: "",
    plant: "",
    gasType: "",
    quantity: "",
    batch: "",
    tank: "",
  });
  const [date, setDate] = useState();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.quantity) return;

    onAdd(form);
    setOpen(false);
    setForm({
      date: "",
      plant: "",
      gasType: "",
      quantity: "",
      batch: "",
      tank: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Production Entry</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Date</Label>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left"
                >
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label>Plant</Label>
            <Input name="plant" onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <Label>Gas Type</Label>

            <Select
              onValueChange={(value) => setForm({ ...form, gasType: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Gas Type" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="Oxygen">Oxygen</SelectItem>
                <SelectItem value="Nitrogen">Nitrogen</SelectItem>
                <SelectItem value="LPG">LPG</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Quantity</Label>
            <Input name="quantity" onChange={handleChange} />
          </div>

          <div>
            <Label>Batch</Label>
            <Input name="batch" onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <Label>Tank</Label>

            <Select
              onValueChange={(value) => setForm({ ...form, tank: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Tank" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="Tank A">Tank A</SelectItem>
                <SelectItem value="Tank B">Tank B</SelectItem>
                <SelectItem value="Tank C">Tank C</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSubmit} className="w-full bg-blue-700">
            Save Production
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
