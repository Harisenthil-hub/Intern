import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

/**
 * MovementTable – shows saved movement records.
 * Edit button is ONLY rendered for records that have a numeric `id`
 * (i.e. records persisted in the backend).
 *
 * Props:
 *   movements      – array of movement records
 *   onEdit(record) – callback when user clicks Edit
 */
const MovementTable = ({ movements, onEdit }) => {
    const typeBadge = (type) => {
        const styles = {
            Dispatch: 'bg-indigo-100 text-indigo-700',
            Return: 'bg-orange-100 text-orange-700',
            Internal: 'bg-gray-100 text-gray-700',
        };
        return styles[type] || 'bg-gray-100 text-gray-700';
    };

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
                                <th className="p-3">Total Items</th>
                                <th className="p-3">Status</th>
                                <th className="p-3 rounded-tr-lg">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movements.length === 0 ? (
                                <tr>
                                     <td colSpan="8" className="p-4 text-center text-gray-500">
                                        No recent movements.
                                    </td>
                                </tr>
                            ) : (
                                movements.map((record, idx) => {
                                    // Only show Edit for persisted records (id from backend)
                                    const isSaved = typeof record.id === 'number';
                                    return (
                                        <tr key={record.id ?? idx} className="border-t hover:bg-gray-50">
                                            <td className="p-3 font-medium text-blue-600">
                                                {record.movement_id ?? record.movementId ?? record.id}
                                            </td>
                                            <td className="p-3">{record.date}</td>
                                            <td className="p-3">
                                                <span
                                                    className={`px-2 py-1 text-xs rounded-full font-medium ${typeBadge(
                                                        record.movement_type ?? record.type
                                                    )}`}
                                                >
                                                    {record.movement_type ?? record.type}
                                                </span>
                                            </td>
                                            <td className="p-3">{record.from_location ?? record.from}</td>
                                            <td className="p-3">{record.to_location ?? record.to}</td>
                                            <td className="p-3 font-semibold">{record.cylinders}</td>
                                            <td className="p-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${record.is_posted === 1 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                                    {record.is_posted === 1 ? 'Posted' : 'Draft'}
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                {isSaved && record.is_posted !== 1 && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => onEdit && onEdit(record)}
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

export default MovementTable;
