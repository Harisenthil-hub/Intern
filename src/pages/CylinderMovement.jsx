import React, { useState, useEffect } from 'react';
import { getMockData } from '../modules/cylinder/services/mockData';
import PageHeader from '../components/common/PageHeader';
import MovementForm from '../modules/cylinder/components/MovementForm';
import MovementTable from '../modules/cylinder/components/MovementTable';

const CylinderMovement = () => {
    const [movements, setMovements] = useState([]);

    useEffect(() => {
        // Load local initial state based on mock data
        setMovements(getMockData().movements);
    }, []);

    const handleAddMovement = (newMovement) => {
        setMovements([newMovement, ...movements]);
    };

    return (
        <div>
            <PageHeader
                title="Cylinder Movement"
                description="Track dispatch, returns, and internal transfers of cylinders."
            />
            <MovementForm onAddMovement={handleAddMovement} />
            <MovementTable movements={movements} />
        </div>
    );
};

export default CylinderMovement;
