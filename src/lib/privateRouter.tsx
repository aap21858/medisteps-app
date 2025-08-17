import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import apiClient from "./apiClient";

const PrivateRoute = () => {
  const token = localStorage.getItem("token");
  const location = useLocation();
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    if (token) {
      apiClient
        .get("/api/auth/validate")
        .then(() => setIsValid(true))
        .catch(() => {
          localStorage.removeItem("token");
          setIsValid(false);
        });
    } else {
      setIsValid(false);
    }
  }, [location.pathname]); // run on every route change

  if (isValid === null) {
    return <p>Checking authentication...</p>; // loading state
  }

  if (!isValid) {
    if (location.pathname === "/login") {
      return <Outlet />;
    }
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
