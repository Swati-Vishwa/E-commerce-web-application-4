import { useEffect, useState } from "react";
import { getProducts, deleteProduct, getErrorMessage } from "../../services/api";
import { formatCurrency } from "../../utils/format";
import ProductForm from "../../components/ProductForm";
import ProductImage from "../../components/ProductImage";
import ConfirmModal from "../../components/ConfirmModal";
import Alert from "../../components/Alert";

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formState, setFormState] = useState(null); // null = closed
  const [toDelete, setToDelete] = useState(null);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      try {
        const { data } = await getProducts();
        if (!ignore) {
          setProducts(data.data);
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

  const handleSaved = (message) => {
    setFormState(null);
    setSuccess(message);
    setRefresh((r) => r + 1);
  };

  const confirmDelete = async () => {
    try {
      await deleteProduct(toDelete._id);
      setSuccess(`${toDelete.name} was deleted.`);
      setRefresh((r) => r + 1);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setToDelete(null);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Manage Products</h1>
          <p className="text-sm text-slate-500">{products.length} products</p>
        </div>
        <button
          onClick={() => setFormState({ product: null })}
          className="rounded-md bg-black/80 px-4 py-2 text-sm font-medium text-white hover:bg-black/70"
        >
          + Add Product
        </button>
      </div>

      <Alert type="success" message={success} onClose={() => setSuccess("")} />
      <Alert message={error} />

      {loading ? (
        <p className="mt-10 text-center text-slate-500">Loading...</p>
      ) : products.length === 0 && !error ? (
        <p className="mt-10 text-center text-slate-500">No products yet. Add your first one!</p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-honey-oatmilk text-slate-600">
              <tr>
                <th className="px-4 py-3 font-semibold">Product</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold">Stock</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <ProductImage src={p.image} alt={p.name} className="h-10 w-10 rounded" />
                      <span className="font-medium">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{p.category}</td>
                  <td className="px-4 py-3">{formatCurrency(p.price)}</td>
                  <td className={`px-4 py-3 ${p.stock === 0 ? "font-medium text-red-600" : ""}`}>
                    {p.stock}
                  </td>
                  <td className="space-x-3 px-4 py-3 text-right whitespace-nowrap">
                    <button onClick={() => setFormState({ product: p })}
                      className="text-amber-600 hover:underline">
                      Edit
                    </button>
                    <button onClick={() => setToDelete(p)} className="text-red-600 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {formState && (
        <ProductForm
          key={formState.product?._id ?? "new"}
          product={formState.product}
          onClose={() => setFormState(null)}
          onSaved={handleSaved}
        />
      )}

      <ConfirmModal
        open={Boolean(toDelete)}
        title="Delete product?"
        message={toDelete ? `This will permanently remove ${toDelete.name}.` : ""}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
} 