import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const FillingTable = ({ fillings }) => {
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
                                <th className="p-3 rounded-tr-lg">Total Net Wt (kg)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fillings.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-4 text-center text-gray-500">No recent fillings.</td>
                                </tr>
                            ) : (
                                fillings.map((batch, idx) => (
                                    <tr key={batch.id || idx} className="border-t hover:bg-gray-50">
                                        <td className="p-3 font-medium text-blue-600">{batch.batchId}</td>
                                        <td className="p-3">{batch.date}</td>
                                        <td className="p-3">{batch.gasType}</td>
                                        <td className="p-3">{batch.tankId}</td>
                                        <td className="p-3">{batch.cylinders}</td>
                                        <td className="p-3 font-semibold">{parseFloat(batch.netWeight).toFixed(2)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
};

export default FillingTable;
