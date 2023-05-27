import { useNavigate, useLoaderData } from "react-router-dom";
import { useEffect } from "react";

import CustomerForm from "./customerComponents/CustomerForm";
import LoadingOverlay from "../../../components/LoadingOverlay";
import routes from "../../routeDefinitions";
import { useMutation, useQuery } from "@apollo/client";

import { UPDATE_CUSTOMER, CUSTOMER_ACCOUNT } from "../../../queries/index.js";
import Loading from "../../../components/Loading";

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
  const [sendMutation, { data: mutationData, loading, error }] =
    useMutation(UPDATE_CUSTOMER);
  const { loading: queryLoading, data: queryData } = useQuery(
    CUSTOMER_ACCOUNT,
    { variables: { id: customerId } }
  );
  const formErrors =
    error?.message === "MONGOOSE_VALIDATION_ERROR"
      ? error?.graphQLErrors[0]?.extensions?.fields
      : {};

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

  if (queryLoading) {
    return <Loading />;
  } else {
    const { getCustomerAccount: customerAccount } = queryData;
    return (
      <>
        <LoadingOverlay show={loading} />
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
