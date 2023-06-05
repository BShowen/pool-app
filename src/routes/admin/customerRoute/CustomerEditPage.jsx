import { useNavigate, useLoaderData } from "react-router-dom";
import { useEffect } from "react";

import CustomerForm from "./customerComponents/CustomerForm";
import routes from "../../routeDefinitions";
import { useMutation, useQuery } from "@apollo/client";

import {
  UPDATE_CUSTOMER,
  CUSTOMER_ACCOUNT,
  GET_SERVICE_ROUTE_GROUPED,
} from "../../../queries/index.js";
import LoadingOverlay from "../../../components/LoadingOverlay.jsx";
import ErrorDisplay from "../../../components/ErrorDisplay";

async function updateCustomer(formData, sendMutation) {
  try {
    const variables = { customerAccountInput: formData };
    await sendMutation({ variables });
  } catch (error) {
    // Errors are handled by CustomerEdit component (below).
    // This catch statement is here to silence the browser from logging
    // that there is an uncaught error.
    return false;
  }
}

export default function CustomerEdit() {
  const { customerId } = useLoaderData();
  const navigate = useNavigate();
  const {
    loading: queryLoading,
    data: queryData,
    error: queryError,
  } = useQuery(CUSTOMER_ACCOUNT, { variables: { id: customerId } });
  const [
    sendMutation,
    { data: mutationData, loading: mutationLoading, error: mutationError },
  ] = useMutation(UPDATE_CUSTOMER, {
    refetchQueries: () => [
      {
        query: GET_SERVICE_ROUTE_GROUPED,
        variables: { id: queryData.getCustomerAccount.technicianId },
      },
    ],
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
    const { getCustomerAccount: customerAccount } = queryData;
    return (
      <>
        <LoadingOverlay show={mutationLoading} />
        <CustomerForm
          title={"Edit customer"}
          customerAccount={customerAccount}
          errors={formErrors}
          onSubmit={({ formData }) => {
            updateCustomer(formData, sendMutation);
          }}
        />
      </>
    );
  }
}
