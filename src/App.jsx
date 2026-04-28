import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import DispatchPage from "./pages/DispatchPage";
import ReturnPage from "./pages/ReturnPage";
import TrackerPage from "./pages/TrackerPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dispatch"  element={<DispatchPage />} />
        <Route path="/return"    element={<ReturnPage />} />
        <Route path="/tracker"   element={<TrackerPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
