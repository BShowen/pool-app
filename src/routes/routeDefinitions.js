const customerRoutes = {
  customers: "/customers",
  newCustomer: "/customers/new",
  customer: "/customers/:customerId",
  editCustomer: "/customers/:customerId/edit",
  customerPoolReports: "/customers/:customerId/pool-reports",
  customerInvoices: "/customers/:customerId/invoices",
};

const technicianRoutes = {
  technicians: "/technicians",
  technician: "/technicians/:technicianId",
  editTechnician: "/technicians/:technicianId/edit",
  technicianRoutes: "/technicians/:technicianId/routes",
  newTechnician: "/technicians/new",
  registerTechnician: "/technicians/register",
};

const rootRoutes = {
  logout: "/logout",
  login: "/login",
  root: "/",
};

const dynamicSegment = /:([a-zA-Z]+)(?=\/|$)/;

const routes = {
  ...customerRoutes,
  ...technicianRoutes,
  ...rootRoutes,
  getDynamicRoute({ route, id }) {
    return this[route].replace(dynamicSegment, id);
  },
};

export default routes;
