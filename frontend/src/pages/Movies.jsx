import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Movies() {
  const API = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API}/api/movies`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Failed to load movies");
          return;
        }

        setMovies(data);
      } catch (error) {
        console.error("Failed to load movies:", error);
        setError("Failed to load movies");
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="mx-auto max-w-7xl px-6 py-10 md:px-10 lg:px-12">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm tracking-[0.15em] text-amber-400">EXPLORE</p>
            <h1 className="mt-2 text-3xl font-bold md:text-4xl">All Movies</h1>
            <p className="mt-2 text-slate-300">
              Choose a movie and continue to seat booking.
            </p>
          </div>

          <button
            onClick={() => navigate("/booking?movieId=1")}
            className="rounded-md bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-500"
          >
            Go to Booking
          </button>
        </div>

        {loading && (
          <p className="mb-4 text-sm text-slate-300">Loading movies...</p>
        )}
        {error && <p className="mb-4 text-sm text-red-300">{error}</p>}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {movies.map((movie) => (
            <article
              key={movie.id}
              className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900/40"
            >
              <img
                src={movie.img}
                alt={movie.title}
                className="h-72 w-full object-cover"
              />

              <div className="p-4">
                <h2 className="text-lg font-semibold">{movie.title}</h2>
                <p className="mt-1 text-sm text-amber-300">
                  IMDB: {movie.rating}
                </p>

                <button
                  onClick={() => navigate(`/booking?movieId=${movie.id}`)}
                  className="mt-4 w-full rounded-md border border-amber-500 px-3 py-2 text-sm font-semibold text-amber-300 transition hover:bg-amber-500 hover:text-black"
                >
                  Book Seats
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
