import { useLoaderData, Link, useNavigate } from "react-router-dom";
import { getCustomers } from "../../utils/apiFetches";

import { formatAccountName } from "../../utils/formatters";

export async function loader() {
  return await getCustomers();
}

export default function CustomerList() {
  const {
    errors,
    data: { accounts: customerList },
  } = useLoaderData();
  const navigate = useNavigate();
  return (
    <>
      <div className="sticky p-1 lg:p-5 top-0 z-50 bg-white shadow-sm">
        <div className="w-full flex flex-row justify-center">
          <h1 className="text-3xl font-bold">Customers</h1>
        </div>
        <div className="w-full p-5 lg:px-5 flex flex-row justify-end">
          <Link
            as="button"
            to="/customers/new"
            className="btn btn-primary btn-sm lg:btn-md"
          >
            New customer
          </Link>
        </div>
      </div>
      <div className="overflow-x-auto w-full pt-5">
        <div className="p-2">
          <span className="badge badge-primary p-3">
            {customerList.length} customers
          </span>
        </div>
        <table className="table w-full">
          <tbody>
            {customerList.map((customer) => {
              return (
                <tr
                  key={customer._id}
                  className="hover:cursor-pointer"
                  onClick={() => {
                    navigate(`/customers/${customer._id}`);
                  }}
                >
                  <td className="hover:bg-gray-50">
                    {formatAccountName(customer.accountName)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
