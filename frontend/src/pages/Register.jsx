import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Register() {
  const API = import.meta.env.VITE_API_URL;
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const redirectTo = searchParams.get("redirect") || "/booking";

  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        setSuccess("Registration successful! Redirecting to login...");
        setTimeout(
          () => navigate(`/login?redirect=${encodeURIComponent(redirectTo)}`),
          2000,
        );
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (error) {
      setError("Registration failed. Please try again.");
      console.error("Registration failed:", error);
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
            CREATE ACCOUNT
          </p>
          <h1 className="mt-1.5 text-2xl font-bold">Register</h1>
          <p className="mt-1.5 text-xs text-slate-300">
            Join now and start booking seats instantly.
          </p>

          <div className="mt-4 space-y-3">
            <div>
              <label className="mb-1 block text-xs text-slate-300">
                Username
              </label>
              <input
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-md border border-slate-600 bg-slate-950 px-2.5 py-2 text-xs text-white placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
              />
            </div>

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

            <div>
              <label className="mb-1 block text-xs text-slate-300">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-md border border-slate-600 bg-slate-950 px-2.5 py-2 text-xs text-white placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {error && (
            <div className="mt-3 rounded-md border border-red-700 bg-red-950/60 px-2.5 py-2 text-xs text-red-200">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-3 rounded-md border border-green-700 bg-green-950/60 px-2.5 py-2 text-xs text-green-200">
              {success}
            </div>
          )}

          <button
            onClick={handleRegister}
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleLogin();
              }
            }}
            className="mt-4 w-full rounded-md bg-amber-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Register"}
          </button>

          <p className="mt-3 text-center text-xs text-slate-300">
            Already have an account?{" "}
            <button
              onClick={() =>
                navigate(`/login?redirect=${encodeURIComponent(redirectTo)}`)
              }
              className="font-semibold text-amber-400 hover:text-amber-300"
            >
              Login here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
