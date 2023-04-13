import { useLoaderData, Outlet } from "react-router-dom";

import CustomerTopNav from "../../components/customer/CustomerTopNav";

import { formatAccountName } from "../../utils/formatters";
import { getCustomer } from "../../utils/apiFetches";

export async function loader({ params }) {
  const response = await getCustomer({ customerId: params.customerId });
  return response.data.customer;
}
export default function Customer() {
  const customerAccount = useLoaderData();

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
