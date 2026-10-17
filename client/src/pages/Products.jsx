import { useEffect, useState } from "react";
import { getProducts, getCategories, getErrorMessage } from "../services/api";
import ProductCard from "../components/ProductCard";
import Alert from "../components/Alert";

const inputClass =
  "rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState(""); 
  const [search, setSearch] = useState(""); 
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load the category list once
  useEffect(() => {
    let ignore = false;
    getCategories()
      .then(({ data }) => {
        if (!ignore) setCategories(data.data);
      })
      .catch(() => { });
    return () => {
      ignore = true;
    };
  }, []);

  // Load products whenever the filters change
  useEffect(() => {
    let ignore = false;

    const load = async () => {
      try {
        const { data } = await getProducts({ search, category });
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
  }, [search, category]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(query.trim());
  };

  const clearFilters = () => {
    setQuery("");
    setSearch("");
    setCategory("");
  };

  return (
    <>
      <h1 className="text-2xl font-bold">Products</h1>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <form onSubmit={handleSearch} className="flex flex-1 gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className={`${inputClass} min-w-0 flex-1`}
          />
          <button
            type="submit"
            className="rounded-md bg-blush-beet px-4 py-2 text-sm font-medium text-white hover:bg-blush-beet/90"
          >
            Search
          </button>
        </form>

        <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {(search || category) && (
          <button
            onClick={clearFilters}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm hover:bg-slate-100"
          >
            Clear
          </button>
        )}
      </div>

      <Alert message={error} />

      {loading ? (
        <p className="mt-10 text-center text-slate-500">Loading products...</p>
      ) : products.length === 0 && !error ? (
        <p className="mt-10 text-center text-slate-500">No products found.</p>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </>
  );
}