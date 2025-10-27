import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  // if not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // otherwise render the requested page
  return children;
}
