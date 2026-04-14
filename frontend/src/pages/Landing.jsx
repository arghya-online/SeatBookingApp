import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import landingPng from "../assets/landing.png";

export default function Landing() {
  const API = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    setUserName(localStorage.getItem("userName") || "");
  }, []);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const res = await fetch(`${API}/api/movies`);
        const data = await res.json();

        if (!res.ok) {
          return;
        }

        setMovies(data);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      }
    };

    loadMovies();
  }, []);

  const colOne = [...movies, ...movies];
  const colTwo = [...movies.slice().reverse(), ...movies.slice().reverse()];

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0">
        <img
          src={landingPng}
          alt="Cinema background"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-black/65"></div>

      <style>{`
        @keyframes scrollUp {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }

        @keyframes scrollDown {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }

        @keyframes fadePulse {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 1; }
        }
      `}</style>

      <div className="relative z-20">
        <Navbar />
      </div>

      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-72px)] max-w-7xl grid-cols-1 items-center gap-10 px-6 py-10 lg:grid-cols-2 lg:px-12">
        <div className="max-w-xl text-left">
          {userName && (
            <h5 className="mb-2 text-sm font-medium text-amber-300">
              Welcome,{" "}
              <span className="text-orange-400">{userName.toUpperCase()}!</span>
            </h5>
          )}
          <p className="font-poster mb-3 text-lg leading-none text-amber-400">
            NOW SHOWING
          </p>
          <h1 className="font-display text-4xl font-bold leading-tight md:text-6xl">
            {movies[4]?.title || "Discover Your Next Movie Night"}
          </h1>
          <img
            src="https://i.pinimg.com/1200x/9c/fb/a0/9cfba071a6e538d59129687d07f24ea3.jpg"
            alt={movies[4]?.title}
            className="mt-2 h-80 w-full shadow-lg"
          />
          <p className="mt-4 text-base text-slate-200 md:text-lg font-medium">
            Browse trending movies, pick your favorite showtime, and reserve
            seats in seconds.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/movies")}
              className="rounded-md border border-amber-500/70 bg-black/40 px-6 py-3 font-semibold text-amber-300 transition hover:bg-black/70"
            >
              Explore Movies
            </button>
          </div>
        </div>

        <div className="relative z-9999 hidden h-[90vh] items-center justify-center gap-6 lg:flex">
          <div className="h-full w-64 overflow-hidden">
            <div style={{ animation: "scrollUp 24s linear infinite" }}>
              {colOne.map((movie, idx) => (
                <div
                  key={`${movie.id}-up-${idx}`}
                  className="mb-3 overflow-hidden"
                  style={{
                    animation: `fadePulse 2.8s ease-in-out ${idx * 0.22}s infinite`,
                  }}
                >
                  <img
                    src={movie.img}
                    alt={movie.title}
                    className="h-80 w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="h-full w-64 overflow-hidden">
            <div style={{ animation: "scrollDown 28s linear infinite" }}>
              {colTwo.map((movie, idx) => (
                <div
                  key={`${movie.id}-down-${idx}`}
                  className="mb-3 overflow-hidden"
                  style={{
                    animation: `fadePulse 3.2s ease-in-out ${idx * 0.24}s infinite`,
                  }}
                >
                  <img
                    src={movie.img}
                    alt={movie.title}
                    className="h-64 w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 lg:hidden">
          {movies.slice(0, 4).map((movie) => (
            <div
              key={`mobile-${movie.id}`}
              className="overflow-hidden rounded-lg border border-slate-500/40 bg-black/40"
            >
              <img
                src={movie.img}
                alt={movie.title}
                className="h-44 w-full object-cover"
              />
              <div className="font-poster px-2 py-1.5 text-sm leading-none text-slate-100">
                {movie.title}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto mt-2 grid max-w-7xl grid-cols-1 gap-4 px-6 md:grid-cols-3 lg:px-12">
        <div className="rounded-xl border border-slate-700 bg-slate-900/40 px-5 py-4">
          <p className="font-poster text-base leading-none text-amber-400">
            MOVIES
          </p>
          <p className="mt-2 text-3xl font-bold">{movies.length || 0}+</p>
          <p className="mt-1 text-sm text-slate-300">
            Now streaming in our halls
          </p>
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-900/40 px-5 py-4">
          <p className="font-poster text-base leading-none text-amber-400">
            SEATS
          </p>
          <p className="mt-2 text-3xl font-bold">40</p>
          <p className="mt-1 text-sm text-slate-300">Seats per movie layout</p>
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-900/40 px-5 py-4">
          <p className="font-poster text-base leading-none text-amber-400">
            EXPERIENCE
          </p>
          <p className="mt-2 text-3xl font-bold">Instant</p>
          <p className="mt-1 text-sm text-slate-300">
            Fast booking in a few clicks
          </p>
        </div>
      </section>

      <section className="relative z-10 mx-auto mt-12 max-w-7xl px-6 lg:px-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="font-poster text-base leading-none text-amber-400">
              HIGHLIGHTS
            </p>
            <h2 className="font-display mt-2 text-2xl font-bold md:text-3xl">
              Why Users Love This App
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <article className="rounded-xl border border-slate-700 bg-slate-900/45 p-5">
            <p className="text-sm font-semibold text-amber-300">
              Movie-First Booking
            </p>
            <p className="mt-2 text-sm text-slate-300">
              Every movie has its own seat map, so booking stays clean and
              organized.
            </p>
          </article>
          <article className="rounded-xl border border-slate-700 bg-slate-900/45 p-5">
            <p className="text-sm font-semibold text-amber-300">
              Live Seat Status
            </p>
            <p className="mt-2 text-sm text-slate-300">
              Green and red seats update quickly, giving you instant booking
              feedback.
            </p>
          </article>
          <article className="rounded-xl border border-slate-700 bg-slate-900/45 p-5">
            <p className="text-sm font-semibold text-amber-300">
              Secure Access
            </p>
            <p className="mt-2 text-sm text-slate-300">
              Login-protected flow ensures only authenticated users can reserve
              seats.
            </p>
          </article>
        </div>
      </section>

      <section className="relative z-10 mx-auto mt-12 max-w-7xl px-6 lg:px-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="font-poster text-base leading-none text-amber-400">
              TRENDING
            </p>
            <h2 className="font-display mt-2 text-2xl font-bold md:text-3xl">
              Top Picks Tonight
            </h2>
          </div>
          <button
            onClick={() => navigate("/movies")}
            className="rounded-md border border-amber-500 px-4 py-2 text-sm font-semibold text-amber-300 transition hover:bg-amber-500 hover:text-black"
          >
            View All
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {movies.slice(0, 6).map((movie) => (
            <button
              key={`feature-${movie.id}`}
              onClick={() => navigate(`/booking?movieId=${movie.id}`)}
              className="overflow-hidden rounded-lg border border-slate-700 bg-slate-900/45 text-left transition hover:border-amber-500/80"
            >
              <img
                src={movie.img}
                alt={movie.title}
                className="h-44 w-full object-cover"
              />
              <div className="p-2.5">
                <p className="font-poster line-clamp-1 text-base leading-none text-slate-100">
                  {movie.title}
                </p>
                <p className="mt-1 text-xs text-amber-300">
                  IMDB {movie.rating}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto mt-12 max-w-7xl px-6 pb-10 lg:px-12">
        <div className="rounded-2xl border border-slate-700 bg-slate-900/45 px-6 py-8 text-center md:text-left">
          <h3 className="font-display text-2xl font-bold">
            Ready for your next movie night?
          </h3>
          <p className="mt-2 text-sm text-slate-300">
            Choose a movie, lock your favorite seat, and enjoy the show.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3 md:justify-start">
            <button
              onClick={() => navigate("/movies")}
              className="rounded-md bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-500"
            >
              Browse Movies
            </button>
            <button
              onClick={() => navigate("/booking")}
              className="rounded-md border border-slate-500 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
            >
              Quick Book
            </button>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-slate-800 bg-black/75">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <p className="font-display text-xl text-slate-100">
                bookyourseat
              </p>
              <p className="mt-2 max-w-sm text-sm text-slate-400">
                Smart movie seat booking with quick flow, clear seat status, and
                a smooth theater experience.
              </p>
              <p className="mt-3 text-xs tracking-[0.15em] text-amber-400">
                CINEMA. COMFORT. CLICK.
              </p>
            </div>

            <div>
              <p className="font-poster text-lg text-slate-100">Quick Links</p>
              <div className="mt-3 flex flex-col items-start gap-2 text-sm text-slate-400">
                <button
                  onClick={() => navigate("/")}
                  className="transition hover:text-slate-200"
                >
                  Home
                </button>
                <button
                  onClick={() => navigate("/movies")}
                  className="transition hover:text-slate-200"
                >
                  Explore Movies
                </button>
                <button
                  onClick={() => navigate("/booking")}
                  className="transition hover:text-slate-200"
                >
                  Book Tickets
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="transition hover:text-slate-200"
                >
                  Account
                </button>
              </div>
            </div>

            <div>
              <p className="font-poster text-lg text-slate-100">Connect</p>
              <p className="mt-2 text-sm text-slate-400">
                Follow us for upcoming releases and special screenings.
              </p>
              <div className="mt-4 flex items-center gap-3">
                <a
                  href="arghyalogs.in"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="rounded-full border border-slate-600 p-2 text-slate-300 transition hover:border-amber-500 hover:text-amber-300"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 fill-current"
                    aria-hidden="true"
                  >
                    <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.8A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95h-8.5Zm8.95 1.35a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8A3.2 3.2 0 1 0 12 15.2 3.2 3.2 0 0 0 12 8.8Z" />
                  </svg>
                </a>
                <a
                  href="https://x.com/arghyabuilds"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="X"
                  className="rounded-full border border-slate-600 p-2 text-slate-300 transition hover:border-amber-500 hover:text-amber-300"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 fill-current"
                    aria-hidden="true"
                  >
                    <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.28l-4.91-6.44L6.37 22H3.25l7.24-8.28L.8 2h6.43l4.44 5.9L18.9 2Zm-1.1 18.1h1.74L6.28 3.81H4.41L17.8 20.1Z" />
                  </svg>
                </a>
                <a
                  href="https://www.youtube.com/@arghya_explains_"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                  className="rounded-full border border-slate-600 p-2 text-slate-300 transition hover:border-amber-500 hover:text-amber-300"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 fill-current"
                    aria-hidden="true"
                  >
                    <path d="M23.2 7.2a3.05 3.05 0 0 0-2.14-2.16C19.17 4.5 12 4.5 12 4.5s-7.17 0-9.06.54A3.05 3.05 0 0 0 .8 7.2 31.7 31.7 0 0 0 .25 12c0 1.62.2 3.24.55 4.8a3.05 3.05 0 0 0 2.14 2.16c1.89.54 9.06.54 9.06.54s7.17 0 9.06-.54a3.05 3.05 0 0 0 2.14-2.16c.35-1.56.55-3.18.55-4.8 0-1.62-.2-3.24-.55-4.8ZM9.7 15.1V8.9l5.45 3.1-5.45 3.1Z" />
                  </svg>
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="rounded-full border border-slate-600 p-2 text-slate-300 transition hover:border-amber-500 hover:text-amber-300"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 fill-current"
                    aria-hidden="true"
                  >
                    <path d="M13.5 22v-8h2.7l.5-3h-3.2V9.2c0-.87.3-1.47 1.55-1.47H17V5.03A22.27 22.27 0 0 0 14.58 4c-2.4 0-4.08 1.47-4.08 4.17V11H8v3h2.5v8h3Z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-2 border-t border-slate-800 pt-4 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
            <p>
              © {new Date().getFullYear()} bookyourseat. All rights reserved.
            </p>
            <p>
              Built for movie lovers. Seat availability updates in real time.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
