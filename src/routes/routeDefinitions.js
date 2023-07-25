const customerRoutes = {
  customers: "/admin/customers",
  newCustomer: "/admin/customers/new",
  customer: "/admin/customers/:customerId",
  editAccount: "/admin/customers/:customerId/editAccount",
  editAccountOwner: "/admin/customers/:customerId/editAccountOwner",
  customerPoolReports: "/admin/customers/:customerId/pool-reports",
  customerInvoices: "/admin/customers/:customerId/invoices",
};

const technicianRoutes = {
  technicians: "/admin/technicians",
  technician: "/admin/technicians/:technicianId",
  editTechnician: "/admin/technicians/:technicianId/edit",
  technicianRoutes: "/admin/technicians/:technicianId/routes",
  newTechnician: "/admin/technicians/new",
  registerTechnician: "/technicians/register",
};

const serviceDays = {
  serviceDays: "/admin/service-days",
};

const rootRoutes = {
  logout: "/logout",
  login: "/login",
  root: "/",
};

const adminRoutes = {
  adminRoot: "/admin",
};

const dynamicSegment = /:([a-zA-Z]+)(?=\/|$)/;

const routes = {
  ...customerRoutes,
  ...technicianRoutes,
  ...serviceDays,
  ...rootRoutes,
  ...adminRoutes,
  getDynamicRoute({ route, id }) {
    return this[route].replace(dynamicSegment, id);
  },
};

export default routes;
