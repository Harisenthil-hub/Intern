import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TANK_OPTIONS = [
  { id: "TNK-001", capacity: 1000, currentLevel: 600 },
  { id: "TNK-002", capacity: 1000, currentLevel: 400 },
];

const REASONS = ["Leakage", "Measurement Error", "Evaporation"];

const today = new Date().toISOString().split("T")[0];

const INITIAL_FORM = {
  tankId: "",
  date: today,
  expectedQuantity: "",
  actualQuantity: "",
  lossQuantity: "",
  reason: "",
};

const INITIAL_FEEDBACK = {
  text: "",
  tone: "",
};

const sanitizeNumericInput = (value) => {
  const cleaned = value.replace(/[^0-9.]/g, "");
  const firstDotIndex = cleaned.indexOf(".");
  if (firstDotIndex === -1) return cleaned;

  const beforeDot = cleaned.slice(0, firstDotIndex + 1);
  const afterDot = cleaned.slice(firstDotIndex + 1).replace(/\./g, "");
  return `${beforeDot}${afterDot}`;
};

const parseDecimal = (value) => {
  if (value === "") return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  return parsed;
};

const formatNumber = (value) => {
  if (!Number.isFinite(value)) return "";
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(3)));
};

export function LossLeakageMonitoringView() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [feedbackMessage, setFeedbackMessage] = useState(INITIAL_FEEDBACK);
  const [isEditMode, setIsEditMode] = useState(false);

  const selectedTank = useMemo(
    () => TANK_OPTIONS.find((tank) => tank.id === form.tankId) ?? null,
    [form.tankId],
  );

  const expectedValue = parseDecimal(form.expectedQuantity);
  const lossValue = parseDecimal(form.lossQuantity);
  const hasLossCalculation = form.lossQuantity !== "" && lossValue !== null;
  const canEnterActual = expectedValue !== null && expectedValue > 0;
  const canSelectReason = hasLossCalculation && lossValue > 0;
  const showNoReasonHint = hasLossCalculation && lossValue === 0;

  const validateForm = (nextForm) => {
    const nextErrors = {};
    const nextExpected = parseDecimal(nextForm.expectedQuantity);
    const nextActual = parseDecimal(nextForm.actualQuantity);

    if (!nextForm.tankId) nextErrors.tankId = "Tank ID is required";

    if (nextForm.expectedQuantity === "") {
      nextErrors.expectedQuantity = "Expected quantity is required";
    } else if (nextExpected === null || nextExpected < 0) {
      nextErrors.expectedQuantity = "Enter a valid number";
    } else if (nextExpected === 0) {
      nextErrors.expectedQuantity = "Expected quantity must be greater than 0";
    }

    if (nextForm.actualQuantity === "") {
      nextErrors.actualQuantity = "Actual quantity is required";
    } else if (nextActual === null || nextActual < 0) {
      nextErrors.actualQuantity = "Enter a valid number";
    }

    if (
      nextExpected !== null &&
      nextActual !== null &&
      nextExpected > 0 &&
      nextActual > nextExpected
    ) {
      nextErrors.actualQuantity =
        "Actual quantity cannot exceed expected quantity";
    }

    return nextErrors;
  };

  const applyDerivedState = (nextForm) => {
    const nextExpected = parseDecimal(nextForm.expectedQuantity);
    const nextActual = parseDecimal(nextForm.actualQuantity);

    let nextLossQuantity = "";
    if (
      nextExpected !== null &&
      nextActual !== null &&
      nextExpected >= 0 &&
      nextActual >= 0
    ) {
      const computedLoss = nextExpected - nextActual;
      if (computedLoss >= 0) {
        nextLossQuantity = formatNumber(computedLoss);
      }
    }

    const normalizedForm =
      nextForm.lossQuantity === nextLossQuantity
        ? nextForm
        : { ...nextForm, lossQuantity: nextLossQuantity };

    const nextErrors = validateForm(normalizedForm);

    let nextFeedback = INITIAL_FEEDBACK;
    const normalizedLoss = parseDecimal(normalizedForm.lossQuantity);
    if (
      normalizedLoss !== null &&
      nextExpected !== null &&
      nextExpected > 0 &&
      !nextErrors.actualQuantity &&
      !nextErrors.expectedQuantity
    ) {
      if (normalizedLoss === 0) {
        nextFeedback = {
          text: "No discrepancy detected",
          tone: "text-emerald-700",
        };
      } else if (normalizedLoss < nextExpected * 0.2) {
        nextFeedback = {
          text: "Minor discrepancy detected",
          tone: "text-slate-600",
        };
      } else {
        nextFeedback = {
          text: "High discrepancy detected",
          tone: "text-rose-700",
        };
      }
    }

    const finalForm =
      normalizedLoss !== null && normalizedLoss <= 0 && normalizedForm.reason !== ""
        ? { ...normalizedForm, reason: "" }
        : normalizedForm;

    setErrors(nextErrors);
    setFeedbackMessage(nextFeedback);
    setForm(finalForm);
  };

  const updateField = (field, value) => {
    const nextForm = { ...form, [field]: value };
    setIsEditMode(true);
    applyDerivedState(nextForm);
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setForm(INITIAL_FORM);
    setErrors({});
    setFeedbackMessage(INITIAL_FEEDBACK);
  };

  const resetAfterSubmit = () => {
    const nextForm = {
      ...form,
      expectedQuantity: "",
      actualQuantity: "",
      lossQuantity: "",
      reason: "",
    };
    setForm(nextForm);
    setErrors({});
    setFeedbackMessage(INITIAL_FEEDBACK);
    setIsEditMode(false);
  };

  const handleExpectedChange = (rawValue) => {
    const sanitized = sanitizeNumericInput(rawValue);
    const nextForm = {
      ...form,
      expectedQuantity: sanitized,
      actualQuantity: "",
      lossQuantity: "",
      reason: "",
    };
    setIsEditMode(true);
    applyDerivedState(nextForm);
  };

  const handleActualChange = (rawValue) => {
    if (!canEnterActual) return;

    const sanitized = sanitizeNumericInput(rawValue);
    if (sanitized === "") {
      applyDerivedState({ ...form, actualQuantity: "", reason: "" });
      return;
    }

    const parsed = parseDecimal(sanitized);
    if (parsed === null) return;
    if (parsed < 0) return;
    if (expectedValue !== null && parsed > expectedValue) {
      setErrors((prev) => ({
        ...prev,
        actualQuantity: "Actual quantity cannot exceed expected quantity",
      }));
      return;
    }

    setIsEditMode(true);
    applyDerivedState({ ...form, actualQuantity: sanitized, reason: "" });
  };

  const handleReasonChange = (value) => {
    if (!canSelectReason) return;
    updateField("reason", value);
  };

  const isFormValid =
    Boolean(form.tankId) &&
    form.expectedQuantity !== "" &&
    form.actualQuantity !== "" &&
    Object.keys(errors).length === 0;

  const lossDisplayValue = form.lossQuantity === "" ? "--" : form.lossQuantity;

  const handleSave = () => {
    if (!isFormValid) return;
    resetAfterSubmit();
  };

  const handlePost = () => {
    if (!isFormValid) return;
    resetAfterSubmit();
  };

  return (
    <section className="mx-auto w-full max-w-7xl">
      <header className="mb-6 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
          Loss / Leakage Monitoring
        </h2>
      </header>

      <div className="flex flex-col gap-6 xl:flex-row">
        <article className="flex-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <form className="space-y-7" onSubmit={(event) => event.preventDefault()}>
            <section className="space-y-4">
              <p className="text-sm font-medium text-slate-500">Tank details</p>

              <div className="space-y-3">
                <Label htmlFor="loss-tank-id" className="font-semibold text-slate-700">
                  Tank ID
                </Label>
                <Select
                  value={form.tankId}
                  onValueChange={(value) => updateField("tankId", value)}
                >
                  <SelectTrigger id="loss-tank-id" className="w-full">
                    <SelectValue placeholder="Select tank ID" />
                  </SelectTrigger>
                  <SelectContent>
                    {TANK_OPTIONS.map((tank) => (
                      <SelectItem key={tank.id} value={tank.id}>
                        {tank.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.tankId && (
                  <p className="text-sm font-medium text-red-600">{errors.tankId}</p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="loss-date" className="font-semibold text-slate-700">
                  Date
                </Label>
                <Input
                  id="loss-date"
                  type="date"
                  value={form.date}
                  onChange={(event) => updateField("date", event.target.value)}
                />
              </div>
            </section>

            <section className="space-y-5 rounded-xl bg-slate-50/70 p-5">
              <p className="text-sm font-medium text-slate-500">Quantity comparison</p>

              <div className="space-y-3">
                <Label htmlFor="expected-quantity" className="font-semibold text-slate-700">
                  Expected Quantity
                </Label>
                <Input
                  id="expected-quantity"
                  type="text"
                  inputMode="decimal"
                  value={form.expectedQuantity}
                  onChange={(event) => handleExpectedChange(event.target.value)}
                  placeholder="Enter expected quantity"
                />
                {errors.expectedQuantity && (
                  <p className="text-sm font-medium text-red-600">
                    {errors.expectedQuantity}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="actual-quantity" className="font-semibold text-slate-700">
                  Actual Quantity
                </Label>
                <Input
                  id="actual-quantity"
                  type="text"
                  inputMode="decimal"
                  value={form.actualQuantity}
                  onChange={(event) => handleActualChange(event.target.value)}
                  placeholder={canEnterActual ? "Enter actual quantity" : "Enter expected first"}
                  disabled={!canEnterActual}
                  className={!canEnterActual ? "cursor-not-allowed bg-slate-100 text-slate-500" : ""}
                />
                {errors.actualQuantity && (
                  <p className="text-sm font-medium text-red-600">
                    {errors.actualQuantity}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="loss-quantity" className="font-semibold text-slate-700">
                  Loss Quantity
                </Label>
                <Input
                  id="loss-quantity"
                  value={lossDisplayValue}
                  readOnly
                  className="cursor-not-allowed border-amber-300 bg-amber-50 font-semibold text-slate-900 focus-visible:border-amber-300 focus-visible:ring-amber-100"
                />
                {feedbackMessage.text && (
                  <p className={`text-sm font-medium ${feedbackMessage.tone}`}>
                    {feedbackMessage.text}
                  </p>
                )}
              </div>
            </section>

            <section className="space-y-4 pt-1">
              <div className="space-y-3">
                <Label htmlFor="loss-reason" className="font-semibold text-slate-700">
                  Reason
                </Label>
                <Select
                  value={form.reason}
                  onValueChange={handleReasonChange}
                  disabled={!canSelectReason}
                >
                  <SelectTrigger id="loss-reason" className="w-full">
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {REASONS.map((reason) => (
                      <SelectItem key={reason} value={reason}>
                        {reason}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {showNoReasonHint && (
                  <p className="text-sm text-slate-500">No reason needed</p>
                )}
              </div>
            </section>

            <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-5">
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
                {isEditMode ? "Update" : "Save"}
              </Button>
              <Button
                type="button"
                className="h-9 bg-emerald-600 px-4 hover:bg-emerald-700"
                onClick={handlePost}
                disabled={!isFormValid}
              >
                Post
              </Button>
            </div>
          </form>
        </article>

        <aside className="h-fit w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:w-80">
          <h3 className="text-base font-semibold text-slate-900">Tank Snapshot</h3>
          <div className="mt-4 space-y-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Tank Capacity
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {selectedTank ? `${selectedTank.capacity} L` : "--"}
              </p>
            </div>
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-blue-700">
                Current Level
              </p>
              <p className="mt-1 text-lg font-semibold text-blue-700">
                {selectedTank ? `${selectedTank.currentLevel} L` : "--"}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
