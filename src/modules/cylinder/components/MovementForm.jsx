import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

const MovementForm = ({ onAddMovement }) => {
    const [formData, setFormData] = useState({
        movementId: `M-${Math.floor(5000 + Math.random() * 5000)}`,
        date: new Date().toISOString().split('T')[0],
        fromLocation: 'Plant',
        toLocation: 'Customer-A',
        movementType: 'Dispatch',
    });

    const [lineItems, setLineItems] = useState([
        { id: 1, serialNumber: '', status: 'Filled' },
    ]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLineItemChange = (id, field, value) => {
        setLineItems(
            lineItems.map((item) =>
                item.id === id ? { ...item, [field]: value } : item
            )
        );
    };

    const addLineItem = () => {
        setLineItems([...lineItems, { id: Date.now(), serialNumber: '', status: formData.movementType === 'Dispatch' ? 'Filled' : 'Empty' }]);
    };

    const removeLineItem = (id) => {
        if (lineItems.length > 1) {
            setLineItems(lineItems.filter((item) => item.id !== id));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        onAddMovement({
            ...formData,
            from: formData.fromLocation,
            to: formData.toLocation,
            type: formData.movementType,
            cylinders: lineItems.length,
            lineItems
        });

        setFormData({
            movementId: `M-${Math.floor(5000 + Math.random() * 5000)}`,
            date: new Date().toISOString().split('T')[0],
            fromLocation: 'Plant',
            toLocation: 'Customer-A',
            movementType: 'Dispatch',
        });
        setLineItems([{ id: Date.now(), serialNumber: '', status: 'Filled' }]);
    };

    return (
        <Card className="mb-8">
            <CardHeader>
                <CardTitle>Record Cylinder Movement</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    {/* Header Info */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                        <div>
                            <label className="text-sm font-medium mb-1 block">Movement ID</label>
                            <input type="text" name="movementId" value={formData.movementId} onChange={handleInputChange} className="w-full p-2 border rounded-md bg-gray-50" readOnly />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Date</label>
                            <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full p-2 border rounded-md" required />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Type</label>
                            <select name="movementType" value={formData.movementType} onChange={handleInputChange} className="w-full p-2 border rounded-md">
                                <option>Dispatch</option>
                                <option>Return</option>
                                <option>Internal</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">From</label>
                            <input type="text" name="fromLocation" value={formData.fromLocation} onChange={handleInputChange} className="w-full p-2 border rounded-md" required />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">To</label>
                            <input type="text" name="toLocation" value={formData.toLocation} onChange={handleInputChange} className="w-full p-2 border rounded-md" required />
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
                                            <input type="text" required value={item.serialNumber} onChange={(e) => handleLineItemChange(item.id, 'serialNumber', e.target.value)} placeholder="Scan or enter SN" className="w-full p-2 border rounded" />
                                        </td>
                                        <td className="p-2">
                                            <select value={item.status} onChange={(e) => handleLineItemChange(item.id, 'status', e.target.value)} className="w-full p-2 border rounded">
                                                <option>Filled</option>
                                                <option>Empty</option>
                                                <option>Faulty</option>
                                            </select>
                                        </td>
                                        <td className="p-2 text-center">
                                            <Button type="button" variant="ghost" size="icon" onClick={() => removeLineItem(item.id)} className="text-red-500 hover:text-red-700">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="bg-gray-50 p-2 border-t">
                            <Button type="button" variant="outline" size="sm" onClick={addLineItem} className="text-blue-600 border-blue-200 hover:bg-blue-50">
                                <Plus className="h-4 w-4 mr-2" /> Add Item
                            </Button>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">Save Movement</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default MovementForm;
