import { Link, useLocation } from "react-router-dom";
export default function CustomerTopNav() {
  const location = useLocation();
  const locationList = location.pathname.split("/");
  const page = locationList[locationList.length - 1];
  return (
    <div className="tabs tabs-boxed">
      <Link
        as="a"
        className={`tab ${
          page !== "invoices" && page !== "pool-reports" && "tab-active"
        }`}
        id="customerInfo"
        to=""
        replace
      >
        Customer
      </Link>
      <Link
        as="a"
        className={`tab ${page === "pool-reports" && "tab-active"}`}
        id="poolReports"
        to="pool-reports"
        replace
      >
        Pool reports
      </Link>
      <Link
        as="a"
        className={`tab ${page === "invoices" && "tab-active"}`}
        id="invoices"
        to="invoices"
        replace
      >
        Invoices
      </Link>
    </div>
  );
}
