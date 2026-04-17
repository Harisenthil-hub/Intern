import { useMemo, useState } from "react";

const VENDOR_OPTIONS = [
  "AirLiquide Supplies",
  "Prime Industrial Gases",
  "National Gas Traders",
  "Apex Bulk Gas Logistics",
  "BlueLine Energy",
];

const TANK_OPTIONS = ["TNK-001", "TNK-002", "TNK-003", "TNK-004"];

export function GasProcurementEntryForm() {
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    vendorName: "",
    date: today,
    gasType: "Oxygen",
    tankId: "TNK-001",
    quantityReceived: "",
    quantityUnit: "L",
    transportDetails: "",
  });

  const [vendorQuery, setVendorQuery] = useState("");
  const [vendorListOpen, setVendorListOpen] = useState(false);

  const filteredVendors = useMemo(() => {
    const query = vendorQuery.trim().toLowerCase();
    if (!query) return VENDOR_OPTIONS;
    return VENDOR_OPTIONS.filter((vendor) =>
      vendor.toLowerCase().includes(query),
    );
  }, [vendorQuery]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const selectVendor = (vendor) => {
    handleChange("vendorName", vendor);
    setVendorQuery(vendor);
    setVendorListOpen(false);
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
                      setVendorListOpen(true);
                    }}
                    onFocus={() => setVendorListOpen(true)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
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
                    onChange={(event) => handleChange("date", event.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
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
                    onChange={(event) => handleChange("gasType", event.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  >
                    <option>Oxygen</option>
                    <option>Nitrogen</option>
                    <option>LPG</option>
                  </select>
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
                    onChange={(event) => handleChange("tankId", event.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  >
                    {TANK_OPTIONS.map((tankId) => (
                      <option key={tankId} value={tankId}>
                        {tankId}
                      </option>
                    ))}
                  </select>
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
                      placeholder="Enter quantity"
                      value={form.quantityReceived}
                      onChange={(event) =>
                        handleChange("quantityReceived", event.target.value)
                      }
                      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                    <select
                      aria-label="Quantity unit"
                      value={form.quantityUnit}
                      onChange={(event) =>
                        handleChange("quantityUnit", event.target.value)
                      }
                      className="w-24 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    >
                      <option>L</option>
                      <option>Kg</option>
                    </select>
                  </div>
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
                    placeholder="Vehicle no., driver name, notes..."
                    value={form.transportDetails}
                    onChange={(event) =>
                      handleChange("transportDetails", event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 pt-5">
                <button
                  type="button"
                  className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
                >
                  Save
                </button>
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
                <p className="mt-1 text-lg font-semibold text-slate-900">1000 L</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Current Level
                </p>
                <p className="mt-1 text-lg font-semibold text-slate-900">700 L</p>
              </div>
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">
                <p className="text-xs font-medium uppercase tracking-wide text-blue-600">
                  Available Space
                </p>
                <p className="mt-1 text-lg font-semibold text-blue-700">300 L</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default GasProcurementEntryForm;
