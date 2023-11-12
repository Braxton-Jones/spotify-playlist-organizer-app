import LandingPage from "./layout/pages/LandingPage"
import PlaylistDetails, {loader as detailsLoader} from "./layout/subpages/PlaylistDetails";
import Home, {loader as homeLoader} from "./layout/pages/Home"
import { useState, useEffect } from 'react';
import { accessToken} from './api_auth.jsx';
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route
} from "react-router-dom"
import ErrorPage from "./layout/pages/ErrorPage";


const router = createBrowserRouter(
    createRoutesFromElements(<>
    <Route 
      path="/"
      element={<Home/>}
      loader={homeLoader}
      errorElement={<ErrorPage/>}
    />
     <Route
     path="/details/:id/:name"
     loader={detailsLoader}
     element={<PlaylistDetails/>}
     errorElement={<ErrorPage/>}
   />
   <Route path="*" element={<ErrorPage/>}/>
   
   </>
))

export default function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    setToken(accessToken);
  }, []);

  return token ? <RouterProvider router={router} /> : <LandingPage />
}


