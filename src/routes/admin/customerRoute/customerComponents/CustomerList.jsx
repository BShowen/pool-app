import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";

import { formatAccountName, capitalize } from "../../../../utils/formatters";
import routes from "../../../routeDefinitions";
import BannerAlert from "../../../../components/BannerAlert";
import useSorter from "../../../../hooks/useSorter";
import {
  GET_CUSTOMER_TECHNICIAN_LIST,
  UPDATE_ACCOUNT_TECHNICIAN,
  UPDATE_CUSTOMER_ACCOUNT_SERVICE_DAY,
} from "../../../../queries/index";

export default function CustomerList() {
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(GET_CUSTOMER_TECHNICIAN_LIST);
  const { customerAccountList, technicianList } = data;
  const [sortedCustomerAccountList, sortBy] = useSorter(customerAccountList);

  if (loading) {
    return <p>Loading...</p>;
  } else if (error) {
    return <p>Error...</p>;
  } else {
    return (
      <div className="h-full lg:h-screen min-w-full">
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
                <th>Service day</th>
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
                      <ServiceDaySelector customerAccount={customer} />
                    </td>
                    <td className="p-0 m-0 h-full">
                      <TechnicianSelector
                        customerAccount={customer}
                        technicianId={customer?.technician?.id}
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
  const [updateAccountTechnician, { loading, data, error }] = useMutation(
    UPDATE_ACCOUNT_TECHNICIAN,
    { refetchQueries: [{ query: GET_CUSTOMER_TECHNICIAN_LIST }] }
    // {
    //   update(cache, { data }) {
    //     // Update the cached response for GET_SERVICE_ROUTE_GROUPED
    //     // The document that was just updated.
    //     const updatedCustomer = data?.updateCustomerAccount;
    //     const id = updatedCustomer.technicianId;
    //     // The current cache that is stored for the GET_SERVICE_ROUTE_GROUPED query
    //     const cachedQuery = cache.readQuery({
    //       query: GET_SERVICE_ROUTE_GROUPED,
    //       variables: { id: id || technicianId },
    //     });
    //     // If there is a cache, updated it.
    //     // If there isn't a cache then theres nothing to do.
    //     if (cachedQuery) {
    //       if (id == null || id == undefined || id == 0) {
    //         // REMOVE A CUSTOMER ACCOUNT OBJECT IN CACHE
    //         cache.updateQuery(
    //           {
    //             query: GET_SERVICE_ROUTE_GROUPED,
    //             variables: { id: technicianId },
    //           },
    //           (data) => {
    //             // The data that will replace the currently cached data for
    //             // the GET_SERVICE_ROUTE_GROUPED query
    //             const newCache = [];
    //             // Iterate through each serviceRoute and update only the
    //             // modified serviceRoute. All other service routes will be left
    //             // untouched and returned.
    //             data?.getGroupedServiceRoute?.forEach((serviceRoute) => {
    //               if (serviceRoute.serviceDay !== updatedCustomer.serviceDay) {
    //                 // Untouched serviceRoute. Nothing to update.
    //                 newCache.push(serviceRoute);
    //               } else {
    //                 // Update the serviceRoute.customerAccounts list.
    //                 const customerAccounts = [];
    //                 const count = serviceRoute.count - 1;
    //                 const total = serviceRoute.total - updatedCustomer.price;
    //                 // Keep all customerAccounts that aren't going to be modified.
    //                 serviceRoute.customerAccounts.forEach((customerAccount) => {
    //                   if (customerAccount.id !== updatedCustomer.id) {
    //                     customerAccounts.push(customerAccount);
    //                   }
    //                 });
    //                 if (customerAccounts.length === 0) {
    //                   return;
    //                 } else {
    //                   newCache.push({
    //                     serviceDay: updatedCustomer.serviceDay,
    //                     count,
    //                     total,
    //                     customerAccounts,
    //                   });
    //                 }
    //               }
    //             });
    //             // The data to replace the currently cached value.
    //             console.log({ newCache });
    //             return { getGroupedServiceRoute: newCache };
    //           }
    //         );
    //       } else {
    //         // Find the service route within the cache that needs to be updated
    //         const serviceRoute = cachedQuery.getGroupedServiceRoute.find(
    //           (route) => route.serviceDay === updatedCustomer.serviceDay
    //         );
    //         if (serviceRoute) {
    //           // UPDATE A CUSTOMER ACCOUNT OBJECT IN CACHE
    //           // If serviceRoute is true, then we are updating the cache.
    //           cache.updateQuery(
    //             {
    //               query: GET_SERVICE_ROUTE_GROUPED,
    //               variables: { id: id },
    //             },
    //             (data) => {
    //               // The data that will replace teh currently cached data for
    //               // the GET_SERVICE_ROUTE_GROUPED query
    //               const newCache = [];
    //               // Iterate through each serviceRoute and update only the
    //               // modified serviceRoute. All other service routes will be left
    //               // untouched and returned.
    //               data.getGroupedServiceRoute.forEach((serviceRoute) => {
    //                 if (serviceRoute.serviceDay !== updatedCustomer.serviceDay) {
    //                   // Untouched serviceRoute. Nothing to update.
    //                   newCache.push(serviceRoute);
    //                 } else {
    //                   // Update the serviceRoute.customerAccounts list.
    //                   const customerAccounts = [];
    //                   const count = serviceRoute.count + 1;
    //                   const total = serviceRoute.total + updatedCustomer.price;
    //                   // Keep all customerAccounts that aren't going to be modified.
    //                   serviceRoute.customerAccounts.forEach((customerAccount) => {
    //                     if (customerAccount.id !== updatedCustomer.id) {
    //                       customerAccounts.push(customerAccount);
    //                     }
    //                   });
    //                   // Add the modified customer account to the customerAccounts
    //                   // list.
    //                   customerAccounts.push(updatedCustomer);
    //                   newCache.push({
    //                     serviceDay: updatedCustomer.serviceDay,
    //                     count,
    //                     total,
    //                     customerAccounts,
    //                   });
    //                 }
    //               });
    //               // The data to replace the currently cached value.
    //               return { getGroupedServiceRoute: newCache };
    //             }
    //           );
    //         } else {
    //           // CREATE A CUSTOMER ACCOUNT OBJECT IN CACHE
    //           // If serviceRoute is false, then we are creating a new serviceRoute
    //           // in the cache.
    //           // Update the cached value for GET_SERVICE_ROUTE_GROUPED
    //           cache.writeQuery({
    //             query: GET_SERVICE_ROUTE_GROUPED,
    //             variables: { id: updatedCustomer.technicianId },
    //             data: {
    //               getGroupedServiceRoute: [
    //                 ...cachedQuery.getGroupedServiceRoute,
    //                 // New serviceRoute to be inserted into the cache.
    //                 {
    //                   __typename: "ServiceRouteGrouped",
    //                   count: 1,
    //                   total: updatedCustomer.price,
    //                   customerAccounts: [updatedCustomer],
    //                   serviceDay: updatedCustomer.serviceDay,
    //                 },
    //               ],
    //             },
    //           });
    //         }
    //       }
    //     }
    //   },
    // }
  );

  async function handleChange(e) {
    e.preventDefault();
    const variables = {
      input: Object.fromEntries(new FormData(e.target.parentElement)),
    };

    try {
      await updateAccountTechnician({
        variables,
        optimisticResponse: {
          updateCustomerAccount: {
            ...customerAccount,
            technician:
              technicianList.find(
                (tech) => tech.id === variables.input.technician
              ) || null,
            __typename: "CustomerAccount",
          },
        },
      });
    } catch (error) {
      console.log({ error });
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
            className="select focus:outline-none focus:bg-transparent bg-transparent w-min hover:cursor-pointer px-7"
            readOnly
            value={technicianId || 0}
            onChange={handleChange}
            name="technician"
          >
            <option disabled>Technicians</option>
            <option value="0">Unassigned</option>
            {technicianList.map((tech) => (
              <option key={tech.id} value={tech.id}>
                {capitalize(tech.firstName)} {capitalize(tech.lastName[0])}.
              </option>
            ))}
          </select>
        </form>
      </div>
    </>
  );
}

function ServiceDaySelector({ customerAccount, defaultSelection }) {
  const [updateCustomerAccountServiceDay, { loading, error, data }] =
    useMutation(UPDATE_CUSTOMER_ACCOUNT_SERVICE_DAY, {
      refetchQueries: [{ query: GET_CUSTOMER_TECHNICIAN_LIST }],
    });

  async function handleChange(e) {
    e.preventDefault();
    const variables = {
      input: Object.fromEntries(new FormData(e.target.parentElement)),
    };

    try {
      await updateCustomerAccountServiceDay({
        variables,
        optimisticResponse: {
          updateCustomerAccount: {
            ...customerAccount,
            serviceDay: variables.input.serviceDay,
            __typename: "CustomerAccount",
          },
        },
      });
    } catch (error) {
      console.log({ error });
      // setErrorAlert(true);
    }
  }
  return (
    <div
      className="h-full flex flex-col justify-center"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <form method="post">
        <input hidden readOnly name="id" value={customerAccount.id} />
        <select
          className="select focus:outline-none focus:bg-transparent bg-transparent w-min hover:cursor-pointer px-6"
          readOnly
          // value={selection}
          value={customerAccount.serviceDay || "unassigned"}
          onChange={handleChange}
          name="serviceDay"
        >
          <option disabled>Service days</option>
          <option value="unassigned">Unassigned</option>
          <option value="sunday">Sunday</option>
          <option value="monday">Monday</option>
          <option value="tuesday">Tuesday</option>
          <option value="wednesday">Wednesday</option>
          <option value="thursday">Thursday</option>
          <option value="friday">Friday</option>
          <option value="saturday">Saturday</option>
        </select>
      </form>
    </div>
  );
}
