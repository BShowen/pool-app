import { useLoaderData } from "react-router-dom";
import { Disclosure, Transition } from "@headlessui/react";
import { BsArrowsExpand, BsArrowsCollapse } from "react-icons/bs";

import { getAllServiceRoutes } from "../../../utils/apiFetches";
import { capitalize, formatAccountName } from "../../../utils/formatters";
import routes from "../../routeDefinitions";

export async function loader() {
  const response = await getAllServiceRoutes();
  return response;
}

export function ServiceDayList() {
  const { data, errors, status } = useLoaderData();
  console.log(data);
  if (errors) {
    // Handle error.
  }

  return (
    <div className="h-full lg:h-screen">
      <div className="sticky p-1 lg:p-5 top-0 z-40 bg-white shadow-sm">
        <div className="w-full flex flex-row justify-center">
          <h1 className="text-3xl font-bold">Service days</h1>
        </div>
      </div>

      <div className="w-full pt-16  lg:px-5">
        <div className="mx-auto w-3/4 rounded-2xl bg-white p-3 border-2 gap-5 flex flex-col shadow-sm">
          {data.routes.map((route) => {
            const customerAccounts = route.customers;
            const technician =
              Object.entries(route.technician).length > 0
                ? route.technician
                : { _id: 0, firstName: "Unassigned" };

            return (
              <Disclosure as="div" key={technician._id} defaultOpen={false}>
                {({ open }) => (
                  <>
                    <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                      <div className="flex flex-row gap-2">
                        <span className="w-24">
                          {capitalize(technician.firstName)}
                        </span>
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
                        <table className="table w-full border-separate border-2 border-t-0 rounded-b-2xl">
                          <tbody>
                            {customerAccounts.map((customer) => {
                              return (
                                <tr
                                  draggable
                                  key={customer._id}
                                  className="hover:cursor-pointer"
                                  onClick={() => {
                                    navigate(
                                      routes.getDynamicRoute({
                                        route: "customer",
                                        id: customer._id,
                                      })
                                    );
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
                      </Disclosure.Panel>
                    </Transition>
                  </>
                )}
              </Disclosure>
            );
          })}
        </div>
      </div>
    </div>
  );
}
