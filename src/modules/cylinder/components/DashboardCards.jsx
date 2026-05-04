import React, { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Box, CheckCircle, Circle, DivideCircle, Users, Wrench } from 'lucide-react';

const statConfig = [
    { key: 'totalCylinders', label: 'Total Cylinders', icon: Box, color: 'text-blue-600', bg: 'bg-blue-100' },
    { key: 'filled', label: 'Filled / Ready', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    { key: 'empty', label: 'Empty at Plant', icon: Circle, color: 'text-gray-600', bg: 'bg-gray-100' },
    { key: 'inTransit', label: 'In Transit', icon: DivideCircle, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { key: 'withCustomers', label: 'With Customers', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { key: 'underMaintenance', label: 'Under Maintenance', icon: Wrench, color: 'text-red-600', bg: 'bg-red-100' },
];

const DashboardCards = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetchApi('/dashboard/cylinder');
                setData(res);
            } catch (error) {
                console.error('Failed to load cylinder dashboard stats', error);
            }
        };
        load();
    }, []);

    if (!data) return null;

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {statConfig.map((stat) => {
                const Icon = stat.icon;
                return (
                    <Card key={stat.key}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                            <div className={`${stat.bg} ${stat.color} p-2 rounded-full`}>
                                <Icon className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{data[stat.key].toLocaleString()}</div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};

export default DashboardCards;
