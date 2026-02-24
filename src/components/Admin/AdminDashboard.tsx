"use client";

import React from "react";

export const AdminDashboardLayout: React.FC = () => {
  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>DPH Admin Dashboard</h1>
        <p>Welcome to your hospital management dashboard</p>
      </div>
      <div className="dashboard-content">
        <p>Dashboard content will be displayed here.</p>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
