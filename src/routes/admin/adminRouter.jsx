import routes from "../routeDefinitions";
import Root, { loader as rootLoader } from "./root";

/* -------------------- Customer routes -------------------- */
import CustomersPage from "./customerRoute/CustomersPage";
import NewCustomerPage, {
  action as newCustomerPageAction,
} from "./customerRoute/NewCustomerPage";
import CustomerPage, {
  loader as customerPageLoader,
} from "./customerRoute/CustomerPage";
import CustomerEditPage from "./customerRoute/CustomerEditPage";

/* -------------------- Customer components -------------------- */
import CustomerDashboard from "./customerRoute/customerComponents/CustomerDashboard";
import CustomerList from "./customerRoute/customerComponents/CustomerList";

/* -------------------- Technician routes -------------------- */
import TechniciansPage, {
  loader as techniciansPageLoader,
} from "./technicianRoute/TechniciansPage";
import TechnicianPage, {
  loader as technicianPageLoader,
} from "./technicianRoute/TechnicianPage";
import NewTechnicianPage, {
  action as newTechnicianPageAction,
} from "./technicianRoute/NewTechnicianPage";

import TechnicianEditPage, {
  action as technicianEditPageAction,
} from "./technicianRoute/TechnicianEditPage";

import TechnicianRoutes, {
  loader as technicianRoutesLoader,
} from "./technicianRoute/TechnicianRoutes";

/* -------------------- Technician components -------------------- */
import TechnicianList from "./technicianRoute/technicianComponents/TechnicianList";
import TechnicianDashboard from "./technicianRoute/TechnicianDashBoard";

/* -------------------- Service Days routes -------------------- */
import {
  ServiceDayList,
  loader as serviceDayListLoader,
} from "./serviceDayRoute/serviceDayList";

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
          action: newCustomerPageAction,
        },
        {
          path: routes.customer,
          element: <CustomerPage />,
          loader: customerPageLoader,
          children: [
            {
              index: true,
              element: <CustomerDashboard />,
            },
            {
              path: routes.editCustomer,
              element: <CustomerEditPage />,
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
      id: "technician-root",
      loader: techniciansPageLoader,
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
            },
            {
              path: routes.editTechnician,
              element: <TechnicianEditPage />,
              action: technicianEditPageAction,
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
      action: newTechnicianPageAction,
      errorElement: <ErrorDisplay />,
    },
    {
      path: routes.serviceDays,
      element: <ServiceDayList />,
      loader: serviceDayListLoader,
    },
  ],
};
