const customerRoutes = {
  customers: "/admin/customers",
  newCustomer: "/admin/customers/new",
  customer: "/admin/customers/:customerId",
  editAccount: "/admin/customers/:customerId/editAccount",
  editAccountOwner: "/admin/customers/:customerId/editAccountOwner/:ownerId",
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

const dynamicSegment = /:([a-zA-Z]+)(?=\/|$)/g;

const routes = {
  ...customerRoutes,
  ...technicianRoutes,
  ...serviceDays,
  ...rootRoutes,
  ...adminRoutes,
  getDynamicRoute({ route, id }) {
    let shifter;
    if (!Array.isArray(id)) {
      id = [id];
    }
    shifter = createShifterArray(id);
    return this[route].replaceAll(dynamicSegment, shifter);
  },
};

function createShifterArray(arr) {
  let shiftedArray = [...arr]; // Create a copy of the original array
  return function () {
    if (shiftedArray.length === 0) {
      return undefined; // Return undefined when the array is empty
    }
    return shiftedArray.shift(); // Remove and return the first element of the array
  };
}

export default routes;
