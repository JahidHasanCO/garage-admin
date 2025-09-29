import React from 'react';
import { DASHBOARD_CONFIG } from '../../config/dashboardConfig';

/**
 * DashboardHeader Component - Displays dashboard title and subtitle
 */
export const DashboardHeader = () => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {DASHBOARD_CONFIG.TEXT.DASHBOARD_TITLE}
      </h1>
      <p className="text-gray-600">
        {DASHBOARD_CONFIG.TEXT.DASHBOARD_SUBTITLE}
      </p>
    </div>
  );
};