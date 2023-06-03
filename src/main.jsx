import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";

import client from "./apolloServer";
import "./index.css";
import routes from "./routes/routeDefinitions";
import { loader as logoutLoader } from "./routes/logout";
import Login, { loader as loginLoader } from "./routes/login";

import RegisterPage, {
  loader as registerPageLoader,
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
  },
  {
    path: routes.registerTechnician,
    element: <RegisterPage />,
    loader: registerPageLoader,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <RouterProvider router={router} />
    </ApolloProvider>
  </React.StrictMode>
);
