import React from 'react';
import Sidebar from './Sidebar';
import './DashboardLayout.css';

export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        {children}
      </div>
    </div>
  );
}
