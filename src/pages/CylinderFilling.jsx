import React, { useState, useEffect } from 'react';
import { getMockData } from '../modules/cylinder/services/mockData';
import PageHeader from '../components/common/PageHeader';
import FillingForm from '../modules/cylinder/components/FillingForm';
import FillingTable from '../modules/cylinder/components/FillingTable';

const CylinderFilling = () => {
    const [fillings, setFillings] = useState([]);

    useEffect(() => {
        // Load local initial state based on mock data
        setFillings(getMockData().fillings);
    }, []);

    const handleAddBatch = (newBatch) => {
        const batchWithId = {
            ...newBatch,
            id: Date.now()
        };
        setFillings([batchWithId, ...fillings]);
    };

    return (
        <div>
            <PageHeader
                title="Cylinder Filling"
                description="Record batch-wise cylinder filling details and net weights."
            />
            <FillingForm onAddBatch={handleAddBatch} />
            <FillingTable fillings={fillings} />
        </div>
    );
};

export default CylinderFilling;
