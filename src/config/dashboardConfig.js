import { 
  CubeIcon, 
  TruckIcon, 
  BuildingStorefrontIcon, 
  WrenchScrewdriverIcon,
  RectangleStackIcon,
  BuildingOffice2Icon,
  FireIcon
} from "@heroicons/react/24/solid";

/**
 * Dashboard configuration and constants
 */
export const DASHBOARD_CONFIG = {
  // Statistics card configurations
  STATS_CARDS: [
    {
      key: 'parts',
      title: "Total Parts",
      icon: CubeIcon,
      iconColor: "text-blue-500",
      valueColor: "text-blue-600",
      iconBgColor: "bg-blue-50",
      borderColor: "border-blue-500",
      path: "/parts"
    },
    {
      key: 'vehicles',
      title: "Vehicles",
      icon: TruckIcon,
      iconColor: "text-green-500",
      valueColor: "text-green-600",
      iconBgColor: "bg-green-50",
      borderColor: "border-green-500",
      path: "/vehicles"
    },
    {
      key: 'garages',
      title: "Garages",
      icon: BuildingStorefrontIcon,
      iconColor: "text-purple-500",
      valueColor: "text-purple-600",
      iconBgColor: "bg-purple-50",
      borderColor: "border-purple-500",
      path: "/garages"
    },
    {
      key: 'services',
      title: "Services",
      icon: WrenchScrewdriverIcon,
      iconColor: "text-orange-500",
      valueColor: "text-orange-600",
      iconBgColor: "bg-orange-50",
      borderColor: "border-orange-500",
      path: "/services"
    },
    {
      key: 'servicePackages',
      title: "Service Packages",
      icon: RectangleStackIcon,
      iconColor: "text-indigo-500",
      valueColor: "text-indigo-600",
      iconBgColor: "bg-indigo-50",
      borderColor: "border-indigo-500",
      path: "/service-packages"
    },
    {
      key: 'manufacturers',
      title: "Manufacturers",
      icon: BuildingOffice2Icon,
      iconColor: "text-teal-500",
      valueColor: "text-teal-600",
      iconBgColor: "bg-teal-50",
      borderColor: "border-teal-500",
      path: "/manufacturers"
    },
    {
      key: 'fuelTypes',
      title: "Fuel Types",
      icon: FireIcon,
      iconColor: "text-red-500",
      valueColor: "text-red-600",
      iconBgColor: "bg-red-50",
      borderColor: "border-red-500",
      path: "/fuel-types"
    }
  ],

  // Quick actions configuration
  QUICK_ACTIONS: [
    { 
      title: "Add New Part", 
      path: "/parts/add", 
      color: "bg-blue-50 hover:bg-blue-100", 
      textColor: "text-blue-700" 
    },
    { 
      title: "Add Vehicle", 
      path: "/vehicles/add", 
      color: "bg-green-50 hover:bg-green-100", 
      textColor: "text-green-700" 
    },
    { 
      title: "Create Service", 
      path: "/services/add", 
      color: "bg-orange-50 hover:bg-orange-100", 
      textColor: "text-orange-700" 
    },
    { 
      title: "New Service Package", 
      path: "/service-packages/add", 
      color: "bg-purple-50 hover:bg-purple-100", 
      textColor: "text-purple-700" 
    }
  ],

  // UI text constants
  TEXT: {
    DASHBOARD_TITLE: "Dashboard",
    DASHBOARD_SUBTITLE: "Welcome back! Here's an overview of your garage management system.",
    INSIGHTS_TITLE: "System Insights",
    QUICK_ACTIONS_TITLE: "Quick Actions",
    VIEW_ALL_TEXT: "View all",
    NO_INSIGHTS_TITLE: "No Insights Available",
    NO_INSIGHTS_SUBTITLE: "Add more data to see detailed insights and analytics."
  },

  // Styling constants
  STYLES: {
    GRADIENT_COLORS: {
      PRICING: "bg-blue-50",
      MANUFACTURERS: "bg-green-50", 
      FUEL_TYPES: "bg-orange-50"
    },
    ANIMATIONS: {
      HOVER_SCALE: "hover:scale-105",
      TRANSITION_ALL: "transition-all duration-300",
      SLIDE_ARROW: "group-hover:translate-x-1 transition-transform"
    }
  }
};