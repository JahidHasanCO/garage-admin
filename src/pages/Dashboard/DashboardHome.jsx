import React from "react";
import { useNavigate } from "react-router-dom";
import { useDashboardStats } from "../../hooks/useDashboardStats";
import { DASHBOARD_CONFIG } from "../../config/dashboardConfig";
import { DashboardHeader } from "../../components/Dashboard/DashboardHeader";
import { StatsGrid } from "../../components/Dashboard/StatsGrid";
import { InsightsPanel } from "../../components/Dashboard/InsightsPanel";
import { QuickActionsPanel } from "../../components/Dashboard/QuickActionsPanel";

/**
 * DashboardHome - Main dashboard component following clean architecture principles
 * 
 * Responsibilities:
 * - Coordinate UI components
 * - Handle user interactions
 * - Manage navigation
 * 
 * Architecture:
 * - Uses custom hook for data management (useDashboardStats)
 * - Utilizes configuration-based approach (dashboardConfig)
 * - Separates UI concerns into dedicated components
 */
export default function DashboardHome() {
  const navigate = useNavigate();
  
  // Use custom hook for state management and API calls
  const { stats, insights, hasError, error } = useDashboardStats();

  /**
   * Handle navigation to specific pages
   * @param {string} path - Navigation path
   */
  const handleNavigation = (path) => {
    navigate(path);
  };

  /**
   * Render error state
   */
  if (hasError) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 max-w-md w-full">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Dashboard Header */}
      <DashboardHeader />

      {/* Statistics Grid */}
      <StatsGrid
        cards={DASHBOARD_CONFIG.STATS_CARDS}
        stats={stats}
        onCardClick={handleNavigation}
      />

      {/* Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Insights Panel */}
        <InsightsPanel
          insights={insights.data}
          loading={insights.loading}
        />

        {/* Quick Actions Panel */}
        <QuickActionsPanel onActionClick={handleNavigation} />
      </div>
    </div>
  );
}