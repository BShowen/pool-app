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
      <div className="drawer-content flex flex-col justify-start items-center pb-32 lg:pb-0">
        <div className="w-full max-w-screen-2xl">
          <Outlet />
        </div>
      </div>
      <div className="drawer-side z-40">
        <label className="drawer-overlay" onClick={toggleSidebar}></label>
        <ul className="min-h-full menu menu-lg p-4 w-80 bg-base-200 pb-32 lg:pb-4">
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
          <li className="mt-auto">
            <Link to="/logout">Logout</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
