import React, { useCallback, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useSidebar } from "../contexts/useSidebarContext";
import { useSearch } from "../contexts/useSearchContext";
import { useAuth } from "../contexts/useAuthContext";
import { ChevronDownIcon, UserIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

export default function DashboardLayout() {
  const { collapsed } = useSidebar();
  const { searchQuery, handleGlobalSearch } = useSearch();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const currentWidth = collapsed ? 64 : 240;

  const handleSearchChange = useCallback((e) => {
    handleGlobalSearch(e.target.value);
  }, [handleGlobalSearch]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div 
        className="flex-1 bg-background min-h-screen transition-all duration-300 ease-in-out"
        style={{ marginLeft: `${currentWidth}px` }}
      >
        {/* Top AppBar */}
        <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6">
          {/* Search bar */}
          <div className="flex items-center bg-gray-50 px-4 py-2 rounded-lg max-w-md w-full">
            <svg className="w-5 h-5 text-gray-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
            <input
              type="text"
              placeholder="Search…"
              value={searchQuery}
              onChange={handleSearchChange}
              className="bg-transparent flex-1 focus:outline-none text-gray-900 placeholder-gray-500"
            />
          </div>

          {/* User Avatar Dropdown */}
          <div className="relative">
            <button 
              onClick={toggleDropdown}
              className="flex items-center space-x-2 focus:outline-none hover:bg-gray-100 rounded-lg p-2 transition-colors"
            >
              <img 
                src="/images/avatar.jpg"
                alt="Admin User" 
                className="w-8 h-8 rounded-full"
                onError={(e) => {
                  e.target.src = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clip-rule="evenodd" /></svg>')}`
                }}
              />
              <ChevronDownIcon className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <>
                {/* Backdrop */}
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setDropdownOpen(false)}
                ></div>
                
                {/* Dropdown Content */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                  <div className="py-1">
                    {/* Profile Section */}
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">Admin User</p>
                      <p className="text-sm text-gray-500">admin@garage.com</p>
                    </div>
                    
                    {/* Menu Items */}
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        // Add profile navigation if needed
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <UserIcon className="w-4 h-4 mr-3" />
                      Profile
                    </button>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors"
                    >
                      <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Route Content */}
        <main className="flex-1 w-full min-h-[calc(100vh-4rem)] overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}