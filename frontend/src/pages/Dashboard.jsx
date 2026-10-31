import { useEffect, useState } from "react";
import {
  Package,
  Boxes,
  AlertTriangle,
  RefreshCw
} from "lucide-react";

import api from "../services/api";

const Dashboard = () => {

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/dashboard/overview"
      );

      setDashboard(response.data.dashboard);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to fetch dashboard data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="text-slate-500">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        {error}

        <button
          onClick={fetchDashboard}
          className="ml-3 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  const cards = [
    {
      title: "Total Products",
      value: dashboard.totalProducts,
      icon: Package,
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "Total Stock",
      value: dashboard.totalQuantity,
      icon: Boxes,
      color: "bg-green-100 text-green-600"
    },
    {
      title: "Low Stock Items",
      value: dashboard.lowStockCount,
      icon: AlertTriangle,
      color: "bg-orange-100 text-orange-600"
    }
  ];

  return (
    <div className="space-y-8">

      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Dashboard
          </h1>

          <p className="text-slate-500 mt-2">
            Here's an overview of your inventory.
          </p>
        </div>

        <button
          onClick={fetchDashboard}
          className="flex items-center gap-2 border border-slate-300 rounded-lg px-4 py-2 hover:bg-white"
        >
          <RefreshCw size={16} />
          Refresh
        </button>

      </div>

      {/* Summary Cards */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
            >

              <div className="flex justify-between items-center">

                <div>
                  <p className="text-slate-500 text-sm">
                    {card.title}
                  </p>

                  <h2 className="text-3xl font-bold mt-3">
                    {card.value}
                  </h2>
                </div>

                <div className={`p-4 rounded-xl ${card.color}`}>
                  <Icon size={25} />
                </div>

              </div>

            </div>
          );
        })}

      </div>

      {/* Low Stock Table */}

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm">

        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold">
            Low Stock Items
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Products that need restocking.
          </p>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead className="bg-slate-50 text-slate-500 text-sm">
              <tr>
                <th className="p-4">Product Name</th>
                <th className="p-4">SKU</th>
                <th className="p-4">Quantity</th>
                <th className="p-4">Threshold</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>

            <tbody>

              {dashboard.lowStockProducts.length > 0 ? (
                dashboard.lowStockProducts.map((product) => (
                  <tr
                    key={product._id}
                    className="border-t border-slate-100"
                  >

                    <td className="p-4 font-medium">
                      {product.name}
                    </td>

                    <td className="p-4 text-slate-500">
                      {product.sku}
                    </td>

                    <td className="p-4 font-semibold">
                      {product.quantityOnHand}
                    </td>

                    <td className="p-4">
                      {product.lowStockThreshold}
                    </td>

                    <td className="p-4">
                      <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold">
                        Low Stock
                      </span>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="p-8 text-center text-slate-500"
                  >
                    No low-stock products found.
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;