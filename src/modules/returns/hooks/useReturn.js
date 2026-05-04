import { useState } from "react";
import { fetchReturns, saveReturn, postReturn } from "../services/returnService";

const EMPTY = {
  returnId: "", customerName: "", date: "",
  cylinders: [{ serial: "", condition: "Good" }]
};

export function useReturn() {
  const [formData, setFormData] = useState(EMPTY);
  const [entries, setEntries]   = useState([]);
  const [editId, setEditId]     = useState(null);
  const [view, setView]         = useState("list");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const loadRecords = async () => {
    try {
      setLoading(true);
      const data = await fetchReturns();
      setEntries(Array.isArray(data) ? data : []);
    } catch { setError("Failed to load records."); }
    finally { setLoading(false); }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCylinderChange = (i, e) => {
    const updated = [...formData.cylinders];
    updated[i] = { ...updated[i], [e.target.name]: e.target.value };
    setFormData({ ...formData, cylinders: updated });
  };

  const addCylinder = () =>
    setFormData({ ...formData, cylinders: [...formData.cylinders, { serial: "", condition: "Good" }] });

  const removeCylinder = (i) =>
    setFormData({ ...formData, cylinders: formData.cylinders.filter((_, idx) => idx !== i) });

  const handleSave = async (status) => {
    try {
      setLoading(true); setError("");
      if (status === "posted") await postReturn(formData, editId);
      else await saveReturn(formData, editId);
      await loadRecords();
      setFormData(EMPTY); setEditId(null); setView("list");
    } catch (err) { setError(err.message || "Failed to save."); }
    finally { setLoading(false); }
  };

  const handleEdit = (entry) => {
    setFormData({ returnId: entry.returnId, customerName: entry.customerName,
      date: entry.date, cylinders: entry.cylinders });
    setEditId(entry._id); setView("form");
  };

  const handleNewEntry = () => { setFormData(EMPTY); setEditId(null); setError(""); setView("form"); };
  const handleCancel   = () => { setFormData(EMPTY); setEditId(null); setError(""); setView("list"); };

  return {
    formData, entries, editId, view, loading, error,
    loadRecords, handleChange, handleCylinderChange,
    addCylinder, removeCylinder, handleSave,
    handleEdit, handleNewEntry, handleCancel,
  };
}
