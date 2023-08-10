import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";

import {
  CREATE_NEW_CUSTOMER,
  CUSTOMER_TECHNICIAN_LIST,
} from "../../../queries/index.js";
import EditAccountForm from "./customerComponents/EditAccountForm";
import routes from "../../routeDefinitions";
import { useEffect } from "react";

async function createNewCustomer(formData, sendMutation) {
  try {
    const variables = { customerAccountInput: formData };
    await sendMutation({ variables });
  } catch (error) {
    // Errors are handled by the component (below).
    // This catch statement is here to silence the browser from logging
    // that there is an uncaught error.
    return false;
  }
}

export default function NewCustomerPage() {
  const navigate = useNavigate();
  const [createCustomer, { data, error, loading }] = useMutation(
    CREATE_NEW_CUSTOMER,
    {
      update(cache, { data }) {
        // The document that was just created.
        const newCustomerFromResponse = data?.createNewCustomerAccount;

        // The current cache that is stored for the CUSTOMER_TECHNICIAN_LIST query
        const existingCustomers = cache.readQuery({
          query: CUSTOMER_TECHNICIAN_LIST,
        });

        // Update the cached value for CUSTOMER_TECHNICIAN_LIST query
        if (existingCustomers && newCustomerFromResponse) {
          cache.writeQuery({
            query: CUSTOMER_TECHNICIAN_LIST,
            data: {
              ...existingCustomers,
              getCustomerAccountList: [
                ...existingCustomers.getCustomerAccountList,
                newCustomerFromResponse,
              ],
            },
          });
        }
      },
    }
  );
  const formErrors = error?.graphQLErrors[0]?.extensions?.fields;

  useEffect(() => {
    if (data) {
      const customerId = data.createNewCustomerAccount.id;
      const route = routes.getDynamicRoute({
        route: "customer",
        id: customerId,
      });
      navigate(route);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  return (
    <EditAccountForm
      errors={formErrors}
      onSubmit={({ formData }) => {
        createNewCustomer(formData, createCustomer);
      }}
    />
  );
}
