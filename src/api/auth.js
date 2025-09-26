import axios from "axios";
import { API_URL } from "../constants/api.js";



// Login function
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/admin/login`, { email, password });
    return response.data; // { user: {}, token: "" }
  } catch (error) {
    // Throw a formatted error message
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Login failed");
    }
    throw new Error(error.message || "Login failed");
  }
};

// Optional: logout (mainly for client-side cleanup)
export const logout = () => {
  localStorage.removeItem("token");
};
