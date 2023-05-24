import {
  Link,
  useNavigate,
  useFetcher,
  useOutletContext,
} from "react-router-dom";
import { useState } from "react";

import { formatAccountName, capitalize } from "../../../../utils/formatters";
import { updateCustomer } from "../../../../utils/apiFetches";
import routes from "../../../routeDefinitions";
import BannerAlert from "../../../../components/BannerAlert";
import useSorter from "../../../../hooks/useSorter";

export async function action({ request }) {
  const formData = await request.formData();
  const response = await updateCustomer(Object.fromEntries(formData));
  return response;
}

export default function CustomerList() {
  const navigate = useNavigate();
  const {
    getCustomerAccountList: customerAccountList,
    getTechnicianList: technicianList,
  } = useOutletContext();

  const [sortedCustomerAccountList, sortBy] = useSorter(customerAccountList);

  return (
    <div className="h-full lg:h-screen">
      <div className="sticky p-1 lg:p-5 top-0 z-40 bg-white shadow-sm">
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
            {sortedCustomerAccountList.length} customers
          </span>
        </div>
        <table className="table w-full h-full">
          <thead>
            <tr>
              <th>
                <span
                  className="rounded-none hover:cursor-pointer"
                  onClick={() => {
                    sortBy({ category: "accountName" });
                  }}
                  onMouseEnter={(e) => e.target.classList.add("text-blue-500")}
                  onMouseLeave={(e) =>
                    e.target.classList.remove("text-blue-500")
                  }
                >
                  Customer
                </span>
              </th>
              <th>Technician</th>
            </tr>
          </thead>
          <tbody>
            {sortedCustomerAccountList.map((customer) => {
              return (
                <tr
                  key={customer.id}
                  className="hover:cursor-pointer hover h-full"
                  onClick={() => {
                    navigate(
                      routes.getDynamicRoute({
                        route: "customer",
                        id: customer.id,
                      })
                    );
                  }}
                >
                  <td>{formatAccountName(customer.accountName)}</td>
                  <td className="p-0 m-0 h-full">
                    <TechnicianSelector
                      customerAccountId={customer.id}
                      technicianId={customer.technicianId}
                      technicianList={technicianList || []}
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

function TechnicianSelector({
  customerAccountId,
  technicianId,
  technicianList,
}) {
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
    technicianId ||
    0;

  let [showErrorAlert, setErrorAlert] = useState(false);

  if (
    fetcher?.data?.status &&
    fetcher.state === "idle" &&
    fetcher.data.status === 400
  ) {
    fetcher.data = undefined; //This is in order to prevent an infinite loop.
    setErrorAlert(true);
  }

  async function handleChange(e) {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.target.parentElement));
    fetcher.submit(formData, {
      method: "post",
    });
  }

  return (
    <>
      {showErrorAlert && (
        <BannerAlert
          message={"Something went wrong"}
          onDismiss={() => {
            setErrorAlert(false);
          }}
        />
      )}
      <div
        className="h-full flex flex-col justify-center"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
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
                <option key={tech.id} value={tech.id}>
                  {capitalize(tech.firstName)} {capitalize(tech.lastName[0])}.
                </option>
              );
            })}
            <option value="0">Unassigned</option>
          </select>
        </fetcher.Form>
      </div>
    </>
  );
}
