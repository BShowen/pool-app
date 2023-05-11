import {
  Link,
  useAsyncValue,
  useLoaderData,
  useNavigate,
  useFetcher,
} from "react-router-dom";

import { formatAccountName } from "../../../../utils/formatters";
import { getTechnicians, updateCustomer } from "../../../../utils/apiFetches";
import routes from "../../../routeDefinitions";

export async function loader() {
  const response = await getTechnicians();
  return response.data.technicianList;
}

export async function action({ request }) {
  const formData = await request.formData();
  const response = await updateCustomer(Object.fromEntries(formData));
  return response;
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

function TechnicianSelector({ customerAccountId, technician, technicianList }) {
  const fetcher = useFetcher();

  /**
   * fetcher.formData is available when the form is submitting. Use that value
   * first to take advantage of optimistic UI. fetcher.data is what is the
   * finalized value returned from the backend server. fetcher.formData is not
   * available once fetcher.data is available. Use fetcher.data (finalized value)
   * once the request has completed. If either of these isn't available then
   * the user hasn't submitted a form and/or this is the initial render and we
   * use the value passed in from props.
   */
  const selectionValue =
    fetcher?.formData?.get("technicianId") ||
    fetcher?.data?.technicianId ||
    technician?._id ||
    0;

  function handleClick(e) {
    e.stopPropagation();
  }

  async function handleChange(e) {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.target.parentElement));
    fetcher.submit(formData, {
      method: "post",
    });
  }

  return (
    <div className="h-full flex flex-col justify-center" onClick={handleClick}>
      <fetcher.Form method="post">
        <input
          hidden
          readOnly
          name="customerAccountId"
          value={customerAccountId}
        />
        <select
          className="focus:outline-none focus:bg-transparent bg-transparent w-min hover:cursor-pointer"
          readOnly
          value={selectionValue}
          onChange={handleChange}
          name="technicianId"
        >
          <option disabled>Technicians</option>
          {technicianList.map((tech) => {
            return (
              <option key={tech._id} value={tech._id}>
                {tech.firstName}
              </option>
            );
          })}
          <option value="0">Unassigned</option>
        </select>
      </fetcher.Form>
    </div>
  );
}
