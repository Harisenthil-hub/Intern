import { useState } from "react";
import { format, parse } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon, Flame, Save, Send, X, Pencil, Info, CheckCircle2 } from "lucide-react";

let prodCounter = 2005;

function F({ label, name, placeholder, optional, type = "text", value, onChange, error }) {
  return (
    <div className="space-y-1">
      <Label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
        {label}{optional && <span className="ml-1 text-slate-400 normal-case tracking-normal font-normal text-xs">(optional)</span>}
      </Label>
      <Input
        name={name}
        type={type}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        className={`h-9 text-sm ${error ? "border-red-400" : ""}`}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function SL({ label, name, children, placeholder, value, onValueChange, error }) {
  return (
    <div className="space-y-1">
      <Label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{label}</Label>
      <Select value={value || ""} onValueChange={(v) => onValueChange(name, v)}>
        <SelectTrigger className={`h-9 text-sm ${error ? "border-red-400" : ""}`}>
          <SelectValue placeholder={placeholder || "Select"} />
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export function AddProductionPage({ onAdd, onCancel, initialData = null }) {
  const isEdit = !!initialData;
  const [form, setForm] = useState(
    initialData
      ? { ...initialData }
      : {
          productionId: `PROD-${++prodCounter}`,
          date: "",
          plant: "",
          gasType: "",
          quantity: "",
          quantityUnit: "Liters",
          batch: "",
          linkedTankId: "",
        }
  );
  const [date, setDate] = useState(
    initialData?.date
      ? (() => { try { return parse(initialData.date, "dd MMM yyyy", new Date()); } catch { return undefined; } })()
      : undefined
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
    if (!date && !form.date) e.date = "Date is required";
    if (!form.plant?.trim()) e.plant = "Plant is required";
    if (!form.gasType) e.gasType = "Gas type is required";
    if (!form.quantity) e.quantity = "Quantity is required";
    return e;
  };

  const handleSubmit = (mode) => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onAdd({
      ...form,
      date: date ? format(date, "dd MMM yyyy") : form.date,
      quantityDisplay: `${form.quantity} ${form.quantityUnit}`,
      _mode: mode,
    });
  };

  const fProps = (name) => ({ name, value: form[name], onChange: handleChange, error: errors[name] });
  const slProps = (name) => ({ name, value: form[name], onValueChange: handleSelect, error: errors[name] });

  return (
    <div className="grid grid-cols-3 gap-5 h-full">
      {/* ── Left: Form (2/3) ── */}
      <div className="col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 shrink-0">
          <div className="bg-white/20 rounded-lg p-1.5">
            {isEdit ? <Pencil className="w-4 h-4 text-white" /> : <Flame className="w-4 h-4 text-white" />}
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">
              {isEdit ? "Edit Production Entry" : "New Production Entry"}
            </h2>
            <p className="text-orange-100 text-xs">
              {isEdit ? "Update fields. Save keeps as Draft; Post locks the record." : "Record gas generated internally at the plant"}
            </p>
          </div>
          <span className="ml-auto bg-white/20 text-white text-xs px-2.5 py-1 rounded-full font-mono">{form.productionId}</span>
        </div>

        <div className="p-5 space-y-4 flex-1">
          {/* Row 1: Date + Plant */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left h-9 text-sm font-normal ${!date && !form.date ? "text-slate-400" : ""} ${errors.date ? "border-red-400" : ""}`}
                  >
                    <CalendarIcon className="w-3.5 h-3.5 mr-2 text-slate-400" />
                    {date ? format(date, "dd MMM yyyy") : (form.date || "Select production date")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
              {errors.date && <p className="text-xs text-red-500">{errors.date}</p>}
            </div>
            <F label="Plant *" placeholder="e.g. Plant A" {...fProps("plant")} />
          </div>

          {/* Row 2: Gas type + Qty + Unit */}
          <div className="grid grid-cols-3 gap-4">
            <SL label="Gas Type *" placeholder="Select gas type" {...slProps("gasType")}>
              <SelectItem value="Oxygen">Oxygen (O₂)</SelectItem>
              <SelectItem value="Nitrogen">Nitrogen (N₂)</SelectItem>
              <SelectItem value="LPG">LPG</SelectItem>
              <SelectItem value="CO2">Carbon Dioxide</SelectItem>
              <SelectItem value="Argon">Argon</SelectItem>
            </SL>
            <F label="Quantity *" placeholder="e.g. 500" type="number" {...fProps("quantity")} />
            <SL label="Unit" placeholder="Select unit" {...slProps("quantityUnit")}>
              <SelectItem value="Liters">Liters (L)</SelectItem>
              <SelectItem value="Kg">Kilograms (Kg)</SelectItem>
              <SelectItem value="m³">Cubic Meters (m³)</SelectItem>
            </SL>
          </div>

          {/* Row 3: Batch + Linked Tank */}
          <div className="grid grid-cols-2 gap-4">
            <F label="Batch Number" placeholder="e.g. BATCH-2025-001" optional {...fProps("batch")} />
            <SL label="Linked Tank ID" placeholder="Select tank" {...slProps("linkedTankId")}>
              <SelectItem value="TK-1001">TK-1001 — Oxygen Storage Unit 1</SelectItem>
              <SelectItem value="TK-1002">TK-1002 — Nitrogen Reserve Tank</SelectItem>
              <SelectItem value="TK-1003">TK-1003 — LPG Storage Vessel A</SelectItem>
              <SelectItem value="TK-1004">TK-1004 — CO₂ Bulk Tank</SelectItem>
              <SelectItem value="TK-1005">TK-1005 — Argon Cylinder Bank</SelectItem>
            </SL>
          </div>
        </div>

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

      {/* ── Right: Info panel (1/3) ── */}
      <div className="col-span-1 space-y-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Entry Reference</p>
          <p className="font-mono text-lg font-bold text-orange-600">{form.productionId}</p>
          <p className="text-xs text-slate-400 mt-1">Auto-generated Production ID</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Submission Guide</p>
          <div className="flex items-start gap-2">
            <div className="bg-blue-100 rounded p-1 mt-0.5 shrink-0"><Save className="w-3 h-3 text-blue-600" /></div>
            <div>
              <p className="text-xs font-semibold text-slate-700">Save Draft</p>
              <p className="text-xs text-slate-500 mt-0.5">Saves the entry. You can edit it later.</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="bg-green-100 rounded p-1 mt-0.5 shrink-0"><Send className="w-3 h-3 text-green-600" /></div>
            <div>
              <p className="text-xs font-semibold text-slate-700">Post</p>
              <p className="text-xs text-slate-500 mt-0.5">Finalizes & locks the entry. Cannot be edited after posting.</p>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-3.5 h-3.5 text-amber-600" />
            <p className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider">Required Fields</p>
          </div>
          {["Date", "Plant", "Gas Type", "Quantity"].map((f) => (
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
