import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Dashboard } from "../pages/Dashboard";
import { TankMaster } from "../pages/TankMaster";
import { Monitoring } from "../pages/Monitoring";
import { Production } from "../pages/Production";

export function AppRoutes() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tanks" element={<TankMaster />} />
          <Route path="/monitoring" element={<Monitoring />} />
          <Route path="/production" element={<Production />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
