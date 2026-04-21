import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Dashboard } from "../pages/Dashboard";
import { TankMaster } from "../pages/TankMaster";
import { Monitoring } from "../pages/Monitoring";
import { Production } from "../pages/Production";
import { GasProcurement } from "../pages/GasProcurement";
import { GasProcurementEntry } from "../pages/GasProcurementEntry";
import { GasIssueToFilling } from "../pages/GasIssueToFilling";
import { GasIssueToFillingEntry } from "../pages/GasIssueToFillingEntry";
import { LossLeakageMonitoring } from "../pages/LossLeakageMonitoring";
import { LossLeakageMonitoringEntry } from "../pages/LossLeakageMonitoringEntry";
import { Layout } from "@/components/layout/Layout";
import { ProcurementStoreProvider } from "@/modules/procurement/ProcurementStore";
import { GasIssueStoreProvider } from "@/modules/filling/GasIssueStore";
import { LossLeakageStoreProvider } from "@/modules/lossLeakage/LossLeakageStore";

export function AppRoutes() {
  return (
    <>
      <BrowserRouter>
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
                  <Route
                    path="/loss-leakage-monitoring/new"
                    element={<LossLeakageMonitoringEntry />}
                  />
                  <Route
                    path="/loss-leakage-monitoring/:id/edit"
                    element={<LossLeakageMonitoringEntry />}
                  />
                  <Route
                    path="/issue-to-filling/:id/edit"
                    element={<GasIssueToFillingEntry />}
                  />
                </Route>
              </Routes>
            </LossLeakageStoreProvider>
          </GasIssueStoreProvider>
        </ProcurementStoreProvider>
      </BrowserRouter>
    </>
  );
}
