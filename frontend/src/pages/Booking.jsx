import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function Booking() {
  const API = import.meta.env.VITE_API_URL;
  const [movies, setMovies] = useState([]);
  const [seats, setSeats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMoviesLoading, setIsMoviesLoading] = useState(true);
  const [busySeatId, setBusySeatId] = useState(null);
  const [animSeatId, setAnimSeatId] = useState(null);
  const [toast, setToast] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const selectedMovieId = Number(searchParams.get("movieId"));
  const selectedMovie = movies.find((movie) => movie.id === selectedMovieId);

  const showToast = useCallback((text, type = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 2200);
  }, []);

  const triggerSeatAnimation = (seatId) => {
    setAnimSeatId(seatId);
    setTimeout(() => setAnimSeatId(null), 220);
  };

  const fetchSeats = useCallback(
    async (movieId) => {
      try {
        setIsLoading(true);
        const res = await fetch(`${API}/api/movies/${movieId}/seats`);
        const data = await res.json();

        if (!res.ok) {
          showToast(data.message || "Failed to fetch seats", "error");
          return;
        }

        setSeats(data);
      } catch (error) {
        console.error("Error fetching seats:", error);
        showToast("Error fetching seats", "error");
      } finally {
        setIsLoading(false);
      }
    },
    [showToast],
  );

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setIsMoviesLoading(true);
        const res = await fetch(`${API}/api/movies`);
        const data = await res.json();

        if (!res.ok) {
          showToast(data.message || "Failed to load movies", "error");
          return;
        }

        setMovies(data);

        if ((!selectedMovieId || selectedMovieId <= 0) && data.length > 0) {
          setSearchParams({ movieId: String(data[0].id) });
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
        showToast("Error fetching movies", "error");
      } finally {
        setIsMoviesLoading(false);
      }
    };

    loadMovies();
  }, [selectedMovieId, setSearchParams, showToast]);

  useEffect(() => {
    if (!selectedMovieId || Number.isNaN(selectedMovieId)) {
      return;
    }

    fetchSeats(selectedMovieId);
  }, [selectedMovieId, fetchSeats]);

  const handleBookSeat = async (id) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      setBusySeatId(id);
      triggerSeatAnimation(id);

      const res = await fetch(
        `${API}/api/movies/${selectedMovieId}/seats/${id}/book`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await res.json();
      console.log(data);

      if (!res.ok) {
        showToast(data.message || "Failed to book seat", "error");
        return;
      }

      showToast(data.message || `Seat ${id} booked`, "success");

      //refresh seats after booking
      fetchSeats(selectedMovieId);
    } catch (error) {
      console.error("Error booking seat:", error);
      showToast("Error booking seat", "error");
    } finally {
      setBusySeatId(null);
    }
  };

  const handleDeleteSeat = async (id) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      setBusySeatId(id);
      triggerSeatAnimation(id);

      const res = await fetch(
        `${API}/api/movies/${selectedMovieId}/seats/${id}/book`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await res.json();
      console.log(data);

      if (!res.ok) {
        showToast(data.message || "Failed to unbook seat", "error");
        return;
      }

      showToast(data.message || `Seat ${id} unbooked`, "success");

      //refresh seats after deleting booking
      fetchSeats(selectedMovieId);
    } catch (error) {
      console.error("Error deleting seat booking:", error);
      showToast("Error deleting seat booking", "error");
    } finally {
      setBusySeatId(null);
    }
  };

  const bookedSeats = seats.filter((seat) => seat.isbooked).length;
  const availableSeats = seats.length - bookedSeats;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {toast && (
        <div className="pointer-events-none fixed right-4 top-20 z-50">
          <div
            className={`rounded-md border px-4 py-3 text-sm font-medium shadow-lg ${
              toast.type === "error"
                ? "border-red-700 bg-red-950/95 text-red-100"
                : "border-green-700 bg-green-950/95 text-green-100"
            }`}
          >
            {toast.text}
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-6 py-10 md:px-10 lg:px-12">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm tracking-[0.15em] text-amber-400">BOOKING</p>
            <h1 className="mt-2 text-3xl font-bold md:text-4xl">
              Choose Your Seats
            </h1>
            <p className="mt-2 text-slate-300">
              {selectedMovie
                ? `Movie: ${selectedMovie.title}. Click green seats to book and red seats to unbook.`
                : "Select a movie first, then book seats."}
            </p>
          </div>

          <div className="flex gap-3">
            <select
              className="rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-200"
              value={Number.isNaN(selectedMovieId) ? "" : selectedMovieId}
              onChange={(e) => setSearchParams({ movieId: e.target.value })}
              disabled={isMoviesLoading || movies.length === 0}
            >
              {movies.map((movie) => (
                <option key={movie.id} value={movie.id}>
                  {movie.title}
                </option>
              ))}
            </select>

            <button
              onClick={() => navigate("/movies")}
              className="rounded-md border border-amber-500 px-5 py-2.5 text-sm font-semibold text-amber-300 transition hover:bg-amber-500 hover:text-black"
            >
              Explore Movies
            </button>
          </div>
        </div>

        {!selectedMovieId || Number.isNaN(selectedMovieId) ? (
          <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-6 text-center">
            <p className="text-slate-300">
              Please select a movie to see seat availability.
            </p>
            <button
              onClick={() => navigate("/movies")}
              className="mt-4 rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-500"
            >
              Go to Movies
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-slate-700 bg-slate-900/40 px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Total
                </p>
                <p className="mt-1 text-2xl font-semibold">{seats.length}</p>
              </div>
              <div className="rounded-lg border border-slate-700 bg-slate-900/40 px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Available
                </p>
                <p className="mt-1 text-2xl font-semibold text-green-400">
                  {availableSeats}
                </p>
              </div>
              <div className="rounded-lg border border-slate-700 bg-slate-900/40 px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Booked
                </p>
                <p className="mt-1 text-2xl font-semibold text-red-400">
                  {bookedSeats}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-900/40 p-5 md:p-7">
              <div className="mb-8 text-center">
                <div className="mx-auto h-2 w-full max-w-xl rounded-full bg-slate-700">
                  <div className="h-2 w-full rounded-full bg-amber-500/70"></div>
                </div>
                <p className="mt-2 text-xs tracking-[0.2em] text-slate-400">
                  SCREEN
                </p>
              </div>

              {isLoading ? (
                <p className="py-10 text-center text-slate-300">
                  Loading seats...
                </p>
              ) : (
                <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
                  {seats.map((seat) => (
                    <button
                      key={seat.id}
                      onClick={() => {
                        if (!seat.isbooked) handleBookSeat(seat.id);
                        else handleDeleteSeat(seat.id);
                      }}
                      disabled={busySeatId === seat.id}
                      className={`rounded-md border px-3 py-2 text-center text-sm font-semibold transition duration-150 ${
                        seat.isbooked
                          ? "border-red-800 bg-red-900/70 text-red-100 hover:bg-red-800/80"
                          : "border-green-800 bg-green-900/70 text-green-100 hover:bg-green-800/80"
                      } ${
                        animSeatId === seat.id ? "scale-110" : "scale-100"
                      } ${busySeatId === seat.id ? "opacity-70" : "opacity-100"} `}
                      aria-busy={busySeatId === seat.id}
                      title={
                        busySeatId === seat.id
                          ? `Updating seat ${seat.id}...`
                          : seat.isbooked
                            ? `Seat ${seat.id} booked`
                            : `Seat ${seat.id} available`
                      }
                    >
                      {seat.seat_number || seat.id}
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded border border-green-800 bg-green-900/70"></span>
                  Available
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded border border-red-800 bg-red-900/70"></span>
                  Booked
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Booking;
