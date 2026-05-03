import React, { useState, useEffect } from 'react';
import PageHeader from '../components/common/PageHeader';
import FillingForm from '../modules/cylinder/components/FillingForm';
import FillingTable from '../modules/cylinder/components/FillingTable';
import { fetchFillings } from '../modules/cylinder/services/cylinderFillingApi';

const CylinderFilling = () => {
    const [fillings, setFillings] = useState([]);
    const [editRecord, setEditRecord] = useState(null);

    // Load persisted records from backend on mount
    useEffect(() => {
        fetchFillings()
            .then(setFillings)
            .catch(console.error);
    }, []);

    /** After a successful POST, prepend the saved record (has backend id) */
    const handleSave = (saved) => {
        setFillings((prev) => [saved, ...prev]);
    };

    /** After a successful PUT, replace the updated record in-list */
    const handleUpdate = (updated) => {
        setFillings((prev) =>
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
                title="Cylinder Filling"
                description="Record batch-wise cylinder filling details and net weights."
            />
            <FillingForm
                onSave={handleSave}
                onUpdate={handleUpdate}
                editRecord={editRecord}
                onCancelEdit={handleCancelEdit}
            />
            <FillingTable
                fillings={fillings}
                onEdit={handleEdit}
            />
        </div>
    );
};

export default CylinderFilling;
