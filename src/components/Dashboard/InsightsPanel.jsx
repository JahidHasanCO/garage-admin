import React from 'react';
import { ChartBarIcon, FireIcon } from "@heroicons/react/24/solid";
import { DASHBOARD_CONFIG } from '../../config/dashboardConfig';

/**
 * ServicePricingCard Component - Displays service pricing insights
 * @param {Object} props - Component props
 * @param {Object} props.pricing - Service pricing data
 */
const ServicePricingCard = ({ pricing }) => (
  <div className={`${DASHBOARD_CONFIG.STYLES.GRADIENT_COLORS.PRICING} rounded-lg p-4`}>
    <h3 className="text-lg font-semibold text-blue-900 mb-3">Service Pricing Overview</h3>
    <div className="grid grid-cols-3 gap-4">
      <div className="text-center">
        <p className="text-2xl font-bold text-blue-600">
          ${pricing.averagePrice?.toFixed(0)}
        </p>
        <p className="text-sm text-blue-700">Average Price</p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-green-600">
          ${pricing.minPrice}
        </p>
        <p className="text-sm text-green-700">Min Price</p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-red-600">
          ${pricing.maxPrice}
        </p>
        <p className="text-sm text-red-700">Max Price</p>
      </div>
    </div>
  </div>
);

/**
 * TopManufacturersCard Component - Displays top manufacturers
 * @param {Object} props - Component props
 * @param {Array} props.manufacturers - Top manufacturers data
 */
const TopManufacturersCard = ({ manufacturers }) => (
  <div className={`${DASHBOARD_CONFIG.STYLES.GRADIENT_COLORS.MANUFACTURERS} rounded-lg p-4`}>
    <h3 className="text-lg font-semibold text-green-900 mb-3">Top Manufacturers by Vehicles</h3>
    <div className="space-y-2">
      {manufacturers.map((manufacturer, index) => (
        <div key={manufacturer._id} className="flex items-center justify-between bg-white rounded-lg p-3">
          <div className="flex items-center space-x-3">
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              #{index + 1}
            </span>
            <span className="font-medium text-gray-900">{manufacturer.manufacturer}</span>
          </div>
          <span className="text-green-600 font-semibold">{manufacturer.count} vehicles</span>
        </div>
      ))}
    </div>
  </div>
);

/**
 * VehiclesByFuelTypeCard Component - Displays vehicles by fuel type
 * @param {Object} props - Component props
 * @param {Array} props.fuelTypes - Vehicles by fuel type data
 */
const VehiclesByFuelTypeCard = ({ fuelTypes }) => (
  <div className={`${DASHBOARD_CONFIG.STYLES.GRADIENT_COLORS.FUEL_TYPES} rounded-lg p-4`}>
    <h3 className="text-lg font-semibold text-orange-900 mb-3">Vehicles by Fuel Type</h3>
    <div className="space-y-2">
      {fuelTypes.map((fuelType) => (
        <div key={fuelType._id} className="flex items-center justify-between bg-white rounded-lg p-3">
          <div className="flex items-center space-x-3">
            <FireIcon className="w-5 h-5 text-orange-500" />
            <span className="font-medium text-gray-900">{fuelType.fuelType}</span>
          </div>
          <span className="text-orange-600 font-semibold">{fuelType.count} vehicles</span>
        </div>
      ))}
    </div>
  </div>
);

/**
 * LoadingInsights Component - Displays loading state for insights
 */
const LoadingInsights = () => (
  <div className="bg-gray-50 rounded-lg p-8 text-center">
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
      <div className="h-4 bg-gray-300 rounded w-2/3 mx-auto"></div>
    </div>
  </div>
);

/**
 * EmptyInsights Component - Displays empty state for insights
 */
const EmptyInsights = () => (
  <div className="bg-gray-50 rounded-lg p-8 text-center">
    <div className="flex flex-col items-center space-y-4">
      <ChartBarIcon className="w-16 h-16 text-gray-300" />
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {DASHBOARD_CONFIG.TEXT.NO_INSIGHTS_TITLE}
        </h3>
        <p className="text-gray-500">
          {DASHBOARD_CONFIG.TEXT.NO_INSIGHTS_SUBTITLE}
        </p>
      </div>
    </div>
  </div>
);

/**
 * InsightsPanel Component - Main insights panel container
 * @param {Object} props - Component props
 * @param {Object} props.insights - Insights data
 * @param {boolean} props.loading - Loading state
 */
export const InsightsPanel = ({ insights, loading }) => {
  const renderInsightsContent = () => {
    if (loading) {
      return <LoadingInsights />;
    }

    if (!insights) {
      return <EmptyInsights />;
    }

    return (
      <div className="space-y-6">
        {/* Service Pricing Info */}
        {insights.servicesPricing && (
          <ServicePricingCard pricing={insights.servicesPricing} />
        )}

        {/* Top Manufacturers */}
        {insights.topManufacturers?.length > 0 && (
          <TopManufacturersCard manufacturers={insights.topManufacturers} />
        )}

        {/* Vehicles by Fuel Type */}
        {insights.vehiclesByFuelType?.length > 0 && (
          <VehiclesByFuelTypeCard fuelTypes={insights.vehiclesByFuelType} />
        )}
      </div>
    );
  };

  return (
    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border-r-2 border-b-2 border-blue-500">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {DASHBOARD_CONFIG.TEXT.INSIGHTS_TITLE}
        </h2>
        <ChartBarIcon className="w-6 h-6 text-blue-500" />
      </div>
      {renderInsightsContent()}
    </div>
  );
};