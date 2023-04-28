import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";
import routes from "./routes/routeDefinitions";
import { loader as logoutLoader } from "./routes/logout";
import Login, {
  action as loginAction,
  loader as loginLoader,
} from "./routes/login";

import RegisterPage, {
  loader as registerPageLoader,
  action as registerPageAction,
} from "./routes/admin/technicianRoute/RegisterPage";

import adminRoutes from "./routes/admin/adminRouter";

import { loader as rootLoader } from "./routes/root";

import ErrorDisplay from "./components/ErrorDisplay";

const router = createBrowserRouter([
  {
    path: routes.root,
    loader: rootLoader,
    errorElement: <ErrorDisplay />,
  },
  { ...adminRoutes },
  {
    path: routes.logout,
    loader: logoutLoader,
  },
  {
    path: routes.login,
    element: <Login />,
    loader: loginLoader,
    action: loginAction,
  },
  {
    path: routes.registerTechnician,
    element: <RegisterPage />,
    loader: registerPageLoader,
    action: registerPageAction,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
