import { useState } from "react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Container, Save, Send, X, Pencil, Info, CheckCircle2 } from "lucide-react";

let tankCounter = 1005;


function F({ label, name, placeholder, optional, type = "text", value, onChange, error }) {
  return (
    <div className="space-y-1">
      <Label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
        {label}
        {optional && <span className="ml-1 text-slate-400 normal-case tracking-normal font-normal text-xs">(optional)</span>}
      </Label>
      <Input
        name={name}
        type={type}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        className={`h-9 text-sm ${error ? "border-red-400 focus-visible:ring-red-300" : ""}`}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function SL({ label, name, children, defaultVal, value, onValueChange, error, placeholder }) {
  return (
    <div className="space-y-1">
      <Label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{label}</Label>
      <Select value={value || defaultVal} onValueChange={(v) => onValueChange(name, v)}>
        <SelectTrigger className={`h-9 text-sm ${error ? "border-red-400" : ""}`}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export function AddTankPage({ onAdd, onCancel, initialData = null }) {
  const isEdit = !!initialData;
  const [form, setForm] = useState(
    initialData
      ? { ...initialData }
      : {
          tankId: `TK-${++tankCounter}`,
          name: "",
          gasType: "",
          capacityValue: "",
          capacityUnit: "Liters",
          location: "",
          minLevel: "",
          maxLevel: "",
          calibrationRef: "",
          status: "Active",
        }
  );
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSelect = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name?.trim()) e.name = "Tank name is required";
    if (!form.gasType) e.gasType = "Gas type is required";
    if (!form.capacityValue && !form.capacity) e.capacityValue = "Capacity is required";
    if (!form.location?.trim()) e.location = "Location is required";
    return e;
  };

  const handleSubmit = (mode) => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onAdd({
      ...form,
      capacity: form.capacityValue ? `${form.capacityValue} ${form.capacityUnit}` : form.capacity,
      _mode: mode,
    });
  };

  const fProps = (name) => ({ name, value: form[name], onChange: handleChange, error: errors[name] });
  const slProps = (name) => ({ name, value: form[name], onValueChange: handleSelect, error: errors[name] });

  return (
    <div className="grid grid-cols-3 gap-5 h-full">
      {/* ── Left: Form (2/3 width) ── */}
      <div className="col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 shrink-0">
          <div className="bg-white/20 rounded-lg p-1.5">
            {isEdit ? <Pencil className="w-4 h-4 text-white" /> : <Container className="w-4 h-4 text-white" />}
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">
              {isEdit ? `Edit Tank — ${form.name}` : "Register New Tank"}
            </h2>
            <p className="text-blue-100 text-xs">
              {isEdit ? "Update fields below. Save keeps it as Draft; Post locks the record." : "Fill all required fields to register a storage tank"}
            </p>
          </div>
          <span className="ml-auto bg-white/20 text-white text-xs px-2.5 py-1 rounded-full font-mono">{form.tankId}</span>
        </div>

        {/* Form fields */}
        <div className="p-5 space-y-4 flex-1">
          <div className="grid grid-cols-2 gap-4">
            <F label="Tank Name *" placeholder="e.g. Oxygen Storage Unit 1" {...fProps("name")} />
            <SL label="Gas Type *" placeholder="Select gas type" {...slProps("gasType")}>
              <SelectItem value="Oxygen">Oxygen (O₂)</SelectItem>
              <SelectItem value="Nitrogen">Nitrogen (N₂)</SelectItem>
              <SelectItem value="LPG">LPG</SelectItem>
              <SelectItem value="CO2">Carbon Dioxide (CO₂)</SelectItem>
              <SelectItem value="Argon">Argon (Ar)</SelectItem>
              <SelectItem value="Hydrogen">Hydrogen (H₂)</SelectItem>
            </SL>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <F label="Capacity *" placeholder="e.g. 5000" type="number" {...fProps("capacityValue")} />
            <SL label="Unit" defaultVal="Liters" {...slProps("capacityUnit")}>
              <SelectItem value="Liters">Liters (L)</SelectItem>
              <SelectItem value="Kg">Kilograms (Kg)</SelectItem>
              <SelectItem value="m³">Cubic Meters (m³)</SelectItem>
            </SL>
            <F label="Location (Plant) *" placeholder="e.g. Plant A - Zone 2" {...fProps("location")} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <F label="Minimum Level" placeholder="e.g. 200" type="number" {...fProps("minLevel")} />
            <F label="Maximum Level" placeholder="e.g. 4800" type="number" {...fProps("maxLevel")} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <F label="Calibration Chart Ref" placeholder="e.g. CAL-2024-001" optional {...fProps("calibrationRef")} />
            <SL label="Status" defaultVal="Active" {...slProps("status")}>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Maintenance">Under Maintenance</SelectItem>
            </SL>
          </div>
        </div>

        {/* Actions — always at bottom */}
        <div className="flex items-center justify-end gap-2 px-5 py-3.5 border-t border-slate-100 bg-slate-50 shrink-0">
          <Button variant="outline" size="sm" onClick={onCancel} className="gap-1.5 h-8 text-slate-600">
            <X className="w-3.5 h-3.5" /> Cancel
          </Button>
          <Button size="sm" onClick={() => handleSubmit("save")} className="bg-blue-600 hover:bg-blue-700 gap-1.5 h-8">
            <Save className="w-3.5 h-3.5" /> Save Draft
          </Button>
          <Button size="sm" onClick={() => handleSubmit("post")} className="bg-green-600 hover:bg-green-700 gap-1.5 h-8">
            <Send className="w-3.5 h-3.5" /> Post
          </Button>
        </div>
      </div>

      {/* ── Right: Info panel (1/3 width) ── */}
      <div className="col-span-1 space-y-4">
        {/* Current entry ID */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Entry Reference</p>
          <p className="font-mono text-lg font-bold text-blue-600">{form.tankId}</p>
          <p className="text-xs text-slate-400 mt-1">Auto-generated Tank ID</p>
        </div>

        {/* Save vs Post explanation */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Submission Guide</p>
          <div className="flex items-start gap-2">
            <div className="bg-blue-100 rounded p-1 mt-0.5 shrink-0">
              <Save className="w-3 h-3 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">Save Draft</p>
              <p className="text-xs text-slate-500 mt-0.5">Saves the entry. You can come back and edit it later.</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="bg-green-100 rounded p-1 mt-0.5 shrink-0">
              <Send className="w-3 h-3 text-green-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">Post</p>
              <p className="text-xs text-slate-500 mt-0.5">Finalizes and locks the entry. Cannot be edited after posting.</p>
            </div>
          </div>
        </div>

        {/* Required fields reminder */}
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-3.5 h-3.5 text-amber-600" />
            <p className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider">Required Fields</p>
          </div>
          {["Tank Name", "Gas Type", "Capacity", "Location"].map((f) => (
            <div key={f} className="flex items-center gap-2 py-1">
              <CheckCircle2 className="w-3 h-3 text-amber-500" />
              <span className="text-xs text-amber-800">{f}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
