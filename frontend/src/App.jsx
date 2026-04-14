import React from "react";
import "./App.css";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Register from "./pages/Register";
import Booking from "./pages/Booking";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import Movies from "./pages/Movies";

function RequireAuth({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("token");

  if (!token) {
    const redirectTo = `${location.pathname}${location.search}`;
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(redirectTo)}`}
        replace
      />
    );
  }

  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/booking"
        element={
          <RequireAuth>
            <Booking />
          </RequireAuth>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/movies" element={<Movies />} />
    </Routes>
  );
}

export default App;
