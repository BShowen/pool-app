import { useLoaderData, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";

import {
  capitalizeName,
  formatAccountName,
} from "../../../../utils/formatters";
import routes from "../../../routeDefinitions";
import {
  DELETE_CUSTOMER_ACCOUNT,
  CUSTOMER_ACCOUNT,
  CUSTOMER_TECHNICIAN_LIST,
  DELETE_ACCOUNT_OWNER,
} from "../../../../queries/index.js";

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const { customerId } = useLoaderData();
  const { loading, data, error } = useQuery(CUSTOMER_ACCOUNT, {
    variables: { accountId: customerId },
  });

  if (loading) {
    return <p>Loading...</p>;
  } else if (error) {
    return <p>Error...</p>;
  } else {
    const { customerAccount } = data;
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
                  navigate(
                    routes.getDynamicRoute({
                      route: "editAccount",
                      id: customerAccount.id,
                    })
                  );
                }}
              >
                Update
              </button>
              <DeleteCustomerAccountButton customerAccount={customerAccount} />
            </div>
          </div>
        </div>

        <div className="card bg-base-100 w-full lg:w-3/5 lg:shadow-lg">
          <div className="card-body card-compact flex flex-col lg:flex-row lg:justify-around lg:flex-wrap">
            <p className="card-title justify-center w-full">Account Owners</p>
            <div className="w-full flex flex-col gap-2">
              {customerAccount.accountOwners.map((contact) => {
                return (
                  <div
                    key={contact.id}
                    className="p-2 border-2 rounded-lg border-gray-100 w-full flex flex-row justify-between"
                  >
                    <div>
                      <p>
                        <span className="font-semibold">Name: </span>
                        {capitalizeName(contact.firstName, contact.lastName)}
                      </p>
                      <p>
                        <span className="font-semibold">Email: </span>
                        {contact.emailAddress}
                      </p>
                      <p>
                        <span className="font-semibold">Phone: </span>
                        {contact.phoneNumber}
                      </p>
                    </div>
                    <div className="flex gap-1 flex-row justify-between items-center">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          navigate(
                            routes.getDynamicRoute({
                              route: "editAccountOwner",
                              id: [customerAccount.id, contact.id],
                            })
                          );
                        }}
                      >
                        Edit
                      </button>
                      <DeleteCustomerButton customerId={contact.id} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="w-full flex justify-end">
              <button
                className="btn btn-primary btn-md lg:btn-sm"
                onClick={() => {
                  navigate(
                    routes.getDynamicRoute({
                      route: "newAccountOwner",
                      id: customerAccount.id,
                    })
                  );
                }}
              >
                Add account owner
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function DeleteCustomerAccountButton({ customerAccount }) {
  const navigate = useNavigate();
  const [deleteAccount, { data, error, loading }] = useMutation(
    DELETE_CUSTOMER_ACCOUNT,
    {
      refetchQueries: [{ query: CUSTOMER_TECHNICIAN_LIST }],
      // update: function (cache, result) {
      //   // The deleted customer account.
      //   const deletedCustomerAccount = result.data?.deleteCustomerAccount;
      //   // Query the cache to get the current cache for the
      //   // CUSTOMER_TECHNICIAN_LIST query
      //   const existingCustomers = cache.readQuery({
      //     query: CUSTOMER_TECHNICIAN_LIST,
      //   });
      //   if (!deletedCustomerAccount) {
      //     // If deletedCustomerAccount is false then no document was deleted
      //     // which means there was most likely an error. Therefor no need to
      //     // update the cache.
      //     return;
      //   }
      //   // This section is reached when there was a document deleted from the db.
      //   // Therefor we need to update the cache.
      //   // Create the new value that is to be cached for the
      //   // CUSTOMER_TECHNICIAN_LIST query
      //   const updatedCustomerAccountList =
      //     existingCustomers.getCustomerAccountList.filter((customerAccount) => {
      //       return customerAccount.id !== deletedCustomerAccount.id;
      //     });
      //   // Rewrite the cached return value for CUSTOMER_TECHNICIAN_LIST
      //   cache.writeQuery({
      //     // This is the query in the cache that we're updating.
      //     query: CUSTOMER_TECHNICIAN_LIST,
      //     // This is the new data to be returned from the query.
      //     data: {
      //       ...existingCustomers,
      //       getCustomerAccountList: [...updatedCustomerAccountList],
      //     },
      //   });
      //   // Remove the old document from the cache.
      //   cache.evict({ id: cache.identify(deletedCustomerAccount) });
      //   // This removes orphaned documents (AccountOwners) that remain after
      //   // removing the parent doc (CustomerAccount)
      //   deletedCustomerAccount.accountOwners.forEach((accountOwnerDoc) => {
      //     // Remove customerAccount.accountOwners from cache
      //     cache.evict({ id: cache.identify(accountOwnerDoc) });
      //   });
      // },
    }
  );

  // Redirect to customer list page when an account is deleted.
  useEffect(() => {
    if (data?.deleteCustomerAccount) {
      navigate(routes.customers);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error...</p>;

  return (
    <button
      className="btn btn-error btn-md lg:btn-sm"
      onClick={async () => {
        const canDelete = confirm(
          `Delete ${formatAccountName(customerAccount.accountName)}?`
        );
        if (canDelete) {
          try {
            await deleteAccount({
              variables: { accountId: customerAccount.id },
            });
          } catch (error) {
            console.log("Error deleting customer: ", error, error.message);
          }
        }
      }}
    >
      Delete Account
    </button>
  );
}

function DeleteCustomerButton({ customerId }) {
  const [deleteAccountOwner, { data, loading, error }] = useMutation(
    DELETE_ACCOUNT_OWNER,
    { refetchQueries: [{ query: CUSTOMER_TECHNICIAN_LIST }] }
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error...</p>;
  return (
    <button
      className="btn btn-error btn-sm"
      onClick={async () => {
        try {
          await deleteAccountOwner({ variables: { customerId } });
        } catch (error) {
          console.log(error);
        }
      }}
    >
      Delete
    </button>
  );
}
