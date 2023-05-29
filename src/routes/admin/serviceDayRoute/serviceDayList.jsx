import { useNavigate } from "react-router-dom";
import { Disclosure, Transition } from "@headlessui/react";
import { BsArrowsExpand, BsArrowsCollapse } from "react-icons/bs";
import { useQuery } from "@apollo/client";

import { GET_ROUTE_LIST } from "../../../queries/index.js";
import Loading from "../../../components/Loading.jsx";
import ErrorDisplay from "../../../components/ErrorDisplay.jsx";
import useSorter from "../../../hooks/useSorter";
import { capitalize, formatAccountName } from "../../../utils/formatters";
import routes from "../../routeDefinitions";

export function ServiceDayList() {
  const { loading, data, error } = useQuery(GET_ROUTE_LIST, {
    fetchPolicy: "network-only",
  });

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorDisplay message={error.message} />;
  }

  const { getServiceRouteList: serviceRouteList } = data;

  return (
    <div className="h-full lg:h-screen">
      <div className="sticky p-1 lg:p-5 top-0 z-40 bg-white shadow-sm">
        <div className="w-full flex flex-row justify-center">
          <h1 className="text-3xl font-bold">Service days</h1>
        </div>
      </div>

      <div className="w-full pt-16  lg:px-5">
        <div className="mx-auto w-3/4 rounded-2xl bg-white p-3 border-2 gap-5 flex flex-col shadow-sm">
          {serviceRouteList.map((route) => (
            <TechnicianDisclosure
              key={route.technician.id || 0}
              route={route}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function TechnicianDisclosure({ route }) {
  const navigate = useNavigate();
  const [customerAccounts, sortBy] = useSorter(route.customers);
  const { technician } = route;
  return (
    <Disclosure as="div" defaultOpen={false}>
      {({ open }) => (
        <>
          <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
            <div className="flex flex-row gap-2">
              <span className="w-24">{capitalize(technician.firstName)}</span>
              <span className="badge badge-accent">
                {route.count || 0} Customers
              </span>
            </div>
            {open ? (
              <BsArrowsCollapse className="text-xl" />
            ) : (
              <BsArrowsExpand className="text-xl" />
            )}
          </Disclosure.Button>
          <Transition
            enter="transition duration-200 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Disclosure.Panel className="px-2 text-sm text-gray-500">
              <table className="table w-full border-separate border-spacing-0 border-2 border-t-0 rounded-b-2xl overflow-hidden">
                <thead>
                  <tr>
                    <th className="rounded-none">
                      <span
                        className="hover:cursor-pointer"
                        onClick={() => sortBy({ category: "accountName" })}
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
                    <th className="rounded-none">
                      <span
                        className="hover:cursor-pointer"
                        onClick={() => sortBy({ category: "serviceDay" })}
                        onMouseEnter={(e) =>
                          e.target.classList.add("text-blue-500")
                        }
                        onMouseLeave={(e) =>
                          e.target.classList.remove("text-blue-500")
                        }
                      >
                        Service Day
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {customerAccounts.map((customer) => {
                    return (
                      <tr
                        draggable
                        key={customer.id}
                        className="hover:cursor-pointer hover"
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
                        <td>{capitalize(customer.serviceDay)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
}
