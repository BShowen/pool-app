import { useNavigate, useOutletContext } from "react-router-dom";
import { useEffect } from "react";

import CustomerForm from "./customerComponents/CustomerForm";
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
    const { data } = await sendMutation({ variables });
    const customerAccount = data.updateCustomerAccount;
    return redirect(
      routes.getDynamicRoute({ route: "customer", id: customerAccount.id })
    );
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

  useEffect(() => {
    if (data) {
      navigate(
        routes.getDynamicRoute({ route: "customer", id: customerAccount.id })
      );
    }
  }, [data]);

  return (
    <CustomerForm
      title={"Edit customer"}
      customerAccount={customerAccount}
      errors={error}
      onSubmit={({ formData }) => {
        updateCustomer(formData, sendMutation);
      }}
    />
  );
}
