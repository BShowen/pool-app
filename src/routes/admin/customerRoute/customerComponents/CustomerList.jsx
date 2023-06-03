import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";

import { formatAccountName, capitalize } from "../../../../utils/formatters";
import routes from "../../../routeDefinitions";
import BannerAlert from "../../../../components/BannerAlert";
import useSorter from "../../../../hooks/useSorter";
import {
  CUSTOMER_TECHNICIAN_LIST,
  UPDATE_CUSTOMER_TECHNICIAN,
  GET_SERVICE_ROUTE_GROUPED,
} from "../../../../queries";
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
                        customerAccount={customer}
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

function TechnicianSelector({ customerAccount, technicianId, technicianList }) {
  const [showErrorAlert, setErrorAlert] = useState(false);
  const [updateCustomer] = useMutation(UPDATE_CUSTOMER_TECHNICIAN, {
    update(cache, { data }) {
      // Update the cached response for GET_SERVICE_ROUTE_GROUPED

      // The document that was just updated.
      const updatedCustomer = data?.updateCustomerAccount;

      // The current cache that is stored for the GET_SERVICE_ROUTE_GROUPED query
      const groupedServiceRoutes = cache.readQuery({
        query: GET_SERVICE_ROUTE_GROUPED,
        variables: { id: updatedCustomer.technicianId },
      });

      // If there is a cache, updated it.
      // If there isn't a cache then theres nothing to do.
      if (groupedServiceRoutes) {
        // The new cache that will be inserted in place of the old cache.
        const newCache = {
          ...groupedServiceRoutes, //Old cache results
        };
        // Find the service route within the cache that needs to be updated
        const serviceRoute = newCache.getGroupedServiceRoute.find((route) => {
          route.serviceDay === updatedCustomer.serviceDay;
        });

        if (serviceRoute) {
          // If serviceRoute is true, then we are updated the cache.
          serviceRoute.customerAccounts.push(updatedCustomer);
        } else {
          // If serviceRoute is false, then we are creating a new serviceRoute
          // in the cache.

          // New serviceRoute to be inserted into the cache.
          const serviceRoute = {
            __typename: "ServiceRouteGrouped",
            count: 1,
            total: updatedCustomer.price,
            customerAccounts: [updatedCustomer],
            serviceDay: updatedCustomer.serviceDay,
          };

          // Insert the new serviceRoute into the cache.
          newCache.getGroupedServiceRoute = [
            ...newCache.getGroupedServiceRoute,
            serviceRoute,
          ];
        }

        // Update the cached value for CUSTOMER_TECHNICIAN_LIST query with the
        // new cache
        cache.writeQuery({
          query: GET_SERVICE_ROUTE_GROUPED,
          variables: { id: updatedCustomer.technicianId },
          data: newCache,
        });
      }
    },
  });

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
            ...customerAccount,
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
          <input hidden readOnly name="id" value={customerAccount.id} />
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
