import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

/**
 * FillingTable – shows saved filling records.
 * Edit button is ONLY rendered for records that have a numeric `id`
 * (i.e. records that have been stored in the backend).
 *
 * Props:
 *   fillings       – array of filling records
 *   onEdit(record) – callback when user clicks Edit
 */
const FillingTable = ({ fillings, onEdit }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Fillings</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-700">
                            <tr>
                                <th className="p-3 rounded-tl-lg">Batch ID</th>
                                <th className="p-3">Date</th>
                                <th className="p-3">Gas Type</th>
                                <th className="p-3">Tank ID</th>
                                <th className="p-3">Cylinders</th>
                                <th className="p-3">Total Net Wt (kg)</th>
                                <th className="p-3">Status</th>
                                <th className="p-3 rounded-tr-lg">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fillings.length === 0 ? (
                                <tr>
                                     <td colSpan="8" className="p-4 text-center text-gray-500">
                                        No recent fillings.
                                    </td>
                                </tr>
                            ) : (
                                fillings.map((batch, idx) => {
                                    // Only show Edit for persisted records (id from backend)
                                    const isSaved = typeof batch.id === 'number';
                                    return (
                                        <tr key={batch.id ?? idx} className="border-t hover:bg-gray-50">
                                            <td className="p-3 font-medium text-blue-600">
                                                {batch.batch_id ?? batch.batchId}
                                            </td>
                                            <td className="p-3">{batch.date}</td>
                                            <td className="p-3">{batch.gas_type ?? batch.gasType}</td>
                                            <td className="p-3">{batch.tank_id ?? batch.tankId}</td>
                                            <td className="p-3">{batch.cylinders}</td>
                                            <td className="p-3 font-semibold">
                                                {parseFloat(batch.net_weight ?? batch.netWeight ?? 0).toFixed(2)}
                                            </td>
                                            <td className="p-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${batch.is_posted === 1 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                                    {batch.is_posted === 1 ? 'Posted' : 'Draft'}
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                {isSaved && batch.is_posted !== 1 && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => onEdit && onEdit(batch)}
                                                        className="text-blue-600 border-blue-200 hover:bg-blue-50 flex items-center gap-1"
                                                    >
                                                        <Pencil className="h-3 w-3" />
                                                        Edit
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
};

export default FillingTable;
