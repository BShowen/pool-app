import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";

import Root, { loader as rootLoader } from "./routes/root";
import { loader as logoutLoader } from "./routes/logout";
import Login, {
  action as loginAction,
  loader as loginLoader,
} from "./routes/login";

/* -------------------- Customer routes -------------------- */
import CustomersPage, {
  loader as customersPageLoader,
} from "./routes/customer/CustomersPage";
import NewCustomerPage, {
  action as newCustomerPageAction,
} from "./routes/customer/NewCustomerPage";
import CustomerPage, {
  loader as customerPageLoader,
} from "./routes/customer/CustomerPage";
import CustomerEditPage, {
  action as customerEditPageAction,
} from "./routes/customer/CustomerEditPage";

/* -------------------- Customer components -------------------- */
import CustomerDashboard from "./routes/customer/components/CustomerDashboard";
import CustomerList from "./routes/customer/components/CustomerList";

/* -------------------- Technician routes -------------------- */
import TechniciansPage, {
  loader as techniciansPageLoader,
} from "./routes/technician/TechniciansPage";
import TechnicianPage, {
  loader as technicianPageLoader,
} from "./routes/technician/TechnicianPage";
import NewTechnicianPage, {
  action as newTechnicianPageAction,
} from "./routes/technician/NewTechnicianPage";

import TechnicianEditPage, {
  action as technicianEditPageAction,
} from "./routes/technician/TechnicianEditPage";

/* -------------------- Technician components -------------------- */
import TechnicianList from "./routes/technician/components/TechnicianList";
import TechnicianDashboard from "./routes/technician/TechnicianDashBoard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    loader: rootLoader,
    children: [
      {
        path: "/customers",
        element: <CustomersPage />,
        id: "customer-root",
        loader: customersPageLoader,
        children: [
          {
            index: true,
            element: <CustomerList />,
          },
          {
            path: "/customers/new",
            element: <NewCustomerPage />,
            action: newCustomerPageAction,
          },
          {
            path: "/customers/:customerId",
            element: <CustomerPage />,
            loader: customerPageLoader,
            children: [
              {
                index: true,
                element: <CustomerDashboard />,
              },
              {
                path: "/customers/:customerId/edit",
                element: <CustomerEditPage />,
                action: customerEditPageAction,
              },
              {
                path: "/customers/:customerId/pool-reports",
                element: <p>Pool reports</p>,
              },
              {
                path: "/customers/:customerId/invoices",
                element: <p>Invoices</p>,
              },
            ],
          },
        ],
      },
      {
        path: "/technicians",
        element: <TechniciansPage />,
        id: "technician-root",
        loader: techniciansPageLoader,
        children: [
          {
            index: true,
            element: <TechnicianList />,
          },
          {
            path: "/technicians/new",
            element: <NewTechnicianPage />,
            action: newTechnicianPageAction,
          },
          {
            path: "/technicians/:technicianId",
            element: <TechnicianPage />,
            loader: technicianPageLoader,
            children: [
              {
                index: true,
                element: <TechnicianDashboard />,
              },
              {
                path: "/technicians/:technicianId/edit",
                element: <TechnicianEditPage />,
                action: technicianEditPageAction,
              },
              {
                path: "/technicians/:technicianId/routes",
                element: <p>Routes</p>,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "/logout",
    loader: logoutLoader,
  },
  {
    path: "/login",
    element: <Login />,
    loader: loginLoader,
    action: loginAction,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
