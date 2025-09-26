import React, { createContext, useState } from "react";

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchHandlers, setSearchHandlers] = useState({});

  // Register a search handler for a specific page/component
  const registerSearchHandler = (key, handler) => {
    setSearchHandlers(prev => ({
      ...prev,
      [key]: handler
    }));
  };

  // Unregister a search handler
  const unregisterSearchHandler = (key) => {
    setSearchHandlers(prev => {
      const newHandlers = { ...prev };
      delete newHandlers[key];
      return newHandlers;
    });
  };

  // Handle search from the top bar
  const handleGlobalSearch = (query) => {
    setSearchQuery(query);
    
    // Call the current page's search handler if it exists
    const currentHandler = Object.values(searchHandlers)[0]; // Use the first registered handler
    if (currentHandler) {
      currentHandler(query);
    }
  };

  return (
    <SearchContext.Provider value={{
      searchQuery,
      setSearchQuery,
      handleGlobalSearch,
      registerSearchHandler,
      unregisterSearchHandler,
    }}>
      {children}
    </SearchContext.Provider>
  );
};

export { SearchContext };