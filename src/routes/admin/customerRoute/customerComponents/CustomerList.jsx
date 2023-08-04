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
} from "../../../../queries";
import ErrorDisplay from "../../../../components/ErrorDisplay";
import Loading from "../../../../components/Loading";

export default function CustomerList() {
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(CUSTOMER_TECHNICIAN_LIST);
  const { customerAccountList, technicianList } = data;
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
    // update(cache, { data }) {
    //   // Update the cached response for GET_SERVICE_ROUTE_GROUPED
    //   // The document that was just updated.
    //   const updatedCustomer = data?.updateCustomerAccount;
    //   const id = updatedCustomer.technicianId;
    //   // The current cache that is stored for the GET_SERVICE_ROUTE_GROUPED query
    //   const cachedQuery = cache.readQuery({
    //     query: GET_SERVICE_ROUTE_GROUPED,
    //     variables: { id: id || technicianId },
    //   });
    //   // If there is a cache, updated it.
    //   // If there isn't a cache then theres nothing to do.
    //   if (cachedQuery) {
    //     if (id == null || id == undefined || id == 0) {
    //       // REMOVE A CUSTOMER ACCOUNT OBJECT IN CACHE
    //       cache.updateQuery(
    //         {
    //           query: GET_SERVICE_ROUTE_GROUPED,
    //           variables: { id: technicianId },
    //         },
    //         (data) => {
    //           // The data that will replace the currently cached data for
    //           // the GET_SERVICE_ROUTE_GROUPED query
    //           const newCache = [];
    //           // Iterate through each serviceRoute and update only the
    //           // modified serviceRoute. All other service routes will be left
    //           // untouched and returned.
    //           data?.getGroupedServiceRoute?.forEach((serviceRoute) => {
    //             if (serviceRoute.serviceDay !== updatedCustomer.serviceDay) {
    //               // Untouched serviceRoute. Nothing to update.
    //               newCache.push(serviceRoute);
    //             } else {
    //               // Update the serviceRoute.customerAccounts list.
    //               const customerAccounts = [];
    //               const count = serviceRoute.count - 1;
    //               const total = serviceRoute.total - updatedCustomer.price;
    //               // Keep all customerAccounts that aren't going to be modified.
    //               serviceRoute.customerAccounts.forEach((customerAccount) => {
    //                 if (customerAccount.id !== updatedCustomer.id) {
    //                   customerAccounts.push(customerAccount);
    //                 }
    //               });
    //               if (customerAccounts.length === 0) {
    //                 return;
    //               } else {
    //                 newCache.push({
    //                   serviceDay: updatedCustomer.serviceDay,
    //                   count,
    //                   total,
    //                   customerAccounts,
    //                 });
    //               }
    //             }
    //           });
    //           // The data to replace the currently cached value.
    //           console.log({ newCache });
    //           return { getGroupedServiceRoute: newCache };
    //         }
    //       );
    //     } else {
    //       // Find the service route within the cache that needs to be updated
    //       const serviceRoute = cachedQuery.getGroupedServiceRoute.find(
    //         (route) => route.serviceDay === updatedCustomer.serviceDay
    //       );
    //       if (serviceRoute) {
    //         // UPDATE A CUSTOMER ACCOUNT OBJECT IN CACHE
    //         // If serviceRoute is true, then we are updating the cache.
    //         cache.updateQuery(
    //           {
    //             query: GET_SERVICE_ROUTE_GROUPED,
    //             variables: { id: id },
    //           },
    //           (data) => {
    //             // The data that will replace teh currently cached data for
    //             // the GET_SERVICE_ROUTE_GROUPED query
    //             const newCache = [];
    //             // Iterate through each serviceRoute and update only the
    //             // modified serviceRoute. All other service routes will be left
    //             // untouched and returned.
    //             data.getGroupedServiceRoute.forEach((serviceRoute) => {
    //               if (serviceRoute.serviceDay !== updatedCustomer.serviceDay) {
    //                 // Untouched serviceRoute. Nothing to update.
    //                 newCache.push(serviceRoute);
    //               } else {
    //                 // Update the serviceRoute.customerAccounts list.
    //                 const customerAccounts = [];
    //                 const count = serviceRoute.count + 1;
    //                 const total = serviceRoute.total + updatedCustomer.price;
    //                 // Keep all customerAccounts that aren't going to be modified.
    //                 serviceRoute.customerAccounts.forEach((customerAccount) => {
    //                   if (customerAccount.id !== updatedCustomer.id) {
    //                     customerAccounts.push(customerAccount);
    //                   }
    //                 });
    //                 // Add the modified customer account to the customerAccounts
    //                 // list.
    //                 customerAccounts.push(updatedCustomer);
    //                 newCache.push({
    //                   serviceDay: updatedCustomer.serviceDay,
    //                   count,
    //                   total,
    //                   customerAccounts,
    //                 });
    //               }
    //             });
    //             // The data to replace the currently cached value.
    //             return { getGroupedServiceRoute: newCache };
    //           }
    //         );
    //       } else {
    //         // CREATE A CUSTOMER ACCOUNT OBJECT IN CACHE
    //         // If serviceRoute is false, then we are creating a new serviceRoute
    //         // in the cache.
    //         // Update the cached value for GET_SERVICE_ROUTE_GROUPED
    //         cache.writeQuery({
    //           query: GET_SERVICE_ROUTE_GROUPED,
    //           variables: { id: updatedCustomer.technicianId },
    //           data: {
    //             getGroupedServiceRoute: [
    //               ...cachedQuery.getGroupedServiceRoute,
    //               // New serviceRoute to be inserted into the cache.
    //               {
    //                 __typename: "ServiceRouteGrouped",
    //                 count: 1,
    //                 total: updatedCustomer.price,
    //                 customerAccounts: [updatedCustomer],
    //                 serviceDay: updatedCustomer.serviceDay,
    //               },
    //             ],
    //           },
    //         });
    //       }
    //     }
    //   }
    // },
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
