import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Dashboard } from "../pages/Dashboard";
import { TankMaster } from "../pages/TankMaster";
import { Monitoring } from "../pages/Monitoring";
import { Production } from "../pages/Production";
import { GasProcurement } from "../pages/GasProcurement";
import { Layout } from "@/components/layout/Layout";

export function AppRoutes() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tanks" element={<TankMaster />} />
            <Route path="/monitoring" element={<Monitoring />} />
            <Route path="/production" element={<Production />} />
            <Route path="/procurement" element={<GasProcurement />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
