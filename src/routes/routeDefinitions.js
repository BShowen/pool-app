// prettier-ignore
const cleaningServices = {
  cleaningServices: "/admin/cleaningServices",
};

// prettier-ignore
const customerRoutes = {
  customers:           "/admin/customers",
  newCustomer:         "/admin/customers/new",
  customer:            "/admin/customers/:customerId",
  editAccount:         "/admin/customers/:customerId/editAccount",
  editAccountOwner:    "/admin/customers/:customerId/editAccountOwner/:ownerId",
  newAccountOwner:     "/admin/customers/:customerId/newAccountOwner",
  customerPoolReports: "/admin/customers/:customerId/pool-reports",
  customerPoolReport:  "/admin/customers/:customerId/pool-report/:poolReportId",
  customerInvoices:    "/admin/customers/:customerId/invoices",
};

// prettier-ignore
const technicianRoutes = {
  technicians:        "/admin/technicians",
  technician:         "/admin/technicians/:technicianId",
  editTechnician:     "/admin/technicians/:technicianId/edit",
  technicianRoutes:   "/admin/technicians/:technicianId/routes",
  newTechnician:      "/admin/technicians/new",
  registerTechnician: "/technicians/register",
};

// prettier-ignore
const serviceDays = {
  serviceDays: "/admin/service-days",
};

// prettier-ignore
const rootRoutes = {
  logout: "/logout",
  login:  "/login",
  root:   "/",
};

const adminRoutes = {
  adminRoot: "/admin",
};

const dynamicSegment = /:([a-zA-Z]+)(?=\/|$)/g;

const routes = {
  ...cleaningServices,
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
