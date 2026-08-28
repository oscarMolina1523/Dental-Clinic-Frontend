import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import ErrorPage from "../pages/ErrorPage";
import HomePage from "../pages/Home";
import PatientsPage from "../pages/Patients";
import UsersPage from "../pages/Users";

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
      {
        path: "patients",
        element: <PatientsPage />,
      },
      {
        path: "users",
        element: <UsersPage />,
      },
    ],
  },
  { path: "*", element: <ErrorPage /> },
]);

export default router;