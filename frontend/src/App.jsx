import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout.jsx";
import Home from "@/pages/Home.jsx";
import Login from "@/pages/Login.jsx";
import Register from "@/pages/Register.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
    </Routes>
  );
}
