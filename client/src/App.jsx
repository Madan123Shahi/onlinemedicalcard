import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import { RequireAuth, RequireAdmin } from "./components/Guards.jsx";
import Home from "./pages/Home.jsx";
import Services from "./pages/Services.jsx";
import Book from "./pages/Book.jsx";
import Contact from "./pages/Contact.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Admin from "./pages/Admin.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="services" element={<Services />} />
        <Route path="contact" element={<Contact />} />
        <Route path="login" element={<AuthPage mode="login" />} />
        <Route path="register" element={<AuthPage mode="register" />} />
        <Route element={<RequireAuth />}>
          <Route path="book" element={<Book />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<RequireAdmin />}>
          <Route path="admin" element={<Admin />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
