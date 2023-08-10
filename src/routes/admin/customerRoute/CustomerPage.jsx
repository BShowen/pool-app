import { useLoaderData, Outlet } from "react-router-dom";
import { useQuery } from "@apollo/client";

import { CUSTOMER_ACCOUNT } from "../../../queries/index.js";
import CustomerTopNav from "./customerComponents/CustomerTopNav";
import { formatAccountName } from "../../../utils/formatters";
export async function loader({ params }) {
  // Retrieve and return the id from the url.
  return params;
}
export default function CustomerPage() {
  const { customerId } = useLoaderData();
  const { loading, error, data } = useQuery(CUSTOMER_ACCOUNT, {
    variables: {
      accountId: customerId,
    },
  });

  if (loading) {
    return <p>Loading...</p>;
  } else if (error) {
    return <p>Error...</p>;
  } else {
    const { customerAccount } = data;
    return (
      <div className="w-full flex flex-col flex-wrap justify-start">
        {/* Page container */}

        {/* Page header */}
        <div className="w-full flex flex-col gap-5 justify-center items-center sticky top-0 bg-white z-50 p-5">
          <div>
            <h1 className="text-3xl mx-auto">
              {formatAccountName(customerAccount.accountName)}
            </h1>
          </div>
          <div className="w-full flex flex-row justify-center p-1">
            <CustomerTopNav />
          </div>
        </div>

        {/* Page body */}
        <div className="w-full flex flex-col justify-start items-center pt-5">
          <Outlet />
        </div>
      </div>
    );
  }
}
