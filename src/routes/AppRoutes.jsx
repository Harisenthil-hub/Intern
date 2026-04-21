import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Dashboard } from "../pages/Dashboard";
import { TankMaster } from "../pages/TankMaster";
import { Monitoring } from "../pages/Monitoring";
import { Production } from "../pages/Production";
import { GasProcurement } from "../pages/GasProcurement";
import { GasProcurementEntry } from "../pages/GasProcurementEntry";
import { GasIssueToFilling } from "../pages/GasIssueToFilling";
import { Layout } from "@/components/layout/Layout";
import { ProcurementStoreProvider } from "@/modules/procurement/ProcurementStore";

export function AppRoutes() {
  return (
    <>
      <BrowserRouter>
        <ProcurementStoreProvider>
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
            </Route>
          </Routes>
        </ProcurementStoreProvider>
      </BrowserRouter>
    </>
  );
}
