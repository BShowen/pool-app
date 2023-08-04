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
  DELETE_CUSTOMER_ACCOUNT,
  CUSTOMER_ACCOUNT,
  CUSTOMER_TECHNICIAN_LIST,
} from "../../../../queries/index.js";
import ErrorDisplay from "../../../../components/ErrorDisplay";

export default function CustomerDashboard() {
  const { customerId } = useLoaderData();
  const [
    deleteAccount,
    { data: mutationData, error: mutationError, loading: mutationLoading },
  ] = useMutation(DELETE_CUSTOMER_ACCOUNT, {
    update: function (cache, result) {
      // The deleted customer account.
      const deletedCustomerAccount = result.data?.deleteCustomerAccount;

      // Query the cache to get the current cache for the
      // CUSTOMER_TECHNICIAN_LIST query
      const existingCustomers = cache.readQuery({
        query: CUSTOMER_TECHNICIAN_LIST,
      });

      if (!deletedCustomerAccount) {
        // If deletedCustomerAccount is false then no document was deleted
        // which means there was most likely an error. Therefor no need to
        // update the cache.
        return;
      }
      // This section is reached when there was a document deleted from the db.
      // Therefor we need to update the cache.

      // Create the new value that is to be cached for the
      // CUSTOMER_TECHNICIAN_LIST query
      const updatedCustomerAccountList =
        existingCustomers.getCustomerAccountList.filter((customerAccount) => {
          return customerAccount.id !== deletedCustomerAccount.id;
        });

      // Rewrite the cached return value for CUSTOMER_TECHNICIAN_LIST
      cache.writeQuery({
        // This is the query in the cache that we're updating.
        query: CUSTOMER_TECHNICIAN_LIST,
        // This is the new data to be returned from the query.
        data: {
          ...existingCustomers,
          getCustomerAccountList: [...updatedCustomerAccountList],
        },
      });

      // Remove the old document from the cache.
      cache.evict({ id: cache.identify(deletedCustomerAccount) });

      // This removes orphaned documents (AccountOwners) that remain after
      // removing the parent doc (CustomerAccount)
      deletedCustomerAccount.accountOwners.forEach((accountOwnerDoc) => {
        // Remove customerAccount.accountOwners from cache
        cache.evict({ id: cache.identify(accountOwnerDoc) });
      });
    },
  });
  const {
    loading: queryLoading,
    data: queryData,
    error: queryError,
  } = useQuery(CUSTOMER_ACCOUNT, {
    variables: { accountId: customerId },
  });
  const navigate = useNavigate();
  const [replace, setReplace] = useState(false);

  // Redirect to customer list page when an account is deleted.
  useEffect(() => {
    if (mutationData?.deleteCustomerAccount) {
      navigate(routes.customers);
    }
  }, [mutationData]);

  if (queryLoading || mutationLoading) {
    return <Loading />;
  } else if (queryError || mutationError) {
    const errorMessage = queryError?.message || mutationError?.message;
    return <ErrorDisplay message={errorMessage} />;
  } else {
    const { customerAccount } = queryData;
    return (
      // Page container
      <div className="w-full flex flex-col items-center gap-16">
        <div className="card bg-base-100 w-full lg:w-3/5 lg:shadow-lg">
          <div className="card-body card-compact flex flex-col lg:flex-row lg:justify-around lg:flex-wrap">
            <p className="card-title justify-center w-full">
              Account information
            </p>

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
                      route: "editAccount",
                      id: customerAccount.id,
                    }),
                    { replace }
                  );
                }}
              >
                Update
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
                Delete Account
              </button>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 w-full lg:w-3/5 lg:shadow-lg">
          <div className="card-body card-compact flex flex-col lg:flex-row lg:justify-around lg:flex-wrap">
            <p className="card-title justify-center w-full">Account Owners</p>

            <div className="card">
              <div className="card-body card-compact">
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

            <div className="card-actions justify-end w-full">
              <button
                className="btn btn-primary btn-md lg:btn-sm"
                onClick={() => {
                  if (!replace) {
                    setReplace(true);
                  }
                  navigate(
                    routes.getDynamicRoute({
                      route: "editAccountOwner",
                      id: customerAccount.id,
                    }),
                    { replace }
                  );
                }}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
