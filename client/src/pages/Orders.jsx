import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getMyOrders, getErrorMessage } from "../services/api";
import { formatCurrency, formatDate } from "../utils/format";
import StatusBadge from "../components/StatusBadge";
import Alert from "../components/Alert";

export default function Orders() {
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(location.state?.success || "");

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      try {
        const { data } = await getMyOrders();
        if (!ignore) setOrders(data.data);
      } catch (err) {
        if (!ignore) setError(getErrorMessage(err));
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    load();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <>
      <h1 className="text-2xl font-bold">My Orders</h1>
      <Alert type="success" message={success} onClose={() => setSuccess("")} />
      <Alert message={error} />

      {loading ? (
        <p className="mt-10 text-center text-slate-500">Loading...</p>
      ) : orders.length === 0 && !error ? (
        <div className="py-16 text-center">
          <p className="text-slate-500">You haven't placed any orders yet.</p>
          <Link to="/" className="mt-3 inline-block text-indigo-600 hover:underline">
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((o) => (
            <div key={o._id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm text-slate-500">
                    Order #{o._id.slice(-6).toUpperCase()} · {formatDate(o.createdAt)}
                  </p>
                </div>
                <StatusBadge status={o.status} />
              </div>

              <ul className="mt-3 divide-y divide-slate-100 text-sm">
                {o.items.map((i) => (
                  <li key={i.product} className="flex justify-between py-2">
                    <span>{i.name} × {i.quantity}</span>
                    <span>{formatCurrency(i.price * i.quantity)}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex flex-wrap items-end justify-between gap-2 border-t border-slate-200 pt-3">
                <p className="text-sm text-slate-500">
                  Ship to: {o.shippingAddress.fullName}, {o.shippingAddress.address},{" "}
                  {o.shippingAddress.city} {o.shippingAddress.postalCode}
                </p>
                <p className="text-lg font-bold">{formatCurrency(o.total)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}