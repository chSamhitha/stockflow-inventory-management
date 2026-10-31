
import { useCallback, useEffect, useState } from "react";

import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Package,
  RefreshCw
} from "lucide-react";

import api from "../services/api";
import ProductForm from "../components/ProductForm";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [defaultThreshold, setDefaultThreshold] = useState(5);

  // Fetch products
  const fetchProducts = useCallback(async (searchValue = "") => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/products", {
        params: searchValue.trim()
          ? { search: searchValue.trim() }
          : {}
      });

      setProducts(response.data.products || []);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to fetch products."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch organization default threshold
  const fetchSettings = async () => {
    try {
      const response = await api.get("/dashboard/overview");

      setDefaultThreshold(
        response.data.dashboard.defaultLowStockThreshold ?? 5
      );
    } catch (err) {
      console.error("Unable to fetch inventory settings", err);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Debounced product search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search, fetchProducts]);

  // Open add form
  const handleAdd = () => {
    setSelectedProduct(null);
    setShowForm(true);
    setMessage("");
  };

  // Open edit form
  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowForm(true);
    setMessage("");
  };

  // Create or update product
  const handleSave = async (payload) => {
    try {
      setSaving(true);
      setError("");
      setMessage("");

      if (selectedProduct) {
        await api.put(
          `/products/${selectedProduct._id}`,
          payload
        );

        setMessage("Product updated successfully.");
      } else {
        await api.post("/products", payload);

        setMessage("Product created successfully.");
      }

      setShowForm(false);
      setSelectedProduct(null);

      await fetchProducts(search);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to save product."
      );
    } finally {
      setSaving(false);
    }
  };

  // Delete product
  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${product.name}?`
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      await api.delete(`/products/${product._id}`);

      setMessage("Product deleted successfully.");

      await fetchProducts(search);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to delete product."
      );
    }
  };

  const getStockStatus = (product) => {
    const threshold =
      product.lowStockThreshold ?? defaultThreshold;

    return product.quantityOnHand <= threshold
      ? "Low Stock"
      : "In Stock";
  };

  const formatPrice = (price) => {
    if (price === null || price === undefined) {
      return "—";
    }

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2
    }).format(price);
  };

  return (
    <div className="space-y-6">

      {/* Page Header */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Products
          </h1>

          <p className="text-slate-500 mt-2">
            Manage and monitor your inventory.
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-5 py-3 font-semibold"
        >
          <Plus size={20} />
          Add Product
        </button>

      </div>

      {/* Feedback Messages */}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex justify-between">
          <span>{error}</span>

          <button
            onClick={() => setError("")}
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg">
          {message}
        </div>
      )}

      {/* Search and Count */}

      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">

        <div className="flex flex-col sm:flex-row justify-between gap-4">

          <div className="relative w-full sm:max-w-md">

            <Search
              size={19}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by product name or SKU..."
              className="w-full border border-slate-300 rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
            />

          </div>

          <button
            onClick={() => fetchProducts(search)}
            className="flex items-center justify-center gap-2 border border-slate-300 rounded-lg px-4 py-3 hover:bg-slate-50"
          >
            <RefreshCw size={17} />
            Refresh
          </button>

        </div>

        <p className="text-sm text-slate-500 mt-4">
          {products.length} product(s) found
        </p>

      </div>

      {/* Products Table */}

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead className="bg-slate-50 text-slate-500 text-sm">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">SKU</th>
                <th className="p-4">Quantity</th>
                <th className="p-4">Cost Price</th>
                <th className="p-4">Selling Price</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>

              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="p-10 text-center text-slate-500"
                  >
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-12 text-center">

                    <Package
                      size={42}
                      className="mx-auto text-slate-300 mb-3"
                    />

                    <h3 className="font-semibold text-slate-700">
                      No products found
                    </h3>

                    <p className="text-sm text-slate-500 mt-1">
                      Add a new product or change your search.
                    </p>

                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const status = getStockStatus(product);

                  return (
                    <tr
                      key={product._id}
                      className="border-t border-slate-100 hover:bg-slate-50"
                    >

                      <td className="p-4">
                        <div className="font-semibold text-slate-800">
                          {product.name}
                        </div>

                        <div className="text-xs text-slate-400 mt-1">
                          {product.description || "No description"}
                        </div>
                      </td>

                      <td className="p-4 text-slate-600">
                        {product.sku}
                      </td>

                      <td className="p-4 font-semibold">
                        {product.quantityOnHand}
                      </td>

                      <td className="p-4 text-slate-600">
                        {formatPrice(product.costPrice)}
                      </td>

                      <td className="p-4 text-slate-600">
                        {formatPrice(product.sellingPrice)}
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            status === "Low Stock"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {status}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex justify-center gap-2">

                          <button
                            onClick={() => handleEdit(product)}
                            title="Edit product"
                            className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                          >
                            <Pencil size={18} />
                          </button>

                          <button
                            onClick={() => handleDelete(product)}
                            title="Delete product"
                            className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={18} />
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })
              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* Add / Edit Modal */}

      {showForm && (
        <ProductForm
          product={selectedProduct}
          onSubmit={handleSave}
          onClose={() => {
            if (!saving) {
              setShowForm(false);
              setSelectedProduct(null);
            }
          }}
          loading={saving}
        />
      )}

    </div>
  );
};

export default Products;
