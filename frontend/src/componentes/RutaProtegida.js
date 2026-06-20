import React from "react";
import { Navigate } from "react-router-dom";

const RutaProtegida = ({ children }) => {
  const token = localStorage.getItem("tokenAdmin");
  if (!token) return <Navigate to="/admin" replace />;
  return children;
};

export default RutaProtegida;
