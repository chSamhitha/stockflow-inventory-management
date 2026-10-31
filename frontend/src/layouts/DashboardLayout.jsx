import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const DashboardLayout = () => {

  return (
    <div className="flex min-h-screen bg-slate-50">

      <Sidebar />

      <main className="flex-1 min-w-0 p-8">

        <Outlet />

      </main>

    </div>
  );
};

export default DashboardLayout;