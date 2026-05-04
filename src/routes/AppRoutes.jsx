import React from 'react';
import { Route, Routes, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Dashboard } from "../pages/Dashboard";
import CylinderFilling from '../pages/CylinderFilling';
import CylinderMovement from '../pages/CylinderMovement';
import { TankMaster } from "../pages/TankMaster";
import { Monitoring } from "../pages/Monitoring";
import { Production } from "../pages/Production";
import { GasProcurement } from "../pages/GasProcurement";
import { GasProcurementEntry } from "../pages/GasProcurementEntry";
import { GasIssueToFilling } from "../pages/GasIssueToFilling";
import { GasIssueToFillingEntry } from "../pages/GasIssueToFillingEntry";
import { LossLeakageMonitoring } from "../pages/LossLeakageMonitoring";
import { LossLeakageMonitoringEntry } from "../pages/LossLeakageMonitoringEntry";
import DispatchEntry from "../pages/DispatchEntry";
import ReturnEntry from "../pages/ReturnEntry";
import LocationTracker from "../pages/LocationTracker";

import { ProcurementStoreProvider } from "@/modules/procurement/ProcurementStore";
import { GasIssueStoreProvider } from "@/modules/filling/GasIssueStore";
import { LossLeakageStoreProvider } from "@/modules/lossLeakage/LossLeakageStore";

const AppRoutes = () => {
  return (
    <ProcurementStoreProvider>
      <GasIssueStoreProvider>
        <LossLeakageStoreProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/tanks" element={<TankMaster />} />
              <Route path="/monitoring" element={<Monitoring />} />
              <Route path="/production" element={<Production />} />
              <Route path="/procurement" element={<GasProcurement />} />
              <Route path="/procurement/new" element={<GasProcurementEntry />} />
              <Route path="/procurement/:id/edit" element={<GasProcurementEntry />} />
              <Route path="/issue-to-filling" element={<GasIssueToFilling />} />
              <Route path="/issue-to-filling/new" element={<GasIssueToFillingEntry />} />
              <Route path="/loss-leakage-monitoring" element={<LossLeakageMonitoring />} />
              <Route path="/loss-leakage-monitoring/new" element={<LossLeakageMonitoringEntry />} />
              <Route path="/loss-leakage-monitoring/:id/edit" element={<LossLeakageMonitoringEntry />} />
              <Route path="/issue-to-filling/:id/edit" element={<GasIssueToFillingEntry />} />
              
              {/* Cylinder routes */}
              <Route path="/filling" element={<CylinderFilling />} />
              <Route path="/movement" element={<CylinderMovement />} />

              {/* Inventory Management routes */}
              <Route path="/dispatch" element={<DispatchEntry />} />
              <Route path="/return" element={<ReturnEntry />} />
              <Route path="/tracker" element={<LocationTracker />} />
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </LossLeakageStoreProvider>
      </GasIssueStoreProvider>
    </ProcurementStoreProvider>
  );
};

export default AppRoutes;
