import { useState } from "react";
import { Form, useSubmit, useNavigate } from "react-router-dom";

import AccountOwnerForm from "./AccountOwnerForm";
export default function CustomerForm({
  title,
  action,
  customerAccount,
  errors,
}) {
  const submit = useSubmit();
  const [state, setState] = useState(
    customerAccount || { accountOwners: [{}] }
  );
  const navigate = useNavigate();

  function updateState(e) {
    const isSubForm = Object.keys(e.target.dataset).length;
    if (isSubForm) {
      const index = e.target.dataset.index;
      setState((prevState) => {
        const updatedAccountOwners = prevState.accountOwners;
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
        return { ...prevState, [e.target.name]: e.target.value };
      });
    }
  }

  function removeAccountOwner() {
    setState((prevState) => {
      prevState.accountOwners.pop();
      return { ...prevState };
    });
  }

  return (
    <Form
      className="flex flex-col w-full px-5"
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData();
        for (const [key, value] of Object.entries(state)) {
          if (Array.isArray(value)) {
            formData.set(key, JSON.stringify(value));
          } else {
            formData.set(key, value);
          }
        }
        submit(formData, { method: "post", action: action });
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
              placeholder="Type here"
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
                    accountOwners: [...prevState.accountOwners, {}],
                  };
                });
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
