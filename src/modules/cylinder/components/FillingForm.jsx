import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

const FillingForm = ({ onAddBatch }) => {
    const [formData, setFormData] = useState({
        batchId: `B-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString().split('T')[0],
        gasType: 'Oxygen',
        tankId: 'T-01',
    });

    const [lineItems, setLineItems] = useState([
        { id: 1, serialNumber: '', emptyWeight: '', filledWeight: '' },
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
        setLineItems([...lineItems, { id: Date.now(), serialNumber: '', emptyWeight: '', filledWeight: '' }]);
    };

    const removeLineItem = (id) => {
        if (lineItems.length > 1) {
            setLineItems(lineItems.filter((item) => item.id !== id));
        }
    };

    const calculateNet = (empty, filled) => {
        const e = parseFloat(empty);
        const f = parseFloat(filled);
        if (!isNaN(e) && !isNaN(f) && f > e) {
            return (f - e).toFixed(2);
        }
        return '0.00';
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Calculate total net weight
        const totalNetWeight = lineItems.reduce((acc, item) => {
            return acc + parseFloat(calculateNet(item.emptyWeight, item.filledWeight));
        }, 0);

        const completeBatch = {
            ...formData,
            cylinders: lineItems.length,
            netWeight: totalNetWeight,
            lineItems
        };

        onAddBatch(completeBatch);

        // Reset form
        setFormData({
            batchId: `B-${Math.floor(1000 + Math.random() * 9000)}`,
            date: new Date().toISOString().split('T')[0],
            gasType: 'Oxygen',
            tankId: 'T-01',
        });
        setLineItems([{ id: Date.now(), serialNumber: '', emptyWeight: '', filledWeight: '' }]);
    };

    return (
        <Card className="mb-8">
            <CardHeader>
                <CardTitle>New Filling Batch</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    {/* Header Info */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div>
                            <label className="text-sm font-medium mb-1 block">Batch ID</label>
                            <input type="text" name="batchId" value={formData.batchId} onChange={handleInputChange} className="w-full p-2 border rounded-md" required />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Date</label>
                            <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full p-2 border rounded-md" required />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Gas Type</label>
                            <select name="gasType" value={formData.gasType} onChange={handleInputChange} className="w-full p-2 border rounded-md">
                                <option>Oxygen</option>
                                <option>Nitrogen</option>
                                <option>Argon</option>
                                <option>CO2</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Tank ID</label>
                            <select name="tankId" value={formData.tankId} onChange={handleInputChange} className="w-full p-2 border rounded-md">
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
                                        <td className="p-2"><input type="text" required value={item.serialNumber} onChange={(e) => handleLineItemChange(item.id, 'serialNumber', e.target.value)} className="w-full p-1 border rounded" /></td>
                                        <td className="p-2"><input type="number" step="0.01" required value={item.emptyWeight} onChange={(e) => handleLineItemChange(item.id, 'emptyWeight', e.target.value)} className="w-full p-1 border rounded" /></td>
                                        <td className="p-2"><input type="number" step="0.01" required value={item.filledWeight} onChange={(e) => handleLineItemChange(item.id, 'filledWeight', e.target.value)} className="w-full p-1 border rounded" /></td>
                                        <td className="p-2 font-medium">{calculateNet(item.emptyWeight, item.filledWeight)}</td>
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
                                <Plus className="h-4 w-4 mr-2" /> Add Cylinder
                            </Button>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">Save Filling Batch</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default FillingForm;
