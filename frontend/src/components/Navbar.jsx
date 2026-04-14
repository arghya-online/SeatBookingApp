import React from "react";
import { Link, useNavigate } from "react-router-dom";
import icon from "../assets/icon.png";

function Navbar() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(
    Boolean(localStorage.getItem("token")),
  );
  const navigate = useNavigate();

  React.useEffect(() => {
    const syncAuthState = () => {
      setIsAuthenticated(Boolean(localStorage.getItem("token")));
    };

    window.addEventListener("storage", syncAuthState);
    window.addEventListener("focus", syncAuthState);

    return () => {
      window.removeEventListener("storage", syncAuthState);
      window.removeEventListener("focus", syncAuthState);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setIsAuthenticated(false);
    setMenuOpen(false);
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-700/70 bg-slate-950/70 px-6 py-4 backdrop-blur-md md:px-12 lg:px-20">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img
            src={icon}
            alt="Logo"
            className="h-8 w-8 rounded-md object-cover"
          />
          <span
            className="text-lg font-semibold tracking-wide text-slate-100"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            bookyourseat
          </span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          <Link
            to="/"
            className="text-sm text-slate-300 transition hover:text-white"
          >
            Home
          </Link>
          <Link
            to="/booking"
            className="text-sm text-slate-300 transition hover:text-white"
          >
            Booking
          </Link>
          <Link
            to="/movies"
            className="text-sm text-slate-300 transition hover:text-white"
          >
            Movies
          </Link>
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="rounded-md bg-amber-600 px-4 py-1.5 text-sm font-semibold text-white shadow-lg shadow-green-700/30 transition hover:scale-[1.02] hover:bg-amber-500"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-md border border-slate-600 px-4 py-1.5 text-sm text-slate-200 transition hover:border-slate-400 hover:text-white"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-md bg-amber-600 px-4 py-1.5 text-sm font-semibold text-white shadow-lg shadow-green-700/30 transition hover:scale-[1.02] hover:bg-amber-500"
              >
                Register
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="flex flex-col gap-1.5 bg-transparent p-1 md:hidden"
          aria-label="Toggle menu"
        >
          <span
            className={`block h-0.5 w-6 bg-slate-200 transition-transform ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
          ></span>
          <span
            className={`block h-0.5 w-6 bg-slate-200 transition-opacity ${menuOpen ? "opacity-0" : ""}`}
          ></span>
          <span
            className={`block h-0.5 w-6 bg-slate-200 transition-transform ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
          ></span>
        </button>
      </div>

      {menuOpen && (
        <div className="mt-4 flex flex-col gap-2 rounded-xl border border-slate-700 bg-slate-900/90 p-4 md:hidden">
          <Link
            to="/"
            className="rounded-md px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-800"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/booking"
            className="rounded-md px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-800"
            onClick={() => setMenuOpen(false)}
          >
            Booking
          </Link>
          <Link
            to="/movies"
            className="rounded-md px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-800"
            onClick={() => setMenuOpen(false)}
          >
            Movies
          </Link>
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="rounded-md bg-amber-600 px-3 py-2 text-sm font-semibold text-white hover:bg-amber-500"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-md px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-800"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-md bg-amber-600 px-3 py-2 text-sm font-semibold text-white hover:bg-amber-500"
                onClick={() => setMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
