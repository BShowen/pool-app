import { useLoaderData, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";

import {
  capitalizeName,
  formatAccountName,
} from "../../../../utils/formatters";
import routes from "../../../routeDefinitions";
import Loading from "../../../../components/Loading";
import {
  CUSTOMER_LIST,
  DELETE_CUSTOMER_ACCOUNT,
  CUSTOMER_ACCOUNT,
} from "../../../../queries/index.js";

export default function CustomerDashboard() {
  const { customerId } = useLoaderData();
  const [deleteAccount, { data: mutationData }] = useMutation(
    DELETE_CUSTOMER_ACCOUNT,
    {
      // ----------------------------------------------------
      // No need to cache the results for deleting an account.
      fetchPolicy: "no-cache",
      // ----------------------------------------------------

      // ----------------------------------------------------
      // Refetch the list of customers to update the Apollo cache.
      // This is easier than manually updating the cache.
      refetchQueries: [{ query: CUSTOMER_LIST }],
      // ----------------------------------------------------
    }
  );
  const { loading, data: queryData } = useQuery(CUSTOMER_ACCOUNT, {
    variables: { id: customerId },
  });
  const navigate = useNavigate();
  const [replace, setReplace] = useState(false);

  // Redirect to customer list page when an account is deleted.
  useEffect(() => {
    if (mutationData?.deleteCustomerAccount === true) {
      navigate(routes.customers);
    }
  }, [mutationData]);

  if (loading) {
    return <Loading />;
  } else {
    const { getCustomerAccount: customerAccount } = queryData;
    return (
      <div className="card bg-base-100 w-full lg:w-3/5 lg:shadow-lg">
        <div className="card-body card-compact flex flex-col lg:flex-row lg:justify-around lg:flex-wrap">
          <div className="card">
            <div className="card-body card-compact">
              <h1 className="card-title">Contacts</h1>
              {customerAccount.accountOwners.map((contact) => {
                return (
                  <div key={contact.id} className="py-2">
                    <p className="font-semibold">
                      {capitalizeName(contact.firstName, contact.lastName)}
                    </p>
                    <p>{contact.emailAddress}</p>
                    <p>{contact.phoneNumber}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card">
            <div className="card-body card-compact">
              <h1 className="card-title">Address</h1>
              <p>{customerAccount.address}</p>
            </div>
          </div>

          <div className="card">
            <div className="card-body card-compact">
              <h1 className="card-title">Service</h1>
              <p>
                <span className="font-semibold">Type:</span>{" "}
                {customerAccount.serviceType}
              </p>
              <p>
                <span className="font-semibold">Frequency:</span>{" "}
                {customerAccount.serviceFrequency}
              </p>
              <p>
                <span className="font-semibold">Day:</span>{" "}
                {customerAccount.serviceDay}
              </p>
              <p>
                <span className="font-semibold">Price:</span>{" "}
                {customerAccount.price}
              </p>
            </div>
          </div>

          <div className="card-actions justify-end w-full">
            <button
              className="btn btn-primary btn-md lg:btn-sm"
              onClick={() => {
                if (!replace) {
                  setReplace(true);
                }
                navigate(
                  routes.getDynamicRoute({
                    route: "editCustomer",
                    id: customerAccount.id,
                  }),
                  { replace }
                );
              }}
            >
              Edit
            </button>
            <button
              className="btn btn-error btn-md lg:btn-sm"
              onClick={async () => {
                const canDelete = confirm(
                  `Delete ${formatAccountName(customerAccount.accountName)}?`
                );
                if (canDelete) {
                  try {
                    await deleteAccount({
                      variables: { id: customerAccount.id },
                    });
                  } catch (error) {
                    console.log("Error deleting customer: ", error.message);
                  }
                }
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }
}
