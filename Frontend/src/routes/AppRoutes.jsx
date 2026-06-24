import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import isLoggedIn from "../utils/isLoggedIn";
import Home from "../Pages/Home";
import Register from "../Pages/Register";
import Login from "../Pages/Login";

const AppRoutes = () => {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const result = await isLoggedIn();
        setAuth(result);
      } catch (err) {
        console.log("Auth error:", err);
        setAuth(false);
      }
    };
    checkAuth();
  }, []);

  if (auth === null) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[var(--bg-primary)] text-[var(--text-secondary)] transition-colors duration-300">
        <div className="flex items-center gap-3">
          <span className="w-5 h-5 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin"></span>
          <p className="text-sm">Checking auth...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={auth ? <Home setAuth={setAuth} /> : <Navigate to="/login" />}
        />

        {/* Register apna setAuth use nahi karta — register ke baad login page pe bhejta hai, auto-login nahi */}
        <Route
          path="/register"
          element={!auth ? <Register /> : <Navigate to="/" />}
        />

        <Route
          path="/login"
          element={!auth ? <Login setAuth={setAuth} /> : <Navigate to="/" />}
        />

        <Route path="*" element={<Navigate to={auth ? "/" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
