import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";
import useCart from "../context/useCart";

const linkClass = ({ isActive }) =>
  `rounded-md px-3 py-2 text-sm font-medium transition ${isActive ? "bg-blush-beet text-white" : "text-slate-600 hover:bg-slate-100"
  }`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="border-b border-slate-200 bg-peach-protein">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-3">
        <Link to="/" className="text-5xl font-serif font-bold text-amber-950">
          Kstyle
        </Link>

        <div className="flex flex-wrap items-center gap-1">
          <NavLink to="/" end className={linkClass}>Products</NavLink>
          <NavLink to="/cart" className={linkClass}>
            Cart{totalItems > 0 && ` (${totalItems})`}
          </NavLink>

          {user && <NavLink to="/orders" className={linkClass}>My Orders</NavLink>}

          {user?.role === "admin" && (
            <>
              <NavLink to="/admin/products" className={linkClass}>Manage Products</NavLink>
              <NavLink to="/admin/orders" className={linkClass}>Manage Orders</NavLink>
            </>
          )}

          {user ? (
            <>
              <span className="hidden px-2 text-sm text-slate-500 sm:inline">{user.name}</span>
              <button
                onClick={handleLogout}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm hover:bg-blush-beet hover:text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>Login</NavLink>
              <NavLink to="/register" className={linkClass}>Register</NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}