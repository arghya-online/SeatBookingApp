import React from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div>
      <h1>Seat Booking App</h1>
      <p>Book seats instantly</p>
      <button
        onClick={handleLogin}
        className="bg-red-500 m-4 p-4 border-black border-2"
      >
        Login
      </button>
      <button
        onClick={handleRegister}
        className="bg-amber-500 m-4 p-4 border-black border-2"
      >
        Register
      </button>
    </div>
  );
}
