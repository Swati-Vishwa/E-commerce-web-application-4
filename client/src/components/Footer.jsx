// src/components/Footer.jsx
import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-oat-latte/50 bg-black/80 text-white">
      {/* Main Container */}
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:gap-12">

          {/* Brand & Description */}
          <div className="space-y-3 md:col-span-1">
            <Link to="/" className="font-serif text-2xl font-bold tracking-tight text-avocado-smoothie">
              Kstyle
            </Link>
            <p className="text-sm leading-relaxed text-slate-300/80">
              We got what you are looking for.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-avocado-smoothie">
              Links
            </h3>
            <ul className="space-y-2 text-sm text-slate-300/80">
              <li>
                <Link to="/" className="transition hover:text-coconut-cream hover:underline">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/orders" className="transition hover:text-coconut-cream hover:underline">
                  My Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-avocado-smoothie">
              Customer Care
            </h3>
            <ul className="space-y-2 text-sm text-slate-300/80">
              <li>
                <Link to="/cart" className="transition hover:text-coconut-cream hover:underline">
                  Your Cart
                </Link>
              </li>
              <li>
                <Link to="/faq" className="transition hover:text-coconut-cream hover:underline">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link to="/contact" className="transition hover:text-coconut-cream hover:underline">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div className="space-y-3 md:col-span-1">
            <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-avocado-smoothie">
              Stay Connected
            </h3>
            <p className="text-xs text-slate-300/80">
              Subscribe to get special offers and early access to drops.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-md border border-oat-latte bg-coconut-cream px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-savory-sage"
                required
              />
              <button
                type="submit"
                className="rounded-md bg-savory-sage px-4 py-2 text-xs font-semibold text-coconut-cream transition hover:opacity-90 shrink-0"
              >
                Join
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-oat-latte/60 pt-6 sm:flex-row">
          <p className="text-xs text-slate-300">
            © {year} Kstyle. All rights reserved.
          </p>

          <div className="flex gap-6 text-xs text-slate-300">
            <Link to="/privacy" className="hover:text-coconut-cream hover:underline">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-coconut-cream hover:underline">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}