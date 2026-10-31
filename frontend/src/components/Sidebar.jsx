import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Settings,
  LogOut,
  Boxes
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const Sidebar = () => {

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard
    },
    {
      name: "Products",
      path: "/products",
      icon: Package
    },
    {
      name: "Settings",
      path: "/settings",
      icon: Settings
    }
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-64 min-h-screen bg-slate-950 text-white flex flex-col">

      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Boxes size={28} className="text-blue-400" />

          <h1 className="text-2xl font-bold">
            StockFlow
          </h1>
        </div>
      </div>

      <div className="p-5">
        <p className="text-xs uppercase text-slate-500 mb-4">
          Workspace
        </p>

        <p className="font-semibold truncate">
          {user?.organizationName || "My Organization"}
        </p>
      </div>

      <nav className="flex-1 px-3 space-y-2">

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <Icon size={20} />
              {item.name}
            </NavLink>
          );
        })}

      </nav>

      <div className="p-4 border-t border-slate-800">

        <div className="mb-4">
          <p className="text-sm font-medium truncate">
            {user?.email}
          </p>

          <p className="text-xs text-slate-500">
            Organization Owner
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-slate-400 hover:text-red-400 w-full p-2"
        >
          <LogOut size={18} />
          Logout
        </button>

      </div>

    </aside>
  );
};

export default Sidebar;