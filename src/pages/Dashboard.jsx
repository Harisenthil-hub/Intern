import React from 'react';
import DashboardCards from '../modules/cylinder/components/DashboardCards';
import PageHeader from '../components/common/PageHeader';

const Dashboard = () => {
  return (
    <div>
      <PageHeader title="Cylinder Stock Dashboard" description="Overview of cylinder inventory and statuses." />
      <DashboardCards />
    </div>
  );
};

export default Dashboard;
