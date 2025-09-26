import { createContext, useContext } from "react";

// only export the context
export const AuthContext = createContext(null);

// helper hook
export const useAuth = () => useContext(AuthContext);
