
import { useEffect, useState } from "react";
import { X } from "lucide-react";

const initialForm = {
  name: "",
  sku: "",
  description: "",
  quantityOnHand: 0,
  costPrice: "",
  sellingPrice: "",
  lowStockThreshold: ""
};

const ProductForm = ({ product, onSubmit, onClose, loading }) => {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        sku: product.sku || "",
        description: product.description || "",
        quantityOnHand: product.quantityOnHand ?? 0,
        costPrice: product.costPrice ?? "",
        sellingPrice: product.sellingPrice ?? "",
        lowStockThreshold: product.lowStockThreshold ?? ""
      });
    } else {
      setForm(initialForm);
    }
    setError("");
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.sku.trim()) {
      setError("Product name and SKU are required.");
      return;
    }

    const payload = {
      ...form,
      name: form.name.trim(),
      sku: form.sku.trim().toUpperCase(),
      quantityOnHand: Number(form.quantityOnHand),
      costPrice: form.costPrice === "" ? null : Number(form.costPrice),
      sellingPrice: form.sellingPrice === "" ? null : Number(form.sellingPrice),
      lowStockThreshold:
        form.lowStockThreshold === ""
          ? null
          : Number(form.lowStockThreshold)
    };

    if (
      !Number.isInteger(payload.quantityOnHand) ||
      payload.quantityOnHand < 0
    ) {
      setError("Quantity must be a non-negative integer.");
      return;
    }

    for (const field of ["costPrice", "sellingPrice", "lowStockThreshold"]) {
      if (payload[field] !== null &&
          (!Number.isFinite(payload[field]) || payload[field] < 0)) {
        setError("Prices and threshold must be non-negative numbers.");
        return;
      }
    }

    if (
      payload.lowStockThreshold !== null &&
      !Number.isInteger(payload.lowStockThreshold)
    ) {
      setError("Low-stock threshold must be an integer.");
      return;
    }

    onSubmit(payload);
  };

  const inputClass =
    "w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl">

        <div className="flex items-center justify-between border-b p-5">
          <div>
            <h2 className="text-xl font-bold">
              {product ? "Edit Product" : "Add New Product"}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Enter your product information.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100"
            aria-label="Close form"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div>
              <label className="mb-2 block text-sm font-medium">
                Product Name *
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter product name"
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                SKU *
              </label>
              <input
                name="sku"
                value={form.sku}
                onChange={handleChange}
                placeholder="e.g. IPHONE17"
                required
                className={inputClass}
              />
            </div>

          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="2"
              className={inputClass}
              placeholder="Optional description"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div>
              <label className="mb-2 block text-sm font-medium">
                Quantity on Hand *
              </label>
              <input
                type="number"
                name="quantityOnHand"
                min="0"
                step="1"
                value={form.quantityOnHand}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Low Stock Threshold
              </label>
              <input
                type="number"
                name="lowStockThreshold"
                min="0"
                step="1"
                value={form.lowStockThreshold}
                onChange={handleChange}
                placeholder="Use organization default"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Cost Price (₹)
              </label>
              <input
                type="number"
                name="costPrice"
                min="0"
                step="0.01"
                value={form.costPrice}
                onChange={handleChange}
                placeholder="0.00"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Selling Price (₹)
              </label>
              <input
                type="number"
                name="sellingPrice"
                min="0"
                step="0.01"
                value={form.sellingPrice}
                onChange={handleChange}
                placeholder="0.00"
                className={inputClass}
              />
            </div>

          </div>

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 border-t pt-5">

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-5 py-2.5 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : product
                  ? "Update Product"
                  : "Create Product"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default ProductForm;
