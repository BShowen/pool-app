import { Disclosure, Transition } from "@headlessui/react";
import { BsArrowsExpand, BsArrowsCollapse } from "react-icons/bs";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";

import { formatAccountName, capitalize } from "../../../utils/formatters";
import Loading from "../../../components/Loading";
import ErrorDisplay from "../../../components/ErrorDisplay";
import routes from "../../routeDefinitions";
import { GET_SERVICE_ROUTE_GROUPED } from "../../../queries/index.js";

export function loader({ params }) {
  return { technicianId: params.technicianId };
}

export default function TechnicianRoutes() {
  const { technicianId } = useLoaderData();
  const { loading, error, data } = useQuery(GET_SERVICE_ROUTE_GROUPED, {
    variables: {
      id: technicianId,
    },
  });
  const navigate = useNavigate();
  const defaultOpen = false;

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorDisplay message={error.message} />;
  }

  const customerList = sortByWeekday(data.getGroupedServiceRoute);

  return (
    <div className="w-full pt-16  lg:px-5">
      <div className="mx-auto w-3/4 rounded-2xl bg-white p-3 border-2 gap-5 flex flex-col shadow-sm">
        {customerList.map((serviceDay) => {
          const customerAccounts = serviceDay.customerAccounts;

          return (
            <Disclosure
              as="div"
              key={serviceDay.serviceDay}
              defaultOpen={defaultOpen}
            >
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                    <div className="flex flex-row gap-2">
                      <span className="w-24">
                        {capitalize(serviceDay.serviceDay)}
                      </span>
                      <span className="badge badge-accent">
                        {serviceDay.count}
                      </span>
                    </div>
                    {open ? (
                      <BsArrowsCollapse className="text-xl" />
                    ) : (
                      <BsArrowsExpand className="text-xl" />
                    )}
                  </Disclosure.Button>
                  <Transition
                    // enter="h-0 duration-500 ease-out"
                    // enterFrom="h-0"
                    // enterTo="h-32"
                    // leave="h-0 duration-500 ease-out"
                    // leaveFrom="h-32"
                    // leaveTo="h-0"
                    // className="overflow-hidden"
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
                                key={customer.id}
                                className="hover:cursor-pointer"
                                onClick={() => {
                                  navigate(
                                    routes.getDynamicRoute({
                                      route: "customer",
                                      id: customer.id,
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
  );
}

/**
 * Return a new copy of the passed in array, sorted by weekday.
 */
function sortByWeekday(arr) {
  const dayOrder = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  return [...arr].sort((a, b) => {
    const aIndex = dayOrder.indexOf(a.serviceDay);
    const bIndex = dayOrder.indexOf(b.serviceDay);
    return aIndex - bIndex;
  });
}
