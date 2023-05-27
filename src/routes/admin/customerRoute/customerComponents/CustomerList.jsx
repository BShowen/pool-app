import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";

import { formatAccountName, capitalize } from "../../../../utils/formatters";
import routes from "../../../routeDefinitions";
import BannerAlert from "../../../../components/BannerAlert";
import useSorter from "../../../../hooks/useSorter";
import { CUSTOMER_TECHNICIAN_LIST } from "../../../../queries";
import ErrorDisplay from "../../../../components/ErrorDisplay";
import Loading from "../../../../components/Loading";

export default function CustomerList() {
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(CUSTOMER_TECHNICIAN_LIST);
  const {
    getCustomerAccountList: customerAccountList,
    getTechnicianList: technicianList,
  } = data;
  const [sortedCustomerAccountList, sortBy] = useSorter(customerAccountList);

  if (loading) {
    return <Loading />;
  } else if (error) {
    return <ErrorDisplay message={error.message} />;
  } else {
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
                    onMouseEnter={(e) =>
                      e.target.classList.add("text-blue-500")
                    }
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
}

// export async function action({ request }) {
//   const formData = await request.formData();
//   const response = await updateCustomer(Object.fromEntries(formData));
//   return response;
// }

const UPDATE_CUSTOMER = gql`
  mutation Mutation($customerAccountInput: UpdateCustomerAccountInput) {
    updateCustomerAccount(customerAccountInput: $customerAccountInput) {
      id
      technicianId
    }
  }
`;
function TechnicianSelector({
  customerAccountId,
  technicianId,
  technicianList,
}) {
  const [showErrorAlert, setErrorAlert] = useState(false);
  const [updateCustomer] = useMutation(UPDATE_CUSTOMER);

  async function handleChange(e) {
    e.preventDefault();
    const variables = {
      customerAccountInput: Object.fromEntries(
        new FormData(e.target.parentElement)
      ),
    };
    try {
      await updateCustomer({
        variables,
        optimisticResponse: {
          updateCustomerAccount: {
            ...variables.customerAccountInput,
            __typename: "CustomerAccount",
          },
        },
      });
    } catch (error) {
      setErrorAlert(true);
    }
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
        <form method="post">
          <input hidden readOnly name="id" value={customerAccountId} />
          <select
            className="focus:outline-none focus:bg-transparent bg-transparent w-min hover:cursor-pointer"
            readOnly
            value={technicianId || 0}
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
        </form>
      </div>
    </>
  );
}
