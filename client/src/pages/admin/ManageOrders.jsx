import { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus, getErrorMessage } from "../../services/api";
import { ORDER_STATUSES } from "../../utils/constants";
import { formatCurrency, formatDate } from "../../utils/format";
import Alert from "../../components/Alert";

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      try {
        const { data } = await getAllOrders();
        if (!ignore) {
          setOrders(data?.data ?? []);
          setError("");
        }
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
  }, [refresh]);

  const handleStatus = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      setSuccess("Order status updated.");
      setRefresh((r) => r + 1);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Manage Orders</h1>
      <p className="text-sm text-slate-500">{orders.length} orders</p>

      <Alert type="success" message={success} onClose={() => setSuccess("")} />
      <Alert message={error} />

      {loading ? (
        <p className="mt-10 text-center text-slate-500">Loading...</p>
      ) : orders.length === 0 && !error ? (
        <p className="mt-10 text-center text-slate-500">No orders yet.</p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-honey-oatmilk text-slate-600">
              <tr>
                <th className="px-4 py-3 font-semibold">Order</th>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Items</th>
                <th className="px-4 py-3 font-semibold">Ship to</th>
                <th className="px-4 py-3 font-semibold">Total</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="border-t border-slate-100 align-top hover:bg-slate-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <p className="font-medium">#{o._id.slice(-6).toUpperCase()}</p>
                    <p className="text-xs text-slate-500">{formatDate(o.createdAt)}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p>{o.user?.name ?? "Deleted user"}</p>
                    <p className="text-xs text-slate-500">{o.user?.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <ul>
                      {o.items.map((i) => (
                        <li key={i.product}>{i.name} × {i.quantity}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {o.shippingAddress.fullName}, {o.shippingAddress.address},{" "}
                    {o.shippingAddress.city} {o.shippingAddress.postalCode}
                    <br />
                    {o.shippingAddress.phone}
                  </td>
                  <td className="px-4 py-3 font-medium whitespace-nowrap">{formatCurrency(o.total)}</td>
                  <td className="px-4 py-3">
                    <select
                      value={o.status}
                      onChange={(e) => handleStatus(o._id, e.target.value)}
                      className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm"
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}