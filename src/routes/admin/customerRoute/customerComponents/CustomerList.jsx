import {
  Link,
  useAsyncValue,
  useLoaderData,
  useNavigate,
} from "react-router-dom";

import { formatAccountName } from "../../../../utils/formatters";
import { getTechnicians } from "../../../../utils/apiFetches";
import routes from "../../../routeDefinitions";
import TechnicianSelector from "./TechnicianSelector";

export async function loader() {
  const response = await getTechnicians();
  return response.data.technicianList;
}

export default function CustomerList() {
  const technicianList = useLoaderData();
  const navigate = useNavigate();
  const { data, error } = useAsyncValue();
  const customerList = data.accountList || [];

  return (
    <div className="h-full lg:h-screen">
      <div className="sticky p-1 lg:p-5 top-0 z-50 bg-white shadow-sm">
        <div className="w-full flex flex-row justify-center">
          <h1 className="text-3xl font-bold">Customers</h1>
        </div>
        <div className="w-full p-5 lg:px-5 flex flex-row justify-end">
          <Link
            as="button"
            to={routes.newCustomer}
            className="btn btn-primary btn-sm lg:btn-md"
          >
            New customer
          </Link>
        </div>
      </div>

      <div className="w-full pt-5">
        <div className="p-2">
          <span className="badge badge-primary p-3">
            {customerList.length} customers
          </span>
        </div>
        <table className="table w-full h-full">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Technician</th>
            </tr>
          </thead>
          <tbody>
            {customerList.map((customer) => {
              return (
                <tr
                  key={customer._id}
                  className="hover:cursor-pointer hover h-full"
                  onClick={() => {
                    navigate(
                      routes.getDynamicRoute({
                        route: "customer",
                        id: customer._id,
                      })
                    );
                  }}
                >
                  <td>{formatAccountName(customer.accountName)}</td>
                  <td className="p-0 m-0 h-full">
                    <TechnicianSelector
                      customerAccountId={customer._id}
                      technician={customer.technicianId}
                      technicianList={technicianList}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
