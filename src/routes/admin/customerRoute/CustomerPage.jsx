import { useLoaderData, Outlet } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";

import { GET_CUSTOMER_ACCOUNT } from "../../../queries/index.js";
import CustomerTopNav from "./customerComponents/CustomerTopNav";
import { formatAccountName } from "../../../utils/formatters";
export async function loader({ params }) {
  // Retrieve and return the id from the url.
  return params;
}
export default function CustomerPage() {
  const [isFullScreen, setFullScreenMode] = useState(false);
  const { customerId } = useLoaderData();
  const { loading, error, data } = useQuery(GET_CUSTOMER_ACCOUNT, {
    variables: {
      accountId: customerId,
    },
  });

  useEffect(() => {
    return () => {
      setFullScreenMode(false);
    };
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  } else if (error) {
    return <p>Error...</p>;
  } else {
    const { customerAccount } = data;
    const pageContainerClassName = isFullScreen
      ? "fixed top-0 left-0 right-0 bottom-0 flex flex-col justify-start z-50 bg-white"
      : "w-full flex flex-col justify-start";
    const pageHeaderClassName = isFullScreen
      ? "hidden"
      : "w-full flex flex-row flex-wrap gap-2 justify-center sticky top-0 z-40 py-2 bg-white landscape:hidden lg:landscape:block";
    return (
      <div className={pageContainerClassName}>
        <div className={pageHeaderClassName}>
          <div className="w-full flex flex-row justify-center">
            <h1 className="text-3xl mx-auto">
              {formatAccountName(customerAccount.accountName)}
            </h1>
          </div>
          <div className="w-full flex flex-row justify-center p-1">
            <CustomerTopNav />
          </div>
        </div>
        {/* Page body */}
        <div className="w-full flex flex-col justify-start items-center pt-5">
          <Outlet
            context={{
              toggleFullScreen: () => {
                setFullScreenMode(!isFullScreen);
              },
              isFullScreen,
            }}
          />
        </div>
      </div>
    );
  }
}
