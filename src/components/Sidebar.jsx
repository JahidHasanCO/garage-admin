import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useSidebar } from "../contexts/useSidebarContext";

const menuItems = [
    {
        text: "Dashboard",
        icon: (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
        ),
        path: "/dashboard",
    },
    {
        text: "Parts",
        icon: (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
        ),
        path: "/parts",
    },
];

export default function Sidebar() {
    const location = useLocation();
    const { collapsed, setCollapsed } = useSidebar();

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    return (
        <div className={`${collapsed ? 'w-16' : 'w-60'} bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col h-screen fixed left-0 top-0 z-40`}>
            {/* Header with logo and toggle */}
            <div className={`h-16 flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-4 border-b border-gray-200`}>
                {!collapsed && (
                    <div className="flex items-center">
                        <img
                            src="/images/logo.png"
                            alt="Logo"
                            className="h-8 w-auto"
                        />
                    </div>
                )}
                <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-lg text-primary hover:bg-gray-light focus:outline-none transition-colors"
                >
                    {collapsed ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 px-2 py-4 space-y-1">
                {menuItems.map((item) => {
                    const isSelected = location.pathname === item.path;
                    return (
                        <div key={item.text} className="relative group">
                            <Link
                                to={item.path}
                                className={`
                                    flex items-center px-3 py-2.5 rounded-lg transition-all duration-200
                                    ${collapsed ? 'justify-center' : 'justify-start'}
                                    ${isSelected 
                                        ? 'bg-primary text-white font-semibold' 
                                        : 'text-gray-700 hover:bg-gray-light hover:text-gray-900'
                                    }
                                `}
                            >
                                <div className={`flex-shrink-0 ${collapsed ? '' : 'mr-3'}`}>
                                    {item.icon}
                                </div>
                                {!collapsed && (
                                    <span className="text-sm font-medium">
                                        {item.text}
                                    </span>
                                )}
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