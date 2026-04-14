import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Booking from "./pages/Booking";
import Login from "./pages/Login";
import Landing from "./pages/Landing";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<Register />} />
      <Route path="/booking" element={<Booking />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
