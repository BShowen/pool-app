import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

import "./index.css";

import Root, { loader as rootLoader } from "./routes/root";
import { loader as logoutLoader } from "./routes/logout";
import Login, {
  action as loginAction,
  loader as loginLoader,
} from "./routes/login";
import Customers from "./routes/customer/customers";
import CustomerList, {
  loader as customerListLoader,
} from "./components/customer/CustomerList";
import NewCustomerForm, {
  action as newCustomerAction,
} from "./routes/customer/customers-new";
import Customer, { loader as customerLoader } from "./routes/customer/customer";
import CustomerDashboard from "./components/customer/CustomerDashboard";
import CustomerEdit, {
  action as customerEditAction,
} from "./routes/customer/customer-edit";

import Technicians from "./routes/technician/Technicians";
import Technician, {
  loader as technicianLoader,
} from "./routes/technician/Technician";
import TechnicianList, {
  loader as technicianListLoader,
} from "./components/technician/TechnicianList";
import TechnicianDashboard from "./components/technician/TechnicianDashBoard";
import NewTechnician, {
  action as newTechnicianAction,
} from "./routes/technician/NewTechnician";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    loader: rootLoader,
    children: [
      {
        path: "/customers",
        element: <Customers />,
        children: [
          {
            index: true,
            element: <CustomerList />,
            loader: customerListLoader,
          },
          {
            path: "/customers/new",
            element: <NewCustomerForm />,
            action: newCustomerAction,
          },
          {
            path: "/customers/:customerId",
            element: <Customer />,
            loader: customerLoader,
            children: [
              {
                index: true,
                element: <CustomerDashboard />,
                loader: customerLoader,
              },
              {
                path: "/customers/:customerId/edit",
                element: <CustomerEdit />,
                action: customerEditAction,
                loader: customerLoader,
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
        element: <Technicians />,
        children: [
          {
            index: true,
            element: <TechnicianList />,
            loader: technicianListLoader,
          },
          {
            path: "/technicians/new",
            element: <NewTechnician />,
            action: newTechnicianAction,
          },
          {
            path: "/technicians/:technicianId",
            element: <Technician />,
            loader: technicianLoader,
            children: [
              {
                index: true,
                element: <TechnicianDashboard />,
                loader: technicianLoader,
              },
              {
                path: "/technicians/:technicianId/routes",
                element: <p>Routes</p>,
              },
              {
                path: "/technicians/:technicianId/edit",
                element: <p>Edit technician</p>,
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
