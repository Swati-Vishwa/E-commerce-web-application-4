import { Link } from "react-router-dom";
import useCart from "../context/useCart";
import { formatCurrency } from "../utils/format";
import ProductImage from "../components/ProductImage";

export default function Cart() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-slate-500">Your cart is empty.</p>
        <Link to="/" className="mt-3 inline-block text-blush-beet hover:underline">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold">Shopping Cart</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <ul className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <li
              key={item._id}
              className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <ProductImage src={item.image} alt={item.name} className="h-24 w-24 rounded-md" />

              <div className="flex flex-1 flex-col">
                <Link to={`/products/${item._id}`} className="font-semibold hover:text-indigo-600">
                  {item.name}
                </Link>
                <p className="text-sm text-slate-500">{formatCurrency(item.price)} each</p>

                <div className="mt-auto flex flex-wrap items-center gap-3 pt-3">
                  <div className="flex items-center rounded-md border border-slate-300">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="px-3 py-1 hover:bg-slate-100 disabled:opacity-40"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="min-w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="px-3 py-1 hover:bg-slate-100 disabled:opacity-40"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item._id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <p className="font-semibold whitespace-nowrap">
                {formatCurrency(item.price * item.quantity)}
              </p>
            </li>
          ))}
        </ul>

        <div className="h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">Order summary</h2>
          <div className="mt-4 flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>{formatCurrency(totalPrice)}</span>
          </div>
          <Link
            to="/checkout"
            className="mt-5 block rounded-md bg-black px-4 py-2 text-center text-sm font-medium text-white hover:border-2 hover:text-black hover:bg-transparent"
          >
            Proceed to checkout
          </Link>
        </div>
      </div>
    </>
  );
}