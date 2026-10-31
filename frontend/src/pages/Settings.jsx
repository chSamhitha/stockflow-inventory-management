
import { useEffect, useState } from "react";
import {
  Settings as SettingsIcon,
  Save,
  RefreshCw,
  Building2,
  Package
} from "lucide-react";

import api from "../services/api";

const Settings = () => {
  const [organizationName, setOrganizationName] = useState("");
  const [threshold, setThreshold] = useState("5");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Fetch organization settings
  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/organization/settings");

      const settings = response.data.settings;

      setOrganizationName(settings.organizationName);
      setThreshold(
        String(settings.defaultLowStockThreshold)
      );

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to fetch settings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Update organization settings
  const handleSave = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    const numericThreshold = Number(threshold);

    if (
      threshold.trim() === "" ||
      !Number.isInteger(numericThreshold) ||
      numericThreshold < 0
    ) {
      setError(
        "Please enter a valid non-negative integer."
      );
      return;
    }

    try {
      setSaving(true);

      const response = await api.put(
        "/organization/settings",
        {
          defaultLowStockThreshold: numericThreshold
        }
      );

      setThreshold(
        String(response.data.settings.defaultLowStockThreshold)
      );

      setMessage("Settings saved successfully.");

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to update settings."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-slate-500">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8">

      {/* Header */}

      <div>
        <div className="flex items-center gap-3">

          <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
            <SettingsIcon size={25} />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Settings
            </h1>

            <p className="text-slate-500 mt-1">
              Manage your organization preferences.
            </p>
          </div>

        </div>
      </div>

      {/* Organization Information */}

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">

        <div className="flex items-center gap-3 mb-5">

          <Building2 className="text-blue-600" size={22} />

          <h2 className="text-lg font-semibold">
            Organization Information
          </h2>

        </div>

        <label className="block text-sm font-medium text-slate-600 mb-2">
          Organization Name
        </label>

        <input
          type="text"
          value={organizationName}
          disabled
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-600"
        />

        <p className="text-xs text-slate-400 mt-2">
          Organization name is read-only in this MVP.
        </p>

      </div>

      {/* Inventory Settings */}

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">

        <div className="flex items-center gap-3 mb-5">

          <Package className="text-blue-600" size={22} />

          <div>
            <h2 className="text-lg font-semibold">
              Inventory Settings
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Configure your stock alert preferences.
            </p>
          </div>

        </div>

        <form onSubmit={handleSave} className="space-y-5">

          <div>
            <label className="block text-sm font-medium mb-2">
              Default Low Stock Threshold
            </label>

            <div className="max-w-sm">

              <input
                type="number"
                min="0"
                step="1"
                value={threshold}
                onChange={(e) => {
                  setThreshold(e.target.value);
                  setMessage("");
                  setError("");
                }}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              />

            </div>

            <p className="text-sm text-slate-500 mt-2">
              Products with quantity less than or equal to
              this threshold will be marked as low stock,
              unless they have a custom threshold.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg text-sm">
              {message}
            </div>
          )}

          <div className="flex flex-wrap gap-3 border-t pt-5">

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50"
            >
              <Save size={18} />

              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={() => {
                setMessage("");
                setError("");
                fetchSettings();
              }}
              disabled={saving}
              className="flex items-center gap-2 rounded-lg border border-slate-300 px-5 py-3 hover:bg-slate-50"
            >
              <RefreshCw size={17} />
              Reset
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default Settings;
