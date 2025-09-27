import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./contexts/AuthContext";
import { SidebarProvider } from "./contexts/SidebarContext";
import { SearchProvider } from "./contexts/SearchContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SidebarProvider>
          <SearchProvider>
            <AppRoutes />
          </SearchProvider>
        </SidebarProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}


export default App;

