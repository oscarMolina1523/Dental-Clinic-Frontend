import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import ErrorPage from "../pages/ErrorPage";
import HomePage from "../pages/Home";
import PatientsPage from "../pages/Patients";
import UsersPage from "../pages/Users";
import TreatmentCatalogPage from "../pages/TreatmentCatalogPage";

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
      {
        path: "treatments",
        element: <TreatmentCatalogPage />,
      },
    ],
  },
  { path: "*", element: <ErrorPage /> },
]);

export default router;