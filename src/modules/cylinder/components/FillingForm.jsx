import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, CheckCircle, AlertCircle } from 'lucide-react';

/**
 * FillingForm – handles both creating (POST) and editing (PUT) filling batches.
 *
 * Props:
 *   onSave(savedRecord)   – called after a successful POST
 *   onUpdate(updatedRecord) – called after a successful PUT
 *   editRecord            – when set, pre-populates form and switches to edit mode
 *   onCancelEdit()        – clears edit mode from the parent
 */
const FillingForm = ({ onSave, onUpdate, editRecord, onCancelEdit }) => {
    const blankForm = () => ({
        batch_id: `B-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString().split('T')[0],
        gas_type: 'Oxygen',
        tank_id: 'T-01',
    });

    const blankLine = () => ({
        id: Date.now() + Math.random(),
        serialNumber: '',
        emptyWeight: '',
        filledWeight: '',
    });

    const [formData, setFormData] = useState(blankForm());
    const [lineItems, setLineItems] = useState([blankLine()]);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [toast, setToast] = useState(null);   // { type: 'success'|'error', message }
    const [loading, setLoading] = useState(false);

    // ── Sync with parent-controlled editRecord ─────────────────────────────
    useEffect(() => {
        if (editRecord) {
            setFormData({
                batch_id: editRecord.batch_id,
                date: editRecord.date,
                gas_type: editRecord.gas_type,
                tank_id: editRecord.tank_id,
            });
            setLineItems(
                editRecord.line_items && editRecord.line_items.length > 0
                    ? editRecord.line_items.map((li, i) => ({ ...li, id: li.id ?? i }))
                    : [blankLine()]
            );
            setIsEditing(true);
            setEditId(editRecord.id);
        } else {
            setFormData(blankForm());
            setLineItems([blankLine()]);
            setIsEditing(false);
            setEditId(null);
        }
    }, [editRecord]);

    // Auto-dismiss toast after 3 s
    useEffect(() => {
        if (toast) {
            const t = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(t);
        }
    }, [toast]);

    // ── Helpers ────────────────────────────────────────────────────────────
    const handleInputChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleLineItemChange = (id, field, value) =>
        setLineItems(lineItems.map((item) => (item.id === id ? { ...item, [field]: value } : item)));

    const addLineItem = () => setLineItems([...lineItems, blankLine()]);

    const removeLineItem = (id) => {
        if (lineItems.length > 1) setLineItems(lineItems.filter((item) => item.id !== id));
    };

    const calculateNet = (empty, filled) => {
        const e = parseFloat(empty);
        const f = parseFloat(filled);
        return !isNaN(e) && !isNaN(f) && f > e ? (f - e).toFixed(2) : '0.00';
    };

    const totalNetWeight = () =>
        lineItems.reduce((acc, item) => acc + parseFloat(calculateNet(item.emptyWeight, item.filledWeight)), 0);

    const buildPayload = (isPosted) => ({
        ...formData,
        cylinders: lineItems.length,
        net_weight: totalNetWeight(),
        line_items: lineItems,
        is_posted: isPosted ? 1 : 0,
    });

    // ── Submit handler ─────────────────────────────────────────────────────
    const handleSubmit = async (e, isPosted = false) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            if (isEditing) {
                const updated = await import('../services/cylinderFillingApi').then((m) =>
                    m.updateFilling(editId, buildPayload(isPosted))
                );
                setToast({ type: 'success', message: isPosted ? 'Entry Posted' : 'Entry Updated' });
                onUpdate && onUpdate(updated);
                onCancelEdit && onCancelEdit();
            } else {
                const saved = await import('../services/cylinderFillingApi').then((m) =>
                    m.saveFilling(buildPayload(isPosted))
                );
                setToast({ type: 'success', message: isPosted ? 'Entry Posted' : 'Entry Saved' });
                onSave && onSave(saved);
                setFormData(blankForm());
                setLineItems([blankLine()]);
            }
        } catch (err) {
            setToast({ type: 'error', message: err.message });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        onCancelEdit && onCancelEdit();
    };

    // ── Render ─────────────────────────────────────────────────────────────
    return (
        <Card className="mb-8">
            <CardHeader>
                <CardTitle>{isEditing ? 'Edit Filling Batch' : 'New Filling Batch'}</CardTitle>
            </CardHeader>
            <CardContent>
                {/* Toast */}
                {toast && (
                    <div
                        className={`flex items-center gap-2 mb-4 p-3 rounded-md text-sm font-medium ${
                            toast.type === 'success'
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                    >
                        {toast.type === 'success' ? (
                            <CheckCircle className="h-4 w-4" />
                        ) : (
                            <AlertCircle className="h-4 w-4" />
                        )}
                        {toast.message}
                    </div>
                )}

                <form onSubmit={(e) => e.preventDefault()}>
                    {/* Header Info */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div>
                            <label className="text-sm font-medium mb-1 block">Batch ID</label>
                            <input
                                type="text"
                                name="batch_id"
                                value={formData.batch_id}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Date</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Gas Type</label>
                            <select
                                name="gas_type"
                                value={formData.gas_type}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded-md"
                            >
                                <option>Oxygen</option>
                                <option>Nitrogen</option>
                                <option>Argon</option>
                                <option>CO2</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Tank ID</label>
                            <select
                                name="tank_id"
                                value={formData.tank_id}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded-md"
                            >
                                <option>T-01</option>
                                <option>T-02</option>
                                <option>T-03</option>
                            </select>
                        </div>
                    </div>

                    {/* Line Items */}
                    <div className="border rounded-md overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-700">
                                <tr>
                                    <th className="p-3">Serial Number</th>
                                    <th className="p-3">Empty Wt (kg)</th>
                                    <th className="p-3">Filled Wt (kg)</th>
                                    <th className="p-3">Net Gas (kg)</th>
                                    <th className="p-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lineItems.map((item) => (
                                    <tr key={item.id} className="border-t">
                                        <td className="p-2">
                                            <input
                                                type="text"
                                                required
                                                value={item.serialNumber}
                                                onChange={(e) =>
                                                    handleLineItemChange(item.id, 'serialNumber', e.target.value)
                                                }
                                                className="w-full p-1 border rounded"
                                            />
                                        </td>
                                        <td className="p-2">
                                            <input
                                                type="number"
                                                step="0.01"
                                                required
                                                value={item.emptyWeight}
                                                onChange={(e) =>
                                                    handleLineItemChange(item.id, 'emptyWeight', e.target.value)
                                                }
                                                className="w-full p-1 border rounded"
                                            />
                                        </td>
                                        <td className="p-2">
                                            <input
                                                type="number"
                                                step="0.01"
                                                required
                                                value={item.filledWeight}
                                                onChange={(e) =>
                                                    handleLineItemChange(item.id, 'filledWeight', e.target.value)
                                                }
                                                className="w-full p-1 border rounded"
                                            />
                                        </td>
                                        <td className="p-2 font-medium">
                                            {calculateNet(item.emptyWeight, item.filledWeight)}
                                        </td>
                                        <td className="p-2 text-center">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeLineItem(item.id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="bg-gray-50 p-2 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addLineItem}
                                className="text-blue-600 border-blue-200 hover:bg-blue-50"
                            >
                                <Plus className="h-4 w-4 mr-2" /> Add Cylinder
                            </Button>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex justify-end gap-3">
                        {isEditing && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancel}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                        )}
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={(e) => handleSubmit(e, false)}
                            disabled={loading}
                        >
                            {loading ? 'Saving…' : isEditing ? 'Update Draft' : 'Save as Draft'}
                        </Button>
                        <Button
                            type="button"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={(e) => handleSubmit(e, true)}
                            disabled={loading}
                        >
                            {loading ? 'Posting…' : 'Post Data'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default FillingForm;
