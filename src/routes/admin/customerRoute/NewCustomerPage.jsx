import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { useState } from "react";

import {
  CREATE_CUSTOMER_ACCOUNT,
  CUSTOMER_TECHNICIAN_LIST,
} from "../../../queries/index.js";
import { NewAccountForm } from "./customerComponents/NewAccountForm";
import routes from "../../routeDefinitions";
import { useEffect } from "react";

const accountOwnerType = {
  firstName: "",
  lastName: "",
  emailAddress: "",
  phoneNumber: "",
};

export default function NewCustomerPage() {
  const navigate = useNavigate();
  const [createCustomer, { data, error, loading }] = useMutation(
    CREATE_CUSTOMER_ACCOUNT,
    { refetchQueries: [{ query: CUSTOMER_TECHNICIAN_LIST }] }
    // {
    //   update(cache, { data }) {
    //     // The document that was just created.
    //     const newCustomerFromResponse = data?.createNewCustomerAccount;

    //     // The current cache that is stored for the CUSTOMER_TECHNICIAN_LIST query
    //     const existingCustomers = cache.readQuery({
    //       query: CUSTOMER_TECHNICIAN_LIST,
    //     });

    //     // Update the cached value for CUSTOMER_TECHNICIAN_LIST query
    //     if (existingCustomers && newCustomerFromResponse) {
    //       cache.writeQuery({
    //         query: CUSTOMER_TECHNICIAN_LIST,
    //         data: {
    //           ...existingCustomers,
    //           getCustomerAccountList: [
    //             ...existingCustomers.getCustomerAccountList,
    //             newCustomerFromResponse,
    //           ],
    //         },
    //       });
    //     }
    //   },
    // }
  );
  const formErrors = error?.graphQLErrors[0]?.extensions?.fields || {};
  const [formData, setFormData] = useState({
    account: {
      accountName: "",
      address: "",
      price: "",
      serviceFrequency: "",
      serviceDay: "",
      serviceType: "",
    },
    accountOwners: [{ ...accountOwnerType }],
  });

  // Each form input (for the "account") will call this method on input change.
  function setAccount(e) {
    const name = e.target.name;
    let value;
    if (name === "price") {
      // Price must be a number and cannot be less than zero
      const parsedInput = Number.parseFloat(e.target.value);
      if (isNaN(parsedInput) || parsedInput < 0) {
        value = "";
      } else {
        value = parsedInput;
      }
    } else {
      value = e.target.value;
    }

    setFormData((prevState) => {
      return {
        ...prevState,
        account: {
          ...prevState.account,
          [name]: value,
        },
      };
    });
  }

  // Each form input (for the "accountOwner") will call this method on input change.
  function setAccountOwner({ element, index }) {
    setFormData((prevState) => {
      // Make a copy of the previous state.
      const newState = {
        ...prevState,
      };
      // Update the appropriate account owner
      newState.accountOwners[index] = {
        ...newState.accountOwners[index],
        [element.target.name]: element.target.value,
      };
      return newState;
    });
  }

  // Each accountOwner component will call this method when removing an accountOwner
  function removeAccountOwner({ index }) {
    setFormData((prevState) => {
      const newState = {
        ...prevState,
        // Remove the current index from the accountOwners array.
        accountOwners: prevState.accountOwners.filter(
          (_, position) => position !== index
        ),
      };
      return newState;
    });
  }

  // The NewAccountForm will call this method when adding a new accountOwner
  function addAccountOwner() {
    setFormData((prevState) => ({
      ...prevState,
      accountOwners: [...prevState.accountOwners, { ...accountOwnerType }],
    }));
  }

  useEffect(() => {
    if (data) {
      const customerId = data.newCustomerAccount.id;
      const route = routes.getDynamicRoute({
        route: "customer",
        id: customerId,
      });
      navigate(route);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;

  return (
    <NewAccountForm
      errors={formErrors}
      values={formData}
      setAccount={setAccount}
      setAccountOwner={setAccountOwner}
      removeAccountOwner={removeAccountOwner}
      addAccountOwner={addAccountOwner}
      submitHandler={async () => {
        try {
          const input = {
            ...formData,
            account: {
              ...formData.account,
              price: Number.parseFloat(formData.account.price || -1),
            },
          };
          await createCustomer({ variables: { input } });
        } catch (error) {
          console.log({ error });
          // Errors are handled by the component.
          // This catch statement is here to silence the browser from logging
          // that there is an uncaught error.
          return false;
        }
      }}
    />
  );
}
