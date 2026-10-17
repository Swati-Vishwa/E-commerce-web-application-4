import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "./context/AuthProvider";
import CartProvider from "./context/CartProvider";
import Navbar from "./components/Navbar";
import { ProtectedRoute, GuestRoute, AdminRoute } from "./components/RouteGuards";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ManageProducts from "./pages/admin/ManageProducts";
import ManageOrders from "./pages/admin/ManageOrders";
import NotFound from "./pages/NotFound";
import useAuth from "./context/useAuth";

function CartScope({ children }) {
  const { user } = useAuth();
  return (
    <CartProvider key={user?._id ?? "guest"} userId={user?._id}>
      {children}
    </CartProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartScope>
          <div className="min-h-screen bg-coconut-cream text-slate-800">
            <Navbar />
            <main className="mx-auto max-w-6xl px-4 py-8">
              <Routes>
                {/* Public */}
                <Route path="/" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />

                {/* Logged-out only */}
                <Route element={<GuestRoute />}>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Route>

                {/* Logged-in users */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/orders" element={<Orders />} />
                </Route>

                {/* Admin only */}
                <Route element={<AdminRoute />}>
                  <Route path="/admin/products" element={<ManageProducts />} />
                  <Route path="/admin/orders" element={<ManageOrders />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </CartScope>
      </AuthProvider>
    </BrowserRouter>
  );
}
