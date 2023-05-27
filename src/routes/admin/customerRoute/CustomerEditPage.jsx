import { useNavigate, useOutletContext } from "react-router-dom";
import { useEffect } from "react";

import CustomerForm from "./customerComponents/CustomerForm";
import LoadingOverlay from "../../../components/LoadingOverlay";
import routes from "../../routeDefinitions";
import { gql, useMutation } from "@apollo/client";

const UPDATE_CUSTOMER_MUTATION = gql`
  mutation UpdateCustomerAccount(
    $customerAccountInput: UpdateCustomerAccountInput
  ) {
    updateCustomerAccount(customerAccountInput: $customerAccountInput) {
      accountName
      address
      companyId
      id
      price
      serviceDay
      serviceFrequency
      serviceType
      accountOwners {
        emailAddress
        firstName
        id
        lastName
        phoneNumber
      }
    }
  }
`;

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
  const { customerAccount } = useOutletContext();
  const navigate = useNavigate();
  const [sendMutation, { data, loading, error }] = useMutation(
    UPDATE_CUSTOMER_MUTATION
  );
  const formErrors =
    error?.message === "MONGOOSE_VALIDATION_ERROR"
      ? error?.graphQLErrors[0]?.extensions?.fields
      : {};

  useEffect(() => {
    // After submitting the form, redirect to the user account dashboard.
    // data is available when there aren't any errors.
    if (data) {
      navigate(
        routes.getDynamicRoute({ route: "customer", id: customerAccount.id })
      );
    }
  }, [data]);

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
