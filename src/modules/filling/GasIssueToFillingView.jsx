import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { fetchApi } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Droplets, Gauge, TrendingDown } from "lucide-react";

const FILLING_BATCH_OPTIONS = [
  "FB-2026-0418-01",
  "FB-2026-0418-02",
  "FB-2026-0418-03",
];

const getToday = () => new Date().toISOString().split("T")[0];

const getInputClassName = (hasError) =>
  hasError
    ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-100"
    : "";

const initialFormState = (today) => ({
  tankId: "",
  date: today,
  quantityIssued: "",
  batchId: "",
});

const formStateFromRecord = (record, today) => {
  if (!record) return initialFormState(today);

  return {
    tankId: record.tankId ?? "",
    date: record.date ?? today,
    quantityIssued:
      record.quantity !== undefined && record.quantity !== null
        ? String(record.quantity)
        : "",
    batchId: record.batchId ?? "",
  };
};

function validateForm(form, selectedTank) {
  const errors = {};
  const quantity = form.quantityIssued.trim();

  if (!form.tankId) errors.tankId = "Required field";
  if (!form.date) errors.date = "Required field";
  if (!form.quantityIssued) {
    errors.quantityIssued = "Required field";
  } else if (!/^\d*\.?\d+$/.test(quantity)) {
    errors.quantityIssued = "Invalid quantity";
  } else {
    const quantityValue = Number(quantity);
    if (!Number.isFinite(quantityValue) || quantityValue <= 0) {
      errors.quantityIssued = "Invalid quantity";
    } else if (selectedTank && quantityValue > selectedTank.currentLevel) {
      errors.quantityIssued = "Insufficient gas in tank";
    }
  }

  if (!form.batchId) errors.batchId = "Required field";

  return errors;
}

export function GasIssueToFillingView({
  mode = "create",
  initialData = null,
  onSubmit,
  onCancel,
}) {
  const today = getToday();
  const [form, setForm] = useState(formStateFromRecord(initialData, today));
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [postConfirmOpen, setPostConfirmOpen] = useState(false);
  const [tanks, setTanks] = useState([]);

  useEffect(() => {
    setForm(formStateFromRecord(initialData, today));
    setTouched({});
    setSubmitAttempted(false);
    setPostConfirmOpen(false);
  }, [initialData, today]);

  useEffect(() => {
    const loadTanks = async () => {
      try {
        const response = await fetchApi("/tanks/active");
        if (!response.ok) return;
        const data = await response.json();
        if (!Array.isArray(data)) return;
        setTanks(
          data.map((tank) => ({
            id: tank.tank_id,
            gasType: tank.gas_type,
            capacity: Number(tank.capacity_value) || 0,
            currentLevel: Number(tank.current_level) || 0,
          })),
        );
      } catch {
        setTanks([]);
      }
    };

    loadTanks();
  }, []);

  const selectedTank = useMemo(
    () => tanks.find((tank) => tank.id === form.tankId) ?? null,
    [form.tankId, tanks],
  );
  const availableQuantity = selectedTank ? selectedTank.currentLevel : null;
  const errors = useMemo(() => validateForm(form, selectedTank), [form, selectedTank]);
  const isFormValid = Object.keys(errors).length === 0;

  const quantityValue = Number(form.quantityIssued);
  const hasValidQuantityFormat =
    form.quantityIssued.trim() !== "" &&
    /^\d*\.?\d+$/.test(form.quantityIssued.trim()) &&
    Number.isFinite(quantityValue) &&
    quantityValue > 0;

  const canShowProjectedLevel =
    selectedTank &&
    hasValidQuantityFormat &&
    quantityValue <= selectedTank.currentLevel;

  const projectedLevel = canShowProjectedLevel
    ? Math.max(selectedTank.currentLevel - quantityValue, 0)
    : null;
  const isHighWithdrawal =
    canShowProjectedLevel && quantityValue >= selectedTank.currentLevel * 0.9;
  const willBeEmpty = canShowProjectedLevel && projectedLevel === 0;

  const getFieldError = (field) => {
    if (!errors[field]) return "";
    if (submitAttempted || touched[field]) return errors[field];
    return "";
  };

  const resetForm = () => {
    setForm(initialFormState(today));
    setTouched({});
    setSubmitAttempted(false);
    setPostConfirmOpen(false);
  };

  const handleTankChange = (tankId) => {
    setForm((prev) => ({
      ...prev,
      tankId,
      quantityIssued: "",
      batchId: "",
    }));
    setTouched({});
    setSubmitAttempted(false);
  };

  const handleDateChange = (event) => {
    setForm((prev) => ({ ...prev, date: event.target.value }));
    setTouched((prev) => ({ ...prev, date: true }));
  };

  const handleQuantityChange = (event) => {
    const value = event.target.value;
    if (value === "") {
      setForm((prev) => ({ ...prev, quantityIssued: "" }));
      setTouched((prev) => ({ ...prev, quantityIssued: true }));
      return;
    }

    if (!/^\d*\.?\d*$/.test(value)) return;

    setForm((prev) => ({ ...prev, quantityIssued: value }));
    setTouched((prev) => ({ ...prev, quantityIssued: true }));
  };

  const handleBatchChange = (batchId) => {
    setForm((prev) => ({ ...prev, batchId }));
    setTouched((prev) => ({ ...prev, batchId: true }));
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
      return;
    }
    resetForm();
  };

  const runSubmit = (status) => {
    setSubmitAttempted(true);
    setTouched({
      tankId: true,
      date: true,
      quantityIssued: true,
      batchId: true,
    });

    if (!isFormValid) return;

    const payload = {
      tankId: form.tankId,
      gasType: selectedTank?.gasType ?? "",
      date: form.date,
      quantity: form.quantityIssued,
      batchId: form.batchId,
      status,
    };

    if (onSubmit) {
      onSubmit(payload);
      return;
    }

    resetForm();
  };

  const handleSave = () => {
    runSubmit("draft");
  };

  const handlePostRequest = () => {
    setPostConfirmOpen(true);
  };

  const handlePostConfirm = () => {
    setPostConfirmOpen(false);
    runSubmit("posted");
  };

  return (
    <section className="mx-auto w-full max-w-7xl">
      <header className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
          Gas Issue to Filling
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Transfer gas from bulk tank inventory to cylinder filling batches.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(280px,1fr)]">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <form className="space-y-6" onSubmit={(event) => event.preventDefault()}>
            <section className="space-y-4">
              <h3 className="text-sm font-semibold tracking-wide text-slate-900">
                BASIC INFO
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tank-id" className="text-slate-700">
                    Tank ID
                  </Label>
                  <Select value={form.tankId} onValueChange={handleTankChange}>
                    <SelectTrigger
                      id="tank-id"
                      className={`w-full ${getInputClassName(
                        Boolean(getFieldError("tankId")),
                      )}`}
                      aria-invalid={Boolean(getFieldError("tankId"))}
                    >
                      <SelectValue placeholder="Select tank ID" />
                    </SelectTrigger>
                    <SelectContent>
                      {tanks.map((tank) => (
                        <SelectItem key={tank.id} value={tank.id}>
                          {tank.id}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {getFieldError("tankId") && (
                    <p className="text-xs font-medium text-red-600">
                      {getFieldError("tankId")}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gas-type" className="text-slate-700">
                    Gas Type
                  </Label>
                  <Input
                    id="gas-type"
                    value={selectedTank ? selectedTank.gasType : ""}
                    placeholder="Auto-filled from tank"
                    readOnly
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="issue-date" className="text-slate-700">
                    Date
                  </Label>
                  <Input
                    id="issue-date"
                    type="date"
                    value={form.date}
                    onChange={handleDateChange}
                    onBlur={() => setTouched((prev) => ({ ...prev, date: true }))}
                    aria-invalid={Boolean(getFieldError("date"))}
                    className={getInputClassName(Boolean(getFieldError("date")))}
                  />
                  {getFieldError("date") && (
                    <p className="text-xs font-medium text-red-600">
                      {getFieldError("date")}
                    </p>
                  )}
                </div>
              </div>
            </section>

            <Separator />

            <section className="space-y-4">
              <h3 className="text-sm font-semibold tracking-wide text-slate-900">
                ISSUE DETAILS
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity-issued" className="text-slate-700">
                    Quantity Issued
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="quantity-issued"
                      type="text"
                      inputMode="decimal"
                      disabled={!selectedTank}
                      value={form.quantityIssued}
                      placeholder={
                        selectedTank ? "Enter quantity" : "Select tank first"
                      }
                      onChange={handleQuantityChange}
                      onBlur={() =>
                        setTouched((prev) => ({ ...prev, quantityIssued: true }))
                      }
                      onKeyDown={(event) => {
                        if (["e", "E", "+", "-"].includes(event.key)) {
                          event.preventDefault();
                        }
                      }}
                      aria-invalid={Boolean(getFieldError("quantityIssued"))}
                      className={`flex-1 ${getInputClassName(
                        Boolean(getFieldError("quantityIssued")),
                      )}`}
                    />
                    <div className="inline-flex h-8 min-w-16 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-700">
                      Ltr
                    </div>
                  </div>
                  {getFieldError("quantityIssued") && (
                    <p className="text-xs font-medium text-red-600">
                      {getFieldError("quantityIssued")}
                    </p>
                  )}
                  {!getFieldError("quantityIssued") && isHighWithdrawal && (
                    <p className="text-xs font-medium text-amber-600">
                      High withdrawal from tank
                    </p>
                  )}
                  {!getFieldError("quantityIssued") && willBeEmpty && (
                    <p className="text-xs font-medium text-amber-600">
                      Tank will be empty after this issue
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="filling-batch" className="text-slate-700">
                    Linked Filling Batch ID
                  </Label>
                  <Select
                    value={form.batchId}
                    onValueChange={handleBatchChange}
                    disabled={!selectedTank}
                  >
                    <SelectTrigger
                      id="filling-batch"
                      className={`w-full ${getInputClassName(
                        Boolean(getFieldError("batchId")),
                      )}`}
                      aria-invalid={Boolean(getFieldError("batchId"))}
                    >
                      <SelectValue
                        placeholder={
                          selectedTank ? "Select filling batch" : "Select tank first"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {FILLING_BATCH_OPTIONS.map((batchId) => (
                        <SelectItem key={batchId} value={batchId}>
                          {batchId}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {getFieldError("batchId") && (
                    <p className="text-xs font-medium text-red-600">
                      {getFieldError("batchId")}
                    </p>
                  )}
                </div>
              </div>
            </section>

            <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
              <Button
                type="button"
                variant="outline"
                className="h-9 px-4 text-slate-700"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="h-9 bg-blue-700 px-4 hover:bg-blue-800"
                onClick={handleSave}
                disabled={!isFormValid}
              >
                {mode === "edit" ? "Update" : "Save"}
              </Button>
              <Button
                type="button"
                className="h-9 bg-emerald-600 px-4 hover:bg-emerald-700"
                onClick={handlePostRequest}
                disabled={!isFormValid}
              >
                Post
              </Button>
            </div>
          </form>
        </article>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">Tank Status</h3>

          <div className="mt-4 space-y-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                <Gauge className="size-3.5" />
                Current Level
              </div>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {selectedTank ? `${selectedTank.currentLevel} Ltr` : "--"}
              </p>
            </div>

            <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-blue-600">
                <Droplets className="size-3.5" />
                Available Quantity
              </div>
              <p className="mt-1 text-lg font-semibold text-blue-700">
                {availableQuantity !== null ? `${availableQuantity} Ltr` : "--"}
              </p>
            </div>

            <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-emerald-700">
                <TrendingDown className="size-3.5" />
                After Issue (Projected Level)
              </div>
              <p className="mt-1 text-lg font-semibold text-emerald-700">
                {projectedLevel !== null ? `${projectedLevel} Ltr` : "--"}
              </p>
            </div>
          </div>
        </aside>
      </div>

      <Dialog open={postConfirmOpen} onOpenChange={setPostConfirmOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Confirm Posting</DialogTitle>
            <DialogDescription>
              Are you sure you want to post this issue? This cannot be edited later.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end">
            <Button variant="outline" onClick={() => setPostConfirmOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handlePostConfirm}>
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}

export default GasIssueToFillingView;
