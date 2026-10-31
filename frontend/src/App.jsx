import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Settings from "./pages/Settings";

function App() {

  return (
    <AuthProvider>

      <BrowserRouter>

        <Routes>

          {/* Public Routes */}

          <Route path="/login" element={<Login />} />

          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}

          <Route element={<ProtectedRoute />}>

            <Route element={<DashboardLayout />}>

              <Route
                path="/dashboard"
                element={<Dashboard />}
              />

              <Route
                path="/products"
                element={<Products />}
              />

              <Route
                path="/settings"
                element={<Settings />}
              />

            </Route>

          </Route>

          {/* Default Route */}

          <Route
            path="/"
            element={<Navigate to="/dashboard" replace />}
          />

          <Route
            path="*"
            element={<Navigate to="/dashboard" replace />}
          />

        </Routes>

      </BrowserRouter>

    </AuthProvider>
  );
}

export default App;