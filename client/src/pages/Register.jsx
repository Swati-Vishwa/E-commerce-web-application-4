import { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../context/useAuth";
import { getErrorMessage } from "../services/api";
import Alert from "../components/Alert";

const inputClass =
  "w-full rounded-md border border-[#EBE6D8] bg-white px-3 py-2 text-sm text-[#1A1A1A] outline-none focus:border-[#E87CA6] focus:ring-2 focus:ring-[#E87CA6]/30";

const fields = [
  { name: "name", label: "Full name", type: "text" },
  { name: "email", label: "Email", type: "email" },
  { name: "password", label: "Password", type: "password" },
  { name: "confirm", label: "Confirm password", type: "password" },
];

export default function Register() {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    if (!form.name.trim()) return "Name is required.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Enter a valid email address.";
    if (form.password.length < 6) return "Password must be at least 6 characters.";
    if (form.password !== form.confirm) return "Passwords do not match.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const problem = validate();
    setError(problem);
    if (problem) return;

    try {
      setLoading(true);
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      // On success, the route guard sends the user to the products page
    } catch (err) {
      setError(getErrorMessage(err));
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-xl border border-[#EBE6D8] bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-[#1A1A1A]">Create an account</h1>
      <p className="text-sm text-[#1A1A1A]/60">Create an account to start shopping.</p>
      <Alert message={error} />

      <form onSubmit={handleSubmit} noValidate className="mt-6 grid gap-4">
        {fields.map((f) => (
          <div key={f.name}>
            <label htmlFor={f.name} className="mb-1 block text-sm font-medium text-[#1A1A1A]">
              {f.label}
            </label>
            <input
              id={f.name}
              name={f.name}
              type={f.type}
              value={form[f.name]}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-[#E87CA6] px-4 py-2 text-sm font-medium text-white hover:bg-[#d96893] disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-[#1A1A1A]/60">
        Already registered?{" "}
        <Link to="/login" className="font-medium text-[#E87CA6] hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}