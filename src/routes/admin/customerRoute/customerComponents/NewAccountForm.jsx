import { Form, useNavigate } from "react-router-dom";
import { useState } from "react";

import {
  ServiceDaySelector,
  ServiceFrequencySelector,
  ServiceTypeSelector,
} from "./EditAccountForm";

export function NewAccountForm({
  errors,
  submitHandler,
  values,
  setAccount,
  setAccountOwner,
  removeAccountOwner,
  addAccountOwner,
}) {
  const navigate = useNavigate();
  const [shouldSubFormFocus, setShouldSubFormFocus] = useState(false);

  return (
    <Form
      className="flex flex-col w-full px-5"
      onSubmit={(e) => {
        e.preventDefault();
        submitHandler();
      }}
    >
      <div>
        <div className="p-1 lg:p-5 h-24 w-full flex flex-row justify-center items-baseline">
          <h1 className="text-3xl font-bold">Create account</h1>
        </div>

        <div className="w-full flex flex-col gap-2 lg:w-1/4 lg:mx-auto lg:pb-40">
          <div className="w-full rounded-lg px-2 py-3 bg-slate-100">
            <h1 className="text-center font-semibold text-lg">
              Account information
            </h1>
            <label className="label">
              <span
                className={`label-text ${
                  errors.customerAccount?.accountName && "text-secondary"
                }`}
              >
                Account name{" "}
                {errors.customerAccount?.accountName && " - required"}
              </span>
            </label>
            <input
              type="text"
              placeholder="Account name"
              name="accountName"
              className={`input input-bordered w-full focus:outline-none ${
                errors.customerAccount?.accountName && "input-secondary"
              }`}
              value={values.account.accountName}
              onInput={(e) => setAccount(e)}
              autoFocus
            />

            <label className="label">
              <span
                className={`label-text ${
                  errors.customerAccount?.address && "text-secondary"
                }`}
              >
                Address {errors.customerAccount?.address && "- required"}
              </span>
            </label>
            <input
              type="text"
              placeholder="Address"
              name="address"
              className={`input input-bordered w-full focus:outline-none ${
                errors.customerAccount?.address && "input-secondary"
              }`}
              value={values.account.address}
              onInput={(e) => setAccount(e)}
            />

            <label className="label">
              <span
                className={`label-text ${
                  errors.customerAccount?.price && "text-secondary"
                }`}
              >
                Price {errors.customerAccount?.price && " - required"}
              </span>
            </label>
            <input
              type="number"
              placeholder="Price"
              name="price"
              step="0.10"
              className={`input input-bordered w-full focus:outline-none ${
                errors.customerAccount?.price && "input-secondary"
              }`}
              value={values.account.price}
              onInput={(e) => setAccount(e)}
            />
            <ServiceFrequencySelector
              defaultSelection={values.account.serviceFrequency}
              changeHandler={setAccount}
              error={errors.customerAccount?.serviceFrequency}
            />
            <ServiceDaySelector
              defaultSelection={values.account.serviceDay}
              changeHandler={setAccount}
              error={errors.customerAccount?.serviceDay}
            />
            <ServiceTypeSelector
              defaultSelection={values.account.serviceType}
              changeHandler={setAccount}
              error={errors.customerAccount?.serviceType}
            />
          </div>

          {values.accountOwners.map((_, index) => {
            return (
              <AccountOwnerSubForm
                key={index}
                index={index}
                errors={
                  (errors.accountOwners && errors.accountOwners[index]) || {}
                }
                values={values.accountOwners[index]}
                onInput={(e) => setAccountOwner({ element: e, index })}
                canRemove={values.accountOwners.length > 1}
                removeHandler={() => removeAccountOwner({ index })}
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
        </div>
      </div>
    </Form>
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
