import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useSidebar } from "../contexts/useSidebarContext";
import {
  HomeIcon,
  CubeIcon,
  FireIcon,
  Bars3Icon,
  ChevronLeftIcon,
} from "@heroicons/react/24/solid";

const menuItems = [
  {
    text: "Dashboard",
    icon: <HomeIcon className="w-6 h-6" />,
    path: "/dashboard",
  },
  {
    text: "Parts",
    icon: <CubeIcon className="w-6 h-6" />,
    path: "/parts",
  },
  {
    text: "Fuel Types",
    icon: <FireIcon className="w-6 h-6" />,
    path: "/fuel-types",
  },
];

export default function Sidebar() {
  const location = useLocation();
  const { collapsed, setCollapsed } = useSidebar();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      className={`${
        collapsed ? "w-16" : "w-60"
      } bg-white shadow-sm border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col h-screen fixed left-0 top-0 z-40`}
    >
      {/* Header with logo and toggle */}
      <div
        className={`h-16 flex items-center ${
          collapsed ? "justify-center" : "justify-between"
        } px-4 border-b border-gray-200`}
      >
        {!collapsed && (
          <div className="flex items-center">
            <img src="/images/logo.png" alt="Logo" className="h-8 w-auto" />
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg text-primary hover:bg-gray-100 focus:outline-none transition-colors"
        >
          {collapsed ? <Bars3Icon className="w-5 h-5" /> : <ChevronLeftIcon className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {menuItems.map((item) => {
          const isSelected = location.pathname === item.path || location.pathname.startsWith(item.path + "/");
          return (
            <div key={item.text} className="relative group">
              <Link
                to={item.path}
                className={`
                  flex items-center px-3 py-2.5 rounded-lg transition-all duration-200
                  ${collapsed ? "justify-center" : "justify-start"}
                  ${
                    isSelected
                      ? "bg-primary-400 text-white font-semibold"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }
                `}
              >
                <div className={`shrink-0 ${collapsed ? "" : "mr-3"}`}>
                  {item.icon}
                </div>
                {!collapsed && <span className="text-sm font-medium">{item.text}</span>}
              </Link>

              {/* Tooltip for collapsed state */}
              {collapsed && (
                <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50">
                  {item.text}
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
