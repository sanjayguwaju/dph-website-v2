"use client";

import React from "react";

export const AfterDashboard: React.FC = () => {
  return (
    <div className="dashboard-footer">
      <p>DPH Admin Panel &copy; {new Date().getFullYear()}</p>
    </div>
  );
};

export default AfterDashboard;
