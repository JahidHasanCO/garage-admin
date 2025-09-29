import React from 'react';
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { DASHBOARD_CONFIG } from '../../config/dashboardConfig';

/**
 * QuickActionsPanel Component - Displays quick action buttons
 * @param {Object} props - Component props
 * @param {Function} props.onActionClick - Action click handler
 */
export const QuickActionsPanel = ({ onActionClick }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border-r-2 border-b-2 border-green-500">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        {DASHBOARD_CONFIG.TEXT.QUICK_ACTIONS_TITLE}
      </h2>
      <div className="space-y-4">
        {DASHBOARD_CONFIG.QUICK_ACTIONS.map((action, index) => (
          <button
            key={index}
            onClick={() => onActionClick(action.path)}
            className={`w-full text-left p-4 rounded-lg ${action.color} ${action.textColor} transition-colors`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{action.title}</span>
              <ArrowRightIcon className="w-4 h-4" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};