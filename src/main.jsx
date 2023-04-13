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
import Customers from "./routes/customers";
import CustomerList, {
  loader as customerListLoader,
} from "./components/CustomerList";
import NewCustomerForm, {
  action as newCustomerAction,
} from "./routes/customers-new";
import Customer, { loader as customerLoader } from "./routes/customer";
import CustomerDashboard from "./components/CustomerDashboard";
import CustomerEdit, {
  action as customerEditAction,
} from "./routes/customer-edit";

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
        element: <p>Technicians page</p>,
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
  // <React.StrictMode>
  <RouterProvider router={router} />
  // </React.StrictMode>
);
