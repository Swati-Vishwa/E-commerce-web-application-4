import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProduct, getErrorMessage } from "../services/api";
import useCart from "../context/useCart";
import { formatCurrency } from "../utils/format";
import ProductImage from "../components/ProductImage";
import Alert from "../components/Alert";

export default function ProductDetails() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      try {
        const { data } = await getProduct(id);
        if (!ignore) setProduct(data.data);
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
  }, [id]);

  if (loading) return <p className="text-center text-slate-500">Loading...</p>;

  if (error)
    return (
      <div className="mx-auto max-w-2xl">
        <Alert message={error} />
        <Link to="/" className="mt-4 inline-block text-indigo-600 hover:underline">
          ← Back to products
        </Link>
      </div>
    );

  const outOfStock = product.stock === 0;

  const handleAdd = () => {
    addItem(product, quantity);
    setAdded(true);
  };

  return (
    <div>
      <Link to="/" className="text-sm text-indigo-600 hover:underline">← Back to products</Link>

      <div className="mt-4 grid gap-8 md:grid-cols-2">
        <ProductImage
          src={product.image}
          alt={product.name}
          className="h-80 w-full rounded-xl md:h-96"
        />

        <div>
          <p className="text-xs tracking-wide text-slate-500 uppercase">{product.category}</p>
          <h1 className="mt-1 text-3xl font-bold">{product.name}</h1>
          <p className="mt-3 text-2xl font-bold text-savory-sage">{formatCurrency(product.price)}</p>
          <p className={`mt-1 text-sm ${outOfStock ? "text-red-600" : "text-green-600"}`}>
            {outOfStock ? "Out of stock" : `${product.stock} in stock`}
          </p>
          <p className="mt-4 text-slate-600">{product.description || "No description available."}</p>

          {!outOfStock && (
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, Math.min(Number(e.target.value) || 1, product.stock)))
                }
                className="w-20 rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
              <button
                onClick={handleAdd}
                className="rounded-md bg-savory-sage px-5 py-2 text-sm font-medium text-white hover:bg-savory-sage/90"
              >
                Add to cart
              </button>
              {added && (
                <Link to="/cart" className="text-sm text-green-700 hover:underline">
                  ✓ Added. View cart →
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}