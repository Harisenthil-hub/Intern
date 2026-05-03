import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardHome from "./DashboardHome";
import DispatchEntry from "./DispatchEntry";
import ReturnEntry from "./ReturnEntry";
import LocationTracker from "./LocationTracker";

// NOTE: State is no longer passed as props — each component
// fetches its own data directly from the API/Supabase

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/dispatch"  element={<DispatchEntry />} />
        <Route path="/return"    element={<ReturnEntry />} />
        <Route path="/tracker"   element={<LocationTracker />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;