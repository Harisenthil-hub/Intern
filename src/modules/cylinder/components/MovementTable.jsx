import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MovementTable = ({ movements }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Movement History</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-700">
                            <tr>
                                <th className="p-3 rounded-tl-lg">Movement ID</th>
                                <th className="p-3">Date</th>
                                <th className="p-3">Type</th>
                                <th className="p-3">From</th>
                                <th className="p-3">To</th>
                                <th className="p-3 rounded-tr-lg">Total Items</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movements.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-4 text-center text-gray-500">No recent movements.</td>
                                </tr>
                            ) : (
                                movements.map((record) => (
                                    <tr key={record.movementId || record.id} className="border-t hover:bg-gray-50">
                                        <td className="p-3 font-medium text-blue-600">{record.movementId || record.id}</td>
                                        <td className="p-3">{record.date}</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${record.type === 'Dispatch' ? 'bg-indigo-100 text-indigo-700' :
                                                    record.type === 'Return' ? 'bg-orange-100 text-orange-700' :
                                                        'bg-gray-100 text-gray-700'
                                                }`}>
                                                {record.type}
                                            </span>
                                        </td>
                                        <td className="p-3">{record.from}</td>
                                        <td className="p-3">{record.to}</td>
                                        <td className="p-3 font-semibold">{record.cylinders}</td>
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

export default MovementTable;
