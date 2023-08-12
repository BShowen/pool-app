import { Form, useLoaderData, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { accountOwnerType } from "../../../utils/types";
import {
  CREATE_ACCOUNT_OWNERS,
  GET_CUSTOMER_TECHNICIAN_LIST,
} from "../../../queries/index";
import { useMutation } from "@apollo/client";
export function NewAccountOwnerPage() {
  const { customerId } = useLoaderData();
  const navigate = useNavigate();
  const [createAccountOwners, { loading, error, data }] = useMutation(
    CREATE_ACCOUNT_OWNERS,
    { refetchQueries: [{ query: GET_CUSTOMER_TECHNICIAN_LIST }] }
  );
  const [shouldSubFormFocus, setShouldSubFormFocus] = useState(false);
  const [formData, setFormData] = useState({
    account: customerId,
    customerList: [{ ...accountOwnerType }],
  });

  // Each form input (for the "accountOwner") will call this method on input change.
  function setAccountOwner({ element, index }) {
    setFormData((prevState) => {
      // Make a copy of the previous state.
      const newState = {
        ...prevState,
      };
      // Update the appropriate account owner
      newState.customerList[index] = {
        ...newState.customerList[index],
        [element.target.name]: element.target.value,
      };
      return newState;
    });
  }

  // The NewAccountForm will call this method when adding a new accountOwner
  function addAccountOwner() {
    setFormData((prevState) => ({
      ...prevState,
      customerList: [...prevState.customerList, { ...accountOwnerType }],
    }));
  }

  // Each accountOwner component will call this method when removing an accountOwner
  function removeAccountOwner({ index }) {
    setFormData((prevState) => {
      const newState = {
        ...prevState,
        // Remove the current index from the customerList array.
        customerList: prevState.customerList.filter(
          (_, position) => position !== index
        ),
      };
      return newState;
    });
  }
  useEffect(() => {
    if (data) {
      navigate(-1);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="w-full flex flex-col gap-10 lg:w-1/4 lg:mx-auto lg:pb-40">
      <Form
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            await createAccountOwners({ variables: { input: formData } });
          } catch (error) {
            console.log({ error });
          }
        }}
      >
        {formData.customerList.map((_, index) => {
          return (
            <AccountOwnerSubForm
              key={index}
              index={index}
              errors={error?.graphQLErrors[0]?.extensions?.fields[index] || {}}
              values={formData.customerList[index]}
              onInput={(e) => setAccountOwner({ element: e, index })}
              removeHandler={() => removeAccountOwner({ index })}
              canRemove={formData.customerList.length > 1}
              shouldFocus={shouldSubFormFocus}
            />
          );
        })}

        <div className="w-full flex flex-col justify-start gap-3 p-2">
          <button
            type="button"
            className="btn btn-accent btn-sm"
            onClick={() => {
              setShouldSubFormFocus(true);
              addAccountOwner();
            }}
          >
            Add contact
          </button>
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
        </div>
      </Form>
    </div>
  );
}

function AccountOwnerSubForm({
  index,
  errors,
  values,
  onInput,
  removeHandler,
  canRemove,
  shouldFocus,
}) {
  return (
    <div className="w-full rounded-lg px-2 py-3 bg-slate-100 my-2">
      <h1 className="text-center font-semibold text-lg">Contact {index + 1}</h1>

      <label className="label">
        <span className={`label-text ${errors.firstName && "text-secondary"}`}>
          {errors.firstName || "First name"}
        </span>
      </label>
      <input
        type="text"
        placeholder="First name"
        name="firstName"
        className={`input input-bordered w-full focus:outline-none ${
          errors.firstName && "input-secondary"
        }`}
        value={values.firstName || ""}
        onInput={onInput}
        autoFocus={shouldFocus}
      />

      <label className="label">
        <span className={`label-text ${errors.lastName && "text-secondary"}`}>
          {errors.lastName || "Last name"}
        </span>
      </label>
      <input
        type="text"
        placeholder="Last name"
        name="lastName"
        className={`input input-bordered w-full focus:outline-none ${
          errors.lastName && "input-secondary"
        }`}
        value={values.lastName || ""}
        onInput={onInput}
      />

      <label className="label">
        <span
          className={`label-text ${errors.emailAddress && "text-secondary"}`}
        >
          {errors.emailAddress || "Email address"}
        </span>
      </label>
      <input
        type="email"
        placeholder="Email address"
        name="emailAddress"
        className={`input input-bordered w-full focus:outline-none ${
          errors.emailAddress && "input-secondary"
        }`}
        value={values.emailAddress || ""}
        onInput={onInput}
      />

      <label className="label">
        <span
          className={`label-text ${errors.phoneNumber && "text-secondary"}`}
        >
          {errors.phoneNumber || "Phone number"}
        </span>
      </label>
      <input
        type="text"
        placeholder="Phone number"
        name="phoneNumber"
        className={`input input-bordered w-full focus:outline-none ${
          errors.phoneNumber && "input-secondary"
        }`}
        value={values.phoneNumber || ""}
        onInput={onInput}
      />

      <div
        className={`pt-3 flex justify-end relative ${
          canRemove ? "" : "hidden"
        }`}
      >
        <button
          type="button"
          className=" w-full btn btn-error btn-sm"
          onClick={canRemove ? () => removeHandler(index) : null}
        >
          Remove
        </button>
      </div>
    </div>
  );
}
