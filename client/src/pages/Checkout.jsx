import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useCart from "../context/useCart";
import { placeOrder, getErrorMessage } from "../services/api";
import { formatCurrency } from "../utils/format";
import Alert from "../components/Alert";

const fields = [
  { name: "fullName", label: "Full name" },
  { name: "phone", label: "Phone", type: "tel" },
  { name: "address", label: "Address" },
  { name: "city", label: "City" },
  { name: "postalCode", label: "Postal code" },
];

const inputClass =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200";

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "", phone: "", address: "", city: "", postalCode: "",
  });
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);

  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-slate-500">Your cart is empty.</p>
        <Link to="/" className="mt-3 inline-block text-indigo-600 hover:underline">
          Browse products
        </Link>
      </div>
    );
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (fields.some((f) => !form[f.name].trim())) {
      setError("Please fill in all shipping details.");
      return;
    }

    try {
      setPlacing(true);
      await placeOrder({
        items: items.map((i) => ({ product: i._id, quantity: i.quantity })),
        shippingAddress: form,
      });
      navigate("/orders", { state: { success: "Order placed successfully!" } });
      clearCart();
    } catch (err) {
      setError(getErrorMessage(err));
      setPlacing(false);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold">Checkout</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2"
        >
          <h2 className="font-semibold">Shipping details</h2>
          <Alert message={error} />

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {fields.map((f) => (
              <div key={f.name} className={f.name === "address" ? "sm:col-span-2" : ""}>
                <label htmlFor={f.name} className="mb-1 block text-sm font-medium">{f.label}</label>
                <input id={f.name} name={f.name} type={f.type || "text"} value={form[f.name]}
                  onChange={handleChange} className={inputClass} />
              </div>
            ))}
          </div>

          <p className="mt-5 rounded-md bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Payment method: <b>Cash on Delivery</b>
          </p>

          <button
            type="submit"
            disabled={placing}
            className="mt-5 rounded-md bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {placing ? "Placing order..." : "Place order"}
          </button>
        </form>

        <div className="h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">Your items</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {items.map((i) => (
              <li key={i._id} className="flex justify-between gap-3">
                <span>{i.name} × {i.quantity}</span>
                <span className="whitespace-nowrap">{formatCurrency(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-slate-200 pt-4 text-lg font-bold">
            <span>Total</span>
            <span>{formatCurrency(totalPrice)}</span>
          </div>
        </div>
      </div>
    </>
  );
}