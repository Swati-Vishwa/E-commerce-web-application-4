import { Link } from "react-router-dom";
import useCart from "../context/useCart";
import { formatCurrency } from "../utils/format";
import ProductImage from "./ProductImage";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const outOfStock = product.stock === 0;

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-honey-oatmilk/30 shadow-sm">
      <Link to={`/products/${product._id}`}>
        <ProductImage src={product.image} alt={product.name} className="h-48 w-full" />
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs tracking-wide text-slate-500 uppercase">{product.category}</p>
        <Link
          to={`/products/${product._id}`}
          className="mt-1 font-semibold hover:text-amber-950/70"
        >
          {product.name}
        </Link>
        <p className="mt-2 text-lg font-bold text-savory-sage">{formatCurrency(product.price)}</p>
        <p className={`text-xs ${outOfStock ? "text-red-600" : "text-green-600"}`}>
          {outOfStock ? "Out of stock" : `${product.stock} in stock`}
        </p>

        <div className="mt-auto pt-4">
          <button
            disabled={outOfStock}
            onClick={() => addItem(product)}
            className="w-full rounded-md bg-savory-sage px-4 py-2 text-sm font-medium text-white hover:bg-savory-sage/70 disabled:cursor-not-allowed disabled:bg-avocado-smoothie"
          >
            {outOfStock ? "Unavailable" : "Add to cart"}
          </button>
        </div>
      </div>
    </div>
  );
}