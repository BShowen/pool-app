import { useState } from "react";
import { Form, useSubmit, useNavigate } from "react-router-dom";

import AccountOwnerForm from "./AccountOwnerForm";
import { accountOwnerType } from "../../../../utils/types";

export default function CustomerForm({
  title,
  action,
  customerAccount,
  errors,
  onSubmit,
}) {
  // If a submit handler is passed in then use that to submit the form.
  // Otherwise use useSubmit() to submit the form.
  const submit = onSubmit || useSubmit();
  const [state, setState] = useState(
    customerAccount || { accountOwners: [{}] }
  );
  const navigate = useNavigate();
  const [focus, setFocus] = useState(false);
  const accountOwnersCount = state.accountOwners.length - 1;

  // If errors is undefined then assign a blank object {} to it.
  // This is because the form expects errors to always be ab object.
  errors = errors ? errors : {};

  function updateState(e) {
    const isSubForm = Object.keys(e.target.dataset).length;
    if (isSubForm) {
      const index = e.target.dataset.index;
      setState((prevState) => {
        const updatedAccountOwners = [...prevState.accountOwners];
        updatedAccountOwners[index] = {
          ...prevState.accountOwners[index],
          [e.target.name]: e.target.value,
        };
        return {
          ...prevState,
          accountOwners: updatedAccountOwners,
        };
      });
    } else {
      setState((prevState) => {
        let value =
          e.target.type === "number"
            ? Number.parseFloat(e.target.value)
            : e.target.value;
        return { ...prevState, [e.target.name]: value };
      });
    }
  }

  function removeAccountOwner(itemIndex) {
    setState((prevState) => {
      const accountOwners = [
        ...prevState.accountOwners.filter((item, index) => {
          if (index === itemIndex) return;
          return item;
        }),
      ];
      const newState = { ...prevState, accountOwners };
      return newState;
    });
  }

  return (
    <Form
      className="flex flex-col w-full px-5"
      onSubmit={(e) => {
        e.preventDefault();
        submit({ formData: state });
      }}
    >
      <div>
        <div className="p-1 lg:p-5 h-24 w-full flex flex-row justify-center items-baseline">
          <h1 className="text-3xl font-bold">{title}</h1>
        </div>

        <div className="w-full flex flex-col gap-10 lg:w-1/4 lg:mx-auto lg:pb-40">
          <div className="w-full rounded-lg px-2 py-3 bg-slate-100">
            <h1 className="text-center font-semibold text-lg">
              Account information
            </h1>
            <label className="label">
              <span
                className={`label-text ${
                  errors.accountName && "text-secondary"
                }`}
              >
                Account name {errors.accountName && " - required"}
              </span>
            </label>
            <input
              type="text"
              placeholder="Account name"
              name="accountName"
              className={`input input-bordered w-full focus:outline-none ${
                errors.accountName && "input-secondary"
              }`}
              value={state.accountName || ""}
              onInput={updateState}
              autoFocus
            />

            <label className="label">
              <span
                className={`label-text ${errors.address && "text-secondary"}`}
              >
                Address {errors.address && "- required"}
              </span>
            </label>
            <input
              type="text"
              placeholder="Address"
              name="address"
              className={`input input-bordered w-full focus:outline-none ${
                errors.address && "input-secondary"
              }`}
              value={state.address || ""}
              onInput={updateState}
            />

            <label className="label">
              <span
                className={`label-text ${errors.price && "text-secondary"}`}
              >
                Price {errors.price && " - required"}
              </span>
            </label>
            <input
              type="number"
              placeholder="Price"
              name="price"
              step="0.01"
              className={`input input-bordered w-full focus:outline-none ${
                errors.price && "input-secondary"
              }`}
              value={state.price || ""}
              onInput={updateState}
            />

            <label className="label">
              <span
                className={`label-text ${
                  errors.serviceFrequency && "text-secondary"
                }`}
              >
                Service frequency {errors.serviceFrequency && " - required"}
              </span>
            </label>
            <input
              type="text"
              placeholder="Service frequency"
              name="serviceFrequency"
              className={`input input-bordered w-full focus:outline-none ${
                errors.serviceFrequency && "input-secondary"
              }`}
              value={state.serviceFrequency || ""}
              onInput={updateState}
            />

            <label className="label">
              <span
                className={`label-text ${
                  errors.serviceDay && "text-secondary"
                }`}
              >
                Service day {errors.serviceDay && " - required"}
              </span>
            </label>
            <input
              type="text"
              placeholder="Service day"
              name="serviceDay"
              className={`input input-bordered w-full focus:outline-none ${
                errors.serviceDay && "input-secondary"
              }`}
              value={state.serviceDay || ""}
              onInput={updateState}
            />

            <label className="label">
              <span
                className={`label-text ${
                  errors.serviceType && "text-secondary"
                }`}
              >
                Service type {errors.serviceType && " - required"}
              </span>
            </label>
            <input
              type="text"
              placeholder="Service type"
              name="serviceType"
              className={`input input-bordered w-full focus:outline-none ${
                errors.serviceType && "input-secondary"
              }`}
              value={state.serviceType || ""}
              onInput={updateState}
            />
          </div>

          {state.accountOwners.map((_, index) => {
            return (
              <AccountOwnerForm
                key={index}
                index={index}
                changeHandler={updateState}
                values={state.accountOwners[index]}
                errors={
                  (errors.accountOwners && errors.accountOwners[index]) || {}
                }
                removeHandler={index > 0 ? removeAccountOwner : null}
                shouldFocus={focus && index == accountOwnersCount}
              />
            );
          })}

          <div className="w-full flex flex-col justify-start gap-3">
            <button
              type="button"
              className="btn btn-accent btn-sm"
              onClick={() => {
                setState((prevState) => {
                  return {
                    ...prevState,
                    accountOwners: [
                      ...prevState.accountOwners,
                      { ...accountOwnerType },
                    ],
                  };
                });
                setFocus(true);
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
        </div>
      </div>
    </Form>
  );
}
