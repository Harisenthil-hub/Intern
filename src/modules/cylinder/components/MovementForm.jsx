import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, CheckCircle, AlertCircle } from 'lucide-react';

/**
 * MovementForm – handles both creating (POST) and editing (PUT) movement records.
 *
 * Props:
 *   onSave(savedRecord)     – called after a successful POST
 *   onUpdate(updatedRecord) – called after a successful PUT
 *   editRecord              – when set, pre-populates form and switches to edit mode
 *   onCancelEdit()          – clears edit mode from the parent
 */
const MovementForm = ({ onSave, onUpdate, editRecord, onCancelEdit }) => {
    const blankForm = () => ({
        movement_id: `M-${Math.floor(5000 + Math.random() * 5000)}`,
        date: new Date().toISOString().split('T')[0],
        from_location: 'Plant',
        to_location: 'Customer-A',
        movement_type: 'Dispatch',
    });

    const blankLine = () => ({
        id: Date.now() + Math.random(),
        serialNumber: '',
        status: 'Filled',
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
                movement_id: editRecord.movement_id,
                date: editRecord.date,
                from_location: editRecord.from_location,
                to_location: editRecord.to_location,
                movement_type: editRecord.movement_type,
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

    const addLineItem = () =>
        setLineItems([
            ...lineItems,
            {
                id: Date.now() + Math.random(),
                serialNumber: '',
                status: formData.movement_type === 'Dispatch' ? 'Filled' : 'Empty',
            },
        ]);

    const removeLineItem = (id) => {
        if (lineItems.length > 1) setLineItems(lineItems.filter((item) => item.id !== id));
    };

    const buildPayload = () => ({
        ...formData,
        cylinders: lineItems.length,
        line_items: lineItems,
    });

    // ── Submit handler ─────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEditing) {
                const updated = await import('../services/cylinderMovementApi').then((m) =>
                    m.updateMovement(editId, buildPayload())
                );
                setToast({ type: 'success', message: 'Entry Updated' });
                onUpdate && onUpdate(updated);
                onCancelEdit && onCancelEdit();
            } else {
                const saved = await import('../services/cylinderMovementApi').then((m) =>
                    m.saveMovement(buildPayload())
                );
                setToast({ type: 'success', message: 'Entry Saved' });
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
                <CardTitle>{isEditing ? 'Edit Cylinder Movement' : 'Record Cylinder Movement'}</CardTitle>
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

                <form onSubmit={handleSubmit}>
                    {/* Header Info */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                        <div>
                            <label className="text-sm font-medium mb-1 block">Movement ID</label>
                            <input
                                type="text"
                                name="movement_id"
                                value={formData.movement_id}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded-md bg-gray-50"
                                readOnly
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
                            <label className="text-sm font-medium mb-1 block">Type</label>
                            <select
                                name="movement_type"
                                value={formData.movement_type}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded-md"
                            >
                                <option>Dispatch</option>
                                <option>Return</option>
                                <option>Internal</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">From</label>
                            <input
                                type="text"
                                name="from_location"
                                value={formData.from_location}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">To</label>
                            <input
                                type="text"
                                name="to_location"
                                value={formData.to_location}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>
                    </div>

                    {/* Line Items */}
                    <div className="border rounded-md overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-700">
                                <tr>
                                    <th className="p-3">Serial Number</th>
                                    <th className="p-3">Cylinder Status</th>
                                    <th className="p-3 w-20">Action</th>
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
                                                placeholder="Scan or enter SN"
                                                className="w-full p-2 border rounded"
                                            />
                                        </td>
                                        <td className="p-2">
                                            <select
                                                value={item.status}
                                                onChange={(e) =>
                                                    handleLineItemChange(item.id, 'status', e.target.value)
                                                }
                                                className="w-full p-2 border rounded"
                                            >
                                                <option>Filled</option>
                                                <option>Empty</option>
                                                <option>Faulty</option>
                                            </select>
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
                                <Plus className="h-4 w-4 mr-2" /> Add Item
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
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={loading}
                        >
                            {loading ? 'Saving…' : isEditing ? 'Update Movement' : 'Save Movement'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default MovementForm;
