import { Outlet, Link } from "react-router-dom";

import routes from "../../routeDefinitions";

export default function Sidebar({ isSidebarOpen, toggleSidebar }) {
  return (
    <div className="drawer drawer-mobile bg-white">
      <input
        type="checkbox"
        className="drawer-toggle"
        checked={isSidebarOpen}
        readOnly
      />
      <div className="drawer-content flex flex-col justify-start items-center pb-32 lg:pb-0 bg-white">
        <div className="w-full max-w-screen-2xl">
          <Outlet />
        </div>
      </div>
      <div className="drawer-side bg-slate-50" id="drawer-side">
        <label className="drawer-overlay" onClick={toggleSidebar}></label>
        <ul className="menu p-4 w-80 bg-base-100 text-base-content bg-inherit pb-32 lg:pb-4">
          <li>
            <Link to={routes.customers} onClick={toggleSidebar}>
              Customers
            </Link>
          </li>
          <li className="mb-auto">
            <Link to={routes.technicians} onClick={toggleSidebar}>
              Technicians
            </Link>
          </li>
          <li>
            <Link to="/logout">Logout</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
