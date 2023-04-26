import { Link, useLocation } from "react-router-dom";
export default function CustomerTopNav() {
  const location = useLocation();
  const locationList = location.pathname.split("/");
  const page = locationList[locationList.length - 1];
  return (
    <div className="tabs tabs-boxed">
      <Link
        as="a"
        className={`tab ${page !== "routes" && "tab-active"}`}
        id="customerInfo"
        to=""
        replace
      >
        Technician
      </Link>
      <Link
        as="a"
        className={`tab ${page === "routes" && "tab-active"}`}
        id="routes"
        to="routes"
        replace
      >
        Routes
      </Link>
    </div>
  );
}
