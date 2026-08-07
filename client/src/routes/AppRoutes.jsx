import { Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "../constants/routes.js";
import Layout from "../components/layout/Layout.jsx";
import ProtectedRoutes from "./ProtectedRoutes.jsx";
import Home from "../pages/Home/Home.jsx";
import Login from "../pages/Login/Login.jsx";
import Dashboard from "../pages/Dashboard/Dashboard.jsx";
import Templates from "../pages/Templates/Templates.jsx";
import Generator from "../pages/Generator/Generator.jsx";
import Downloads from "../pages/Downloads/Downloads.jsx";
import Profile from "../pages/Profile/Profile.jsx";
import Settings from "../pages/Settings/Settings.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.home} element={<Home />} />
      <Route path={ROUTES.login} element={<Login />} />

      <Route element={<ProtectedRoutes />}>
        <Route element={<Layout />}>
          <Route path={ROUTES.dashboard} element={<Dashboard />} />
          <Route path={ROUTES.templates} element={<Templates />} />
          <Route path={ROUTES.generator} element={<Generator />} />
          <Route path={ROUTES.downloads} element={<Downloads />} />
          <Route path={ROUTES.profile} element={<Profile />} />
          <Route path={ROUTES.settings} element={<Settings />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
    </Routes>
  );
}
