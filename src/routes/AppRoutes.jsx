import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Dashboard from '../pages/Dashboard';
import CylinderFilling from '../pages/CylinderFilling';
import CylinderMovement from '../pages/CylinderMovement';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="filling" element={<CylinderFilling />} />
        <Route path="movement" element={<CylinderMovement />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
