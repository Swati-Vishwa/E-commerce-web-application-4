import { useState } from "react";
import { addProduct, updateProduct, getErrorMessage } from "../services/api";
import Alert from "./Alert";

const inputClass =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200";

export default function ProductForm({ product, onClose, onSaved }) {
  const isEdit = Boolean(product);
  const [form, setForm] = useState({
    name: product?.name ?? "",
    description: product?.description ?? "",
    price: product?.price ?? "",
    category: product?.category ?? "",
    image: product?.image ?? "",
    stock: product?.stock ?? "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.category.trim()) e.category = "Category is required";
    if (form.price === "" || Number(form.price) < 0) e.price = "Enter a valid price";
    if (form.stock === "" || !Number.isInteger(Number(form.stock)) || Number(form.stock) < 0)
      e.stock = "Enter a whole number (0 or more)";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setServerError("");
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      category: form.category.trim(),
      image: form.image.trim(),
      stock: Number(form.stock),
    };

    try {
      setSaving(true);
      if (isEdit) await updateProduct(product._id, payload);
      else await addProduct(payload);
      onSaved(isEdit ? "Product updated." : "Product added.");
    } catch (err) {
      setServerError(getErrorMessage(err));
      setSaving(false);
    }
  };

  const field = (name, label, props = {}) => (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm font-medium">{label}</label>
      <input id={name} name={name} value={form[name]} onChange={handleChange}
        className={inputClass} {...props} />
      {errors[name] && <p className="mt-1 text-xs text-red-600">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 px-4 py-10">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-bold">{isEdit ? "Edit Product" : "Add Product"}</h2>
        <Alert message={serverError} />

        <form onSubmit={handleSubmit} noValidate className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">{field("name", "Name")}</div>
          {field("price", "Price", { type: "number", step: "0.01", min: "0" })}
          {field("stock", "Stock", { type: "number", step: "1", min: "0" })}
          <div className="sm:col-span-2">{field("category", "Category", { placeholder: "e.g. Footwear" })}</div>
          <div className="sm:col-span-2">
            {field("image", "Image URL (optional)", { placeholder: "https://..." })}
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="description" className="mb-1 block text-sm font-medium">
              Description (optional)
            </label>
            <textarea id="description" name="description" rows="3" value={form.description}
              onChange={handleChange} className={inputClass} />
          </div>

          <div className="mt-2 flex justify-end gap-3 sm:col-span-2">
            <button type="button" onClick={onClose}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="rounded-md bg-savory-sage px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60">
              {saving ? "Saving..." : isEdit ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}