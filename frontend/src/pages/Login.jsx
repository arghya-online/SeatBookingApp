import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
const API = import.meta.env.VITE_API_URL;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const redirectTo = searchParams.get("redirect") || "/booking";

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        if (data.user?.name) {
          localStorage.setItem("userName", data.user.name);
        }
        console.log("Token Saved and Login successful:", data);
        navigate(redirectTo);
      } else {
        setError(data.message || "Login failed");
      }
    } catch (error) {
      setError("Login failed. Please try again.");
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-8 md:px-8 lg:px-10">
        <div className="w-full max-w-sm rounded-xl border border-slate-700 bg-slate-900/40 p-5 shadow-2xl">
          <p className="text-xs tracking-[0.15em] text-amber-400">
            WELCOME BACK
          </p>
          <h1 className="mt-1.5 text-2xl font-bold">Login</h1>
          <p className="mt-1.5 text-xs text-slate-300">
            Sign in to continue booking your favorite seats.
          </p>

          <div className="mt-4 space-y-3">
            <div>
              <label className="mb-1 block text-xs text-slate-300">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-slate-600 bg-slate-950 px-2.5 py-2 text-xs text-white placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-slate-300">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-slate-600 bg-slate-950 px-2.5 py-2 text-xs text-white placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {error && (
            <div className="mt-3 rounded-md border border-red-700 bg-red-950/60 px-2.5 py-2 text-xs text-red-200">
              {error}
            </div>
          )}

          <button
            className="mt-4 w-full rounded-md bg-amber-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={handleLogin}
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
              handleLogin();
              }
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="mt-3 text-center text-xs text-slate-300">
            New here?{" "}
            <button
              onClick={() =>
                navigate(`/register?redirect=${encodeURIComponent(redirectTo)}`)
              }
              className="font-semibold text-amber-400 hover:text-amber-300"
            >
              Create an account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
