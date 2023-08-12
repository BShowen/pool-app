import { Form, useLoaderData } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { AccountOwnerInput } from "./customerComponents/AccountOwnerInput.jsx";
import {
  GET_CUSTOMER_ACCOUNT,
  UPDATE_CUSTOMERS,
} from "../../../queries/index.js";

export default function EditAccountOwnerPage() {
  // Get the id from the url.
  const { customerId, ownerId } = useLoaderData();
  // navigate is used to navigate back when user clicks "Cancel" button.
  const navigate = useNavigate();
  // Retrieve the customer account in order to prefill the form.
  const { data, error, loading } = useQuery(GET_CUSTOMER_ACCOUNT, {
    variables: { accountId: customerId },
  });

  // Mutation to update the customers
  const [
    updateCustomers,
    { data: mutationData, error: mutationError, loading: mutationLoading },
  ] = useMutation(UPDATE_CUSTOMERS);

  // Store the form data for form submission.
  const [accountOwner, setAccountOwner] = useState({});

  // On page load, customer account data is retrieved from backend.
  // The backend provides some fields that need to be removed in order for
  // the mutation query to work properly.
  // Remove "__typename", "account" fields.
  useEffect(() => {
    const account = {
      ...data.customerAccount.accountOwners.find(
        (accountOwner) => accountOwner.id == ownerId
      ),
    };
    delete account.__typename;
    delete account.account;
    setAccountOwner(account);
  }, [data]);

  // When the mutation is successful, redirect to dashboard.
  useEffect(() => {
    if (mutationData) {
      navigate(-1);
    }
  }, [mutationData]);

  if (loading || mutationLoading) return "Loading...";
  if (error) return `Error...`;

  const formErrors = mutationError
    ? mutationError.graphQLErrors[0].extensions.fields
    : {};

  return (
    <div className="w-full flex flex-col gap-10 lg:w-1/4 lg:mx-auto lg:pb-40">
      <Form
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            await updateCustomers({ variables: { input: accountOwner } });
          } catch (error) {
            console.log({ error });
          }
        }}
      >
        <AccountOwnerInput
          values={accountOwner}
          onInput={(e) => {
            setAccountOwner((prevState) => {
              return { ...prevState, [e.target.name]: e.target.value };
            });
          }}
          errors={formErrors[0] || {}}
        />
        <div className="divider !p-0 !m-0"></div>
        <div className="flex gap-2 justify-evenly">
          <button className="btn btn-primary w-2/4" type="submit">
            Submit
          </button>
          <button
            className="btn btn-error w-2/4"
            type="button"
            onClick={() => {
              navigate(-1);
            }}
          >
            Cancel
          </button>
        </div>
      </Form>
    </div>
  );
}
