export const getMockData = () => {
    return {
        dashboard: {
            totalCylinders: 1540,
            filled: 820,
            empty: 310,
            inTransit: 140,
            withCustomers: 210,
            underMaintenance: 60,
        },
        fillings: [
            { id: 1, batchId: "B-1001", date: "2026-04-10", gasType: "Oxygen", tankId: "T-01", cylinders: 45, netWeight: 1450 },
            { id: 2, batchId: "B-1002", date: "2026-04-11", gasType: "Nitrogen", tankId: "T-04", cylinders: 20, netWeight: 680 },
        ],
        movements: [
            { id: "M-5001", date: "2026-04-15", from: "Plant", to: "Customer-A", type: "Dispatch", cylinders: 50 },
            { id: "M-5002", date: "2026-04-16", from: "Customer-B", to: "Plant", type: "Return", cylinders: 30 },
        ]
    };
};
