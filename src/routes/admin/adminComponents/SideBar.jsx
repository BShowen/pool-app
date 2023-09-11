import { Outlet, Link } from "react-router-dom";

import routes from "../../routeDefinitions";

export default function Sidebar({ isSidebarOpen, toggleSidebar }) {
  return (
    <div className="drawer lg:drawer-open">
      <input
        type="checkbox"
        className="drawer-toggle"
        checked={isSidebarOpen}
        readOnly
      />
      <div className="drawer-content flex flex-col justify-start items-center mb-20 lg:mb-0 max-w-full min-w-full w-full">
        <Outlet />
      </div>
      <div className="drawer-side z-40">
        <label className="drawer-overlay" onClick={toggleSidebar}></label>
        <ul className="min-h-full menu menu-lg p-4 w-80 bg-base-200 pb-14 lg:pb-4 flex flex-col gap-1">
          <li>
            <Link to={routes.adminRoot} onClick={toggleSidebar}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to={routes.customers} onClick={toggleSidebar}>
              Customers
            </Link>
          </li>
          <li>
            <Link to={routes.technicians} onClick={toggleSidebar}>
              Technicians
            </Link>
          </li>
          <li>
            <Link to={routes.serviceDays} onClick={toggleSidebar}>
              Service Days
            </Link>
          </li>
          <li>
            <details>
              <summary>Products & Services</summary>
              <ul className="flex flex-col gap-1 my-1">
                <li>
                  <Link
                    to={routes.cleaningServices}
                    onClick={toggleSidebar}
                    className="text-sm"
                  >
                    Cleaning services
                  </Link>
                </li>
                <li className="">
                  <Link to={"#"} onClick={toggleSidebar} className="text-sm">
                    Repair services
                  </Link>
                </li>
              </ul>
            </details>
          </li>
          <li className="mt-auto">
            <Link to="/logout">Logout</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
