import React, { useState, useEffect } from 'react';
import PageHeader from '../components/common/PageHeader';
import MovementForm from '../modules/cylinder/components/MovementForm';
import MovementTable from '../modules/cylinder/components/MovementTable';
import { fetchMovements } from '../modules/cylinder/services/cylinderMovementApi';

const CylinderMovement = () => {
    const [movements, setMovements] = useState([]);
    const [editRecord, setEditRecord] = useState(null);

    // Load persisted records from backend on mount
    useEffect(() => {
        fetchMovements()
            .then(setMovements)
            .catch(console.error);
    }, []);

    /** After a successful POST, prepend the saved record (has backend id) */
    const handleSave = (saved) => {
        setMovements((prev) => [saved, ...prev]);
    };

    /** After a successful PUT, replace the updated record in-list */
    const handleUpdate = (updated) => {
        setMovements((prev) =>
            prev.map((r) => (r.id === updated.id ? updated : r))
        );
        setEditRecord(null);
    };

    /** Triggered by Edit button in table row */
    const handleEdit = (record) => {
        setEditRecord(record);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    /** Cancel edit mode */
    const handleCancelEdit = () => {
        setEditRecord(null);
    };

    return (
        <div>
            <PageHeader
                title="Cylinder Movement"
                description="Track dispatch, returns, and internal transfers of cylinders."
            />
            <MovementForm
                onSave={handleSave}
                onUpdate={handleUpdate}
                editRecord={editRecord}
                onCancelEdit={handleCancelEdit}
            />
            <MovementTable
                movements={movements}
                onEdit={handleEdit}
            />
        </div>
    );
};

export default CylinderMovement;
