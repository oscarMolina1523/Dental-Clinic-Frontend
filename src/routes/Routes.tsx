import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import ErrorPage from "../pages/ErrorPage";
import HomePage from "../pages/Home";
import PatientsPage from "../pages/Patients";
import UsersPage from "../pages/Users";
import TreatmentCatalogPage from "../pages/TreatmentCatalogPage";
import ProductsPage from "../pages/ProductsPage";
import InventoryPage from "../pages/InventoryPage";
import LotesPage from "../pages/LotesPage";
import AppointmentPage from "../pages/AppointmentPage";

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
      {
        path: "products",
        element: <ProductsPage />,
      },
      {
        path: "inventories",
        element: <InventoryPage />,
      },
      {
        path: "inventory-lotes",
        element: <LotesPage />,
      },
      {
        path: "agenda",
        element: <AppointmentPage />,
      },
    ],
  },
  { path: "*", element: <ErrorPage /> },
]);

export default router;