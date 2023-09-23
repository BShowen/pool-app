import routes from "../routeDefinitions";
import Root, { loader as rootLoader } from "./root";

/* -------------------- Customer routes -------------------- */
import CustomersPage from "./customerRoute/CustomersPage";
import { NewAccountPage } from "./customerRoute/NewAccountPage";
import CustomerPage, {
  loader as customerPageLoader,
} from "./customerRoute/CustomerPage";
import EditAccountPage from "./customerRoute/EditAccountPage";
import EditAccountOwnerPage from "./customerRoute/EditAccountOwnerPage";

/* -------------------- Customer components -------------------- */
import CustomerDashboard from "./customerRoute/customerComponents/CustomerDashboard";
import CustomerList from "./customerRoute/customerComponents/CustomerList";
import { NewAccountOwnerPage } from "./customerRoute/NewAccountOwnerPage";
import {
  CustomerPoolReportsPage,
  loader as customerPoolReportsLoader,
} from "./customerRoute/customerComponents/CustomerPoolReportsPage";

/* -------------------- Technician routes -------------------- */
import TechniciansPage from "./technicianRoute/TechniciansPage";
import TechnicianPage, {
  loader as technicianPageLoader,
} from "./technicianRoute/TechnicianPage";
import NewTechnicianPage from "./technicianRoute/NewTechnicianPage";

import TechnicianEditPage from "./technicianRoute/TechnicianEditPage";

import TechnicianRoutes, {
  loader as technicianRoutesLoader,
} from "./technicianRoute/TechnicianRoutes";

/* -------------------- Technician components -------------------- */
import TechnicianList from "./technicianRoute/technicianComponents/TechnicianList";
import TechnicianDashboard from "./technicianRoute/TechnicianDashBoard";

/* -------------------- Service Days routes -------------------- */
import { ServiceDayList } from "./serviceDayRoute/serviceDayList";

/* -------------------- Service Days routes -------------------- */
import { AdminDashboard } from "./adminComponents/AdminDashboard";

/* -------------------- Error components -------------------- */
import ErrorDisplay from "../../components/ErrorDisplay";

/* -------------------- Cleaning services routes -------------------- */
import { CleaningServicePage } from "./cleaningServiceRoute/CleaningServicePage";

export default {
  path: routes.adminRoot,
  element: <Root />,
  loader: rootLoader,
  errorElement: <ErrorDisplay />,
  children: [
    {
      element: <AdminDashboard />,
      index: true,
      errorElement: <ErrorDisplay />,
    },
    {
      path: routes.customers,
      element: <CustomersPage />,
      errorElement: <ErrorDisplay />,
      children: [
        {
          index: true,
          element: <CustomerList />,
        },
        {
          path: routes.newCustomer,
          element: <NewAccountPage />,
        },
        {
          path: routes.customer,
          element: <CustomerPage />,
          loader: customerPageLoader,
          children: [
            {
              index: true,
              element: <CustomerDashboard />,
              loader: customerPageLoader,
            },
            {
              path: routes.editAccount,
              element: <EditAccountPage />,
              loader: customerPageLoader,
            },
            {
              path: routes.editAccountOwner,
              element: <EditAccountOwnerPage />,
              loader: customerPageLoader,
            },
            {
              path: routes.newAccountOwner,
              element: <NewAccountOwnerPage />,
              loader: customerPageLoader,
            },
            {
              path: routes.customerPoolReports,
              element: <CustomerPoolReportsPage />,
              loader: customerPoolReportsLoader,
            },
            {
              path: routes.customerInvoices,
              element: <p>Invoices</p>,
            },
          ],
        },
      ],
    },
    {
      path: routes.technicians,
      element: <TechniciansPage />,
      errorElement: <ErrorDisplay />,
      children: [
        {
          index: true,
          element: <TechnicianList />,
        },
        {
          path: routes.technician,
          element: <TechnicianPage />,
          loader: technicianPageLoader,
          children: [
            {
              index: true,
              element: <TechnicianDashboard />,
              loader: technicianPageLoader,
            },
            {
              path: routes.editTechnician,
              element: <TechnicianEditPage />,
              loader: technicianPageLoader,
            },
            {
              path: routes.technicianRoutes,
              element: <TechnicianRoutes />,
              loader: technicianRoutesLoader,
            },
          ],
        },
      ],
    },
    {
      path: routes.cleaningServices,
      element: <CleaningServicePage />,
      errorElement: <ErrorDisplay />,
    },
    {
      path: routes.newTechnician,
      element: <NewTechnicianPage />,
      errorElement: <ErrorDisplay />,
    },
    {
      path: routes.serviceDays,
      element: <ServiceDayList />,
    },
  ],
};
