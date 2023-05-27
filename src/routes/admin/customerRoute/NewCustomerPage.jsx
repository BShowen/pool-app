import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";

import { CREATE_NEW_CUSTOMER, CUSTOMER_LIST } from "../../../queries/index.js";
import CustomerForm from "./customerComponents/CustomerForm";
import routes from "../../routeDefinitions";
import { useEffect } from "react";
import LoadingOverlay from "../../../components/LoadingOverlay";

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
    { refetchQueries: [{ query: CUSTOMER_LIST }] }
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

  return (
    <>
      <LoadingOverlay show={loading} />
      <CustomerForm
        title={"New customer"}
        errors={formErrors}
        onSubmit={({ formData }) => {
          createNewCustomer(formData, createCustomer);
        }}
      />
    </>
  );
}
