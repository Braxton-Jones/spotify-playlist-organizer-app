import LandingPage from "./layout/pages/LandingPage";
import Home, { loader as homeLoader } from "./layout/pages/Home";
import { useState, useEffect } from "react";
import { accessToken } from "./utility/api_auth.jsx";
import { useLocation } from "react-router-dom";
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import ErrorPage from "./layout/pages/ErrorPage";


export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route
        path="/"
        element={<Home />}
        loader={homeLoader}
        errorElement={<ErrorPage />}
      />
      <Route path="*" element={<ErrorPage />} />
    </>,
  ),
);

export default function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    setToken(accessToken);
  }, []);

  return token ? (
      <RouterProvider router={router} />
  ) : (
    <LandingPage />
  );
}
