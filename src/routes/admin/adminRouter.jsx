import routes from "../routeDefinitions";
import Root, { loader as rootLoader } from "./root";

/* -------------------- Customer routes -------------------- */
import CustomersPage from "./customerRoute/CustomersPage";
import NewCustomerPage from "./customerRoute/NewCustomerPage";
import CustomerPage, {
  loader as customerPageLoader,
} from "./customerRoute/CustomerPage";
import CustomerEditPage from "./customerRoute/CustomerEditPage";

/* -------------------- Customer components -------------------- */
import CustomerDashboard from "./customerRoute/customerComponents/CustomerDashboard";
import CustomerList from "./customerRoute/customerComponents/CustomerList";

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

/* -------------------- Error components -------------------- */
import ErrorDisplay from "../../components/ErrorDisplay";

export default {
  path: routes.adminRoot,
  element: <Root />,
  loader: rootLoader,
  errorElement: <ErrorDisplay />,
  children: [
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
          element: <NewCustomerPage />,
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
              path: routes.editCustomer,
              element: <CustomerEditPage />,
              loader: customerPageLoader,
            },
            {
              path: routes.customerPoolReports,
              element: <p>Pool reports</p>,
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
