import { Navigate, Outlet, useLocation } from "react-router-dom";

const PrivateRoute = () => {
  const token = localStorage.getItem("token");
  const location = useLocation();
  console.log("PrivateRoute: token =", token, "location.pathname =", location.pathname);

  // If no token and already on login → just render the login page
  if (!token && location.pathname === "/login") {
    return <Outlet />;
  }

  // If no token and trying to access any other route → redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If token is present → allow access
  return <Outlet />;
};

export default PrivateRoute;
