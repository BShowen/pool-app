import { useNavigate, useLoaderData } from "react-router-dom";
import { useEffect } from "react";

import EditAccountForm from "./customerComponents/EditAccountForm";
import routes from "../../routeDefinitions";
import { useMutation, useQuery } from "@apollo/client";

import {
  UPDATE_CUSTOMER,
  GET_CUSTOMER_ACCOUNT,
  GET_SERVICE_ROUTES,
} from "../../../queries/index.js";
import ErrorDisplay from "../../../components/ErrorDisplay";

async function updateCustomer(formData, sendMutation) {
  try {
    // Create an input object to send to the backend.
    const input = Object.fromEntries(formData.entries());
    input.price = Number.parseFloat(input.price);
    // Send the mutation with the variables.
    await sendMutation({ variables: { input } });
  } catch (error) {
    console.log({ error });
    // Errors are handled by CustomerEdit component (below).
    // This catch statement is here to silence the browser from logging
    // that there is an uncaught error.
    return false;
  }
}

export default function EditAccount() {
  const { customerId } = useLoaderData();
  const navigate = useNavigate();
  // Retrieve the customer account in order to prefill the form.
  const { data: queryData, error: queryError } = useQuery(
    GET_CUSTOMER_ACCOUNT,
    {
      variables: { accountId: customerId },
    }
  );
  // The mutation to update the customer account.
  const [
    sendMutation,
    { data: mutationData, loading: mutationLoading, error: mutationError },
  ] = useMutation(UPDATE_CUSTOMER, {
    refetchQueries: [{ query: GET_SERVICE_ROUTES }],
  });

  const formErrors = mutationError?.graphQLErrors[0]?.extensions?.fields;

  useEffect(() => {
    // After submitting the form, redirect to the user account dashboard.
    // data is available when there aren't any errors.
    if (mutationData) {
      navigate(
        routes.getDynamicRoute({
          route: "customer",
          id: mutationData.updateCustomerAccount.id,
        })
      );
    }
  }, [mutationData]);

  if (queryError) {
    return <ErrorDisplay message={queryError.message} />;
  } else {
    const { customerAccount } = queryData;
    return (
      <EditAccountForm
        account={customerAccount}
        errors={formErrors}
        onSubmit={({ formData }) => {
          updateCustomer(formData, sendMutation);
        }}
      />
    );
  }
}
