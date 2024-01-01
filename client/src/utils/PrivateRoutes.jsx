import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuthContext from "../hooks/useAuthContext";

export default function PublicRoute() {
  const { user } = useAuthContext();

  if (user) {
    return <Outlet />;
  }

  return <Navigate to={"/home"} replace />;
}
