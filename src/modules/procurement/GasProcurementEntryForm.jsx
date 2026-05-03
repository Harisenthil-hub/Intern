import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { fetchApi } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const VENDOR_OPTIONS = [
  "AirLiquide Supplies",
  "Prime Industrial Gases",
  "National Gas Traders",
  "Apex Bulk Gas Logistics",
  "BlueLine Energy",
];
const MAX_QUANTITY_INPUT = 1000000;

const initialFormState = (today) => ({
  vendorName: "",
  date: today,
  gasType: "",
  tankId: "",
  quantityReceived: "",
  transportDetails: "",
});

const formStateFromRecord = (record, today) => {
  if (!record) return initialFormState(today);

  return {
    vendorName: record.vendorName ?? "",
    date: record.date ?? today,
    gasType: record.gasType ?? "",
    tankId: record.tankId ?? "",
    quantityReceived:
      record.quantity !== undefined && record.quantity !== null
        ? String(record.quantity)
        : "",
    transportDetails: record.transportDetails ?? "",
  };
};

const getInputClassName = (hasError) =>
  `w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400 ${
    hasError
      ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100"
      : "border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
  }`;

function validateForm(form, selectedTank) {
  const errors = {};
  const today = new Date().toISOString().split("T")[0];

  if (!form.vendorName.trim()) errors.vendorName = "This field is required";
  if (!form.date) {
    errors.date = "Date is required";
  } else if (form.date > today) {
    errors.date = "Future dates are not allowed";
  }
  if (!form.gasType) errors.gasType = "This field is required";
  if (!form.tankId) {
    errors.tankId = "This field is required";
  } else {
    if (selectedTank && selectedTank.gasType !== form.gasType) {
      errors.tankId = "Selected tank does not match gas type";
    }
  }

  if (!form.quantityReceived) {
    errors.quantityReceived = "This field is required";
  } else {
    const quantity = Number(form.quantityReceived);
    if (!Number.isFinite(quantity)) {
      errors.quantityReceived = "Please enter a valid number";
    } else if (quantity <= 0) {
      errors.quantityReceived = "Quantity must be greater than 0";
    } else if (selectedTank) {
      const availableSpace = selectedTank.capacity - selectedTank.currentLevel;
      if (quantity > availableSpace) {
        errors.quantityReceived = "Exceeds available tank capacity";
      }
    }
  }

  return errors;
}

export function GasProcurementEntryForm({
  mode = "create",
  initialData = null,
  onSubmit,
  onCancel,
}) {
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState(formStateFromRecord(initialData, today));

  const [vendorQuery, setVendorQuery] = useState(initialData?.vendorName ?? "");
  const [vendorListOpen, setVendorListOpen] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [fieldTouched, setFieldTouched] = useState({});
  const [postConfirmOpen, setPostConfirmOpen] = useState(false);
  const [tanks, setTanks] = useState([]);

  useEffect(() => {
    const loadTanks = async () => {
      try {
        const response = await fetchApi("/tanks/active");
        if (!response.ok) return;
        const data = await response.json();
        if (!Array.isArray(data)) return;
        const mapped = data.map((tank) => ({
          id: tank.tank_id,
          gasType: tank.gas_type,
          capacity: Number(tank.capacity_value) || 0,
          currentLevel: Number(tank.current_level) || 0,
        }));
        setTanks(mapped);
      } catch {
        setTanks([]);
      }
    };
    loadTanks();
  }, []);

  useEffect(() => {
    setForm(formStateFromRecord(initialData, today));
    setVendorQuery(initialData?.vendorName ?? "");
    setVendorListOpen(false);
    setFieldTouched({});
    setSubmitAttempted(false);
    setPostConfirmOpen(false);
  }, [initialData, today]);

  const filteredVendors = useMemo(() => {
    const query = vendorQuery.trim().toLowerCase();
    if (!query) return VENDOR_OPTIONS;
    return VENDOR_OPTIONS.filter((vendor) =>
      vendor.toLowerCase().includes(query),
    );
  }, [vendorQuery]);

  const filteredTanks = useMemo(
    () => tanks.filter((tank) => tank.gasType === form.gasType),
    [form.gasType, tanks],
  );

  const selectedTank = useMemo(
    () => tanks.find((tank) => tank.id === form.tankId) ?? null,
    [form.tankId, tanks],
  );

  const gasTypes = useMemo(
    () => Array.from(new Set(tanks.map((tank) => tank.gasType))).sort(),
    [tanks],
  );

  const availableSpace = selectedTank
    ? selectedTank.capacity - selectedTank.currentLevel
    : 0;

  const projectedLevel = selectedTank
    ? selectedTank.currentLevel + (Number(form.quantityReceived) || 0)
    : 0;

  const backdatedWarning = useMemo(() => {
    if (!form.date || form.date > today) return "";
    const selectedDate = new Date(`${form.date}T00:00:00`);
    const currentDate = new Date(`${today}T00:00:00`);
    const diffInMs = currentDate - selectedDate;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    return diffInDays > 30 ? "This is a backdated entry" : "";
  }, [form.date, today]);

  const formErrors = useMemo(
    () => validateForm(form, selectedTank),
    [form, selectedTank],
  );

  const isFormValid = Object.keys(formErrors).length === 0;
  const isTankEnabled = Boolean(form.gasType);
  const isQuantityEnabled = Boolean(form.gasType && form.tankId);
  const isTransportEnabled = Boolean(
    form.vendorName.trim() && form.date && form.gasType && form.tankId,
  );

  const capacityWarning = useMemo(() => {
    if (
      !selectedTank ||
      !form.quantityReceived ||
      formErrors.quantityReceived
    ) {
      return "";
    }

    const quantity = Number(form.quantityReceived);
    if (!Number.isFinite(quantity) || quantity <= 0) return "";

    const capacity = selectedTank.capacity;
    if (Math.abs(projectedLevel - capacity) < 0.000001) {
      return "Tank will be FULL after this entry";
    }
    if (projectedLevel >= capacity * 0.9) {
      return "Tank nearing full capacity";
    }
    return "";
  }, [form.quantityReceived, projectedLevel, selectedTank, formErrors.quantityReceived]);

  const handleChange = (field, value) => {
    setForm((prev) => {
      if (field === "gasType") {
        return { ...prev, gasType: value, tankId: "", quantityReceived: "" };
      }
      if (field === "tankId") {
        return { ...prev, tankId: value, quantityReceived: "" };
      }
      return { ...prev, [field]: value };
    });
  };

  const getFieldError = (field) => {
    if (!formErrors[field]) return "";
    if (submitAttempted || fieldTouched[field]) return formErrors[field];
    return "";
  };

  const markFieldTouched = (field) => {
    setFieldTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleQuantityChange = (rawValue) => {
    if (!isQuantityEnabled) return;

    if (rawValue === "") {
      handleChange("quantityReceived", "");
      markFieldTouched("quantityReceived");
      return;
    }

    if (!/^\d*\.?\d*$/.test(rawValue)) return;
    if (rawValue.includes(".") && rawValue.split(".")[1]?.length > 2) return;
    if (rawValue.length > 12) return;

    const parsedValue = Number(rawValue);
    if (Number.isFinite(parsedValue) && parsedValue > MAX_QUANTITY_INPUT) return;

    handleChange("quantityReceived", rawValue);
    markFieldTouched("quantityReceived");
  };

  const resetForm = () => {
    setForm(initialFormState(today));
    setVendorQuery("");
    setVendorListOpen(false);
    setFieldTouched({});
    setSubmitAttempted(false);
    setPostConfirmOpen(false);
  };

  const runSubmit = (status) => {
    setSubmitAttempted(true);
    setFieldTouched({
      vendorName: true,
      date: true,
      gasType: true,
      tankId: true,
      quantityReceived: true,
      transportDetails: true,
    });

    if (!isFormValid) return;

    if (onSubmit) {
      onSubmit({
        vendorName: form.vendorName.trim(),
        date: form.date,
        gasType: form.gasType,
        quantity: form.quantityReceived,
        tankId: form.tankId,
        transportDetails: form.transportDetails.trim(),
        status,
      });
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

  const selectVendor = (vendor) => {
    handleChange("vendorName", vendor);
    setVendorQuery(vendor);
    setVendorListOpen(false);
    markFieldTouched("vendorName");
  };

  return (
    <section className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-6 border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Gas Procurement Entry
          </h1>
        </header>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="mb-6 text-lg font-semibold text-slate-900">
              Bulk Purchase Form
            </h2>

            <form className="space-y-6">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="relative">
                  <label
                    htmlFor="vendorName"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Vendor Name
                  </label>
                  <input
                    id="vendorName"
                    type="text"
                    placeholder="Search vendor..."
                    value={vendorQuery}
                    onChange={(event) => {
                      const value = event.target.value;
                      setVendorQuery(value);
                      handleChange("vendorName", value);
                      markFieldTouched("vendorName");
                      setVendorListOpen(true);
                    }}
                    onFocus={() => setVendorListOpen(true)}
                    onBlur={() => {
                      markFieldTouched("vendorName");
                      setTimeout(() => setVendorListOpen(false), 100);
                    }}
                    className={getInputClassName(Boolean(getFieldError("vendorName")))}
                  />

                  {vendorListOpen && (
                    <div className="absolute z-10 mt-2 max-h-44 w-full overflow-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                      {filteredVendors.length > 0 ? (
                        filteredVendors.map((vendor) => (
                          <button
                            key={vendor}
                            type="button"
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={() => selectVendor(vendor)}
                            className="block w-full px-3.5 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                          >
                            {vendor}
                          </button>
                        ))
                      ) : (
                        <p className="px-3.5 py-2 text-sm text-slate-500">
                          No vendors found
                        </p>
                      )}
                    </div>
                  )}
                  {getFieldError("vendorName") && (
                    <p className="mt-1.5 text-xs font-medium text-red-600">
                      {getFieldError("vendorName")}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="date"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Date
                  </label>
                  <input
                    id="date"
                    type="date"
                    value={form.date}
                    onChange={(event) => {
                      handleChange("date", event.target.value);
                      markFieldTouched("date");
                    }}
                    onBlur={() => markFieldTouched("date")}
                    max={today}
                    className={getInputClassName(Boolean(getFieldError("date")))}
                  />
                  {getFieldError("date") && (
                    <p className="mt-1.5 text-xs font-medium text-red-600">
                      {getFieldError("date")}
                    </p>
                  )}
                  {!getFieldError("date") && backdatedWarning && (
                    <p className="mt-1.5 text-xs font-medium text-amber-600">
                      {backdatedWarning}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="gasType"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Gas Type
                  </label>
                  <select
                    id="gasType"
                    value={form.gasType}
                    onChange={(event) => {
                      handleChange("gasType", event.target.value);
                      markFieldTouched("gasType");
                      setFieldTouched((prev) => ({ ...prev, tankId: false }));
                    }}
                    onBlur={() => markFieldTouched("gasType")}
                    className={getInputClassName(Boolean(getFieldError("gasType")))}
                  >
                    <option value="">Select gas type</option>
                    {gasTypes.map((gas) => (
                      <option key={gas} value={gas}>
                        {gas}
                      </option>
                    ))}
                  </select>
                  {getFieldError("gasType") && (
                    <p className="mt-1.5 text-xs font-medium text-red-600">
                      {getFieldError("gasType")}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="tankId"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Tank ID
                  </label>
                  <select
                    id="tankId"
                    value={form.tankId}
                    onChange={(event) => {
                      handleChange("tankId", event.target.value);
                      markFieldTouched("tankId");
                    }}
                    onBlur={() => markFieldTouched("tankId")}
                    className={getInputClassName(Boolean(getFieldError("tankId")))}
                    disabled={!isTankEnabled}
                  >
                    <option value="">
                      {isTankEnabled ? "Select tank" : "Select gas type first"}
                    </option>
                    {filteredTanks.map((tank) => (
                      <option key={tank.id} value={tank.id}>
                        {tank.id}
                      </option>
                    ))}
                  </select>
                  {getFieldError("tankId") && (
                    <p className="mt-1.5 text-xs font-medium text-red-600">
                      {getFieldError("tankId")}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="quantityReceived"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Quantity Received
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="quantityReceived"
                      type="number"
                      min="0"
                      step="0.01"
                      max={selectedTank ? availableSpace : undefined}
                      placeholder={
                        !form.gasType
                          ? "Select gas type first"
                          : !form.tankId
                            ? "Select tank first"
                            : "Enter quantity"
                      }
                      value={form.quantityReceived}
                      onChange={(event) => handleQuantityChange(event.target.value)}
                      onKeyDown={(event) => {
                        if (["e", "E", "+", "-"].includes(event.key)) {
                          event.preventDefault();
                        }
                      }}
                      onBlur={() => markFieldTouched("quantityReceived")}
                      disabled={!isQuantityEnabled}
                      className={getInputClassName(
                        Boolean(getFieldError("quantityReceived")),
                      )}
                    />
                    <div className="flex w-24 items-center justify-center rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 shadow-sm">
                      L
                    </div>
                  </div>
                  {getFieldError("quantityReceived") && (
                    <p className="mt-1.5 text-xs font-medium text-red-600">
                      {getFieldError("quantityReceived")}
                    </p>
                  )}
                  {selectedTank &&
                    form.quantityReceived &&
                    !getFieldError("quantityReceived") && (
                      <p className="mt-1.5 text-xs font-medium text-slate-600">
                        Projected Level after fill: {projectedLevel.toFixed(2)} L
                      </p>
                    )}
                  {selectedTank &&
                    form.quantityReceived &&
                    Number(form.quantityReceived) > availableSpace && (
                      <p className="mt-1.5 text-xs font-medium text-red-600">
                        Exceeds available tank capacity
                      </p>
                    )}
                  {capacityWarning && !getFieldError("quantityReceived") && (
                    <p className="mt-1.5 text-xs font-medium text-amber-600">
                      {capacityWarning}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="transportDetails"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Transport Details
                  </label>
                  <input
                    id="transportDetails"
                    type="text"
                    placeholder={
                      isTransportEnabled
                        ? "Vehicle no., driver name, notes..."
                        : "Complete basic fields first"
                    }
                    value={form.transportDetails}
                    onChange={(event) =>
                      handleChange("transportDetails", event.target.value)
                    }
                    disabled={!isTransportEnabled}
                    className={getInputClassName(false)}
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 pt-5">
                <button
                  type="button"
                  onClick={onCancel ?? resetForm}
                  className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!isFormValid}
                  className={`rounded-xl px-5 py-2.5 text-sm font-medium text-white shadow-sm transition focus:outline-none focus:ring-4 ${
                    isFormValid
                      ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-100"
                      : "cursor-not-allowed bg-slate-400 focus:ring-slate-200"
                  }`}
                >
                  {mode === "edit" ? "Update" : "Save"}
                </button>
                <Button
                  type="button"
                  onClick={handlePostRequest}
                  disabled={!isFormValid}
                  className="h-auto rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus-visible:ring-emerald-100"
                >
                  Post
                </Button>
              </div>
            </form>
          </article>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Selected Tank Info
            </h3>
            <div className="mt-4 space-y-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Capacity
                </p>
                <p className="mt-1 text-lg font-semibold text-slate-900">
                  {selectedTank ? `${selectedTank.capacity} L` : "--"}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Current Level
                </p>
                <p className="mt-1 text-lg font-semibold text-slate-900">
                  {selectedTank ? `${selectedTank.currentLevel} L` : "--"}
                </p>
              </div>
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">
                <p className="text-xs font-medium uppercase tracking-wide text-blue-600">
                  Available Space
                </p>
                <p className="mt-1 text-lg font-semibold text-blue-700">
                  {selectedTank ? `${availableSpace} L` : "--"}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Dialog open={postConfirmOpen} onOpenChange={setPostConfirmOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Confirm Posting</DialogTitle>
            <DialogDescription>
              Are you sure you want to post this entry? This action cannot be edited later.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end">
            <Button variant="outline" onClick={() => setPostConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={handlePostConfirm}
            >
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}

export default GasProcurementEntryForm;
