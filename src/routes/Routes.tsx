import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import ErrorPage from "../pages/ErrorPage";
import HomePage from "../pages/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
        <MainLayout />
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/home"/>
      },
      {
        path: "home",
        element: <HomePage />,
      },
    ],
  },
  { path: "*", element: <ErrorPage /> },
]);

export default router;