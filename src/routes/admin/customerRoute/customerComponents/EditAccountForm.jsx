import { useState } from "react";
import { Form, useNavigate } from "react-router-dom";

export default function EditAccountForm({ account, errors, onSubmit }) {
  // If a submit handler is passed in then use that to submit the form.
  // Otherwise use useSubmit() to submit the form.
  const submit = onSubmit;
  const navigate = useNavigate();

  // If errors is undefined then assign a blank object {} to it.
  // This is because the form expects errors to always be ab object.
  errors = errors ? errors : {};

  return (
    <Form
      className="flex flex-col w-full px-5"
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        formData.append("id", account?.id);
        submit({ formData });
      }}
    >
      <div>
        <div className="p-1 lg:p-5 h-24 w-full flex flex-row justify-center items-baseline">
          <h1 className="text-3xl font-bold">Update account</h1>
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
              defaultValue={account?.accountName || ""}
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
              defaultValue={account?.address || ""}
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
              defaultValue={account?.price || ""}
            />
            <ServiceFrequencySelector
              defaultSelection={account?.serviceFrequency}
              errors={errors?.serviceFrequency}
            />
            <ServiceDaySelector
              defaultSelection={account?.serviceDay}
              error={errors?.serviceDay}
            />
            <ServiceTypeSelector
              defaultSelection={account?.serviceType}
              errors={errors?.serviceType}
            />
          </div>
          <div className="w-full flex flex-col justify-start gap-3">
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

export function ServiceDaySelector({ defaultSelection, error, changeHandler }) {
  const [selection, setSelection] = useState(defaultSelection);

  function updateState(e) {
    setSelection(e.target.value);
    if (typeof changeHandler === "function") {
      changeHandler(e);
    }
  }
  return (
    <>
      <label className="label">
        <span className={`label-text ${error && "text-secondary"}`}>
          Service day {error && " - required"}
        </span>
      </label>
      <select
        className={`input input-bordered w-full focus:outline-none ${
          error && "input-secondary"
        }`}
        defaultValue={selection || "disabled"}
        name="serviceDay"
        onChange={updateState}
      >
        <option value="disabled" disabled>
          Service day
        </option>
        <option value="unscheduled">Unscheduled</option>
        <option value="sunday">Sunday</option>
        <option value="monday">Monday</option>
        <option value="tuesday">Tuesday</option>
        <option value="wednesday">Wednesday</option>
        <option value="thursday">Thursday</option>
        <option value="friday">Friday</option>
        <option value="saturday">Saturday</option>
      </select>
    </>
  );
}

export function ServiceFrequencySelector({
  defaultSelection,
  error,
  changeHandler,
}) {
  const [selection, setSelection] = useState(defaultSelection);

  function updateState(e) {
    setSelection(e.target.value);
    if (typeof changeHandler === "function") {
      changeHandler(e);
    }
  }
  return (
    <>
      <label className="label">
        <span className={`label-text ${error && "text-secondary"}`}>
          Service frequency {error && " - required"}
        </span>
      </label>
      <select
        name="serviceFrequency"
        className={`input input-bordered w-full focus:outline-none ${
          error && "input-secondary"
        }`}
        defaultValue={selection || "disabled"}
        onChange={updateState}
      >
        <option disabled value="disabled">
          Service frequency
        </option>
        <option value="weekly">Weekly</option>
        <option value="bi-weekly">Bi-weekly</option>
      </select>
    </>
  );
}

export function ServiceTypeSelector({
  defaultSelection,
  error,
  changeHandler,
}) {
  const [selection, setSelection] = useState(defaultSelection);

  function updateState(e) {
    setSelection(e.target.value);
    if (typeof changeHandler === "function") {
      changeHandler(e);
    }
  }
  return (
    <>
      <label className="label">
        <span className={`label-text ${error && "text-secondary"}`}>
          Service type {error && " - required"}
        </span>
      </label>
      <select
        name="serviceType"
        className={`input input-bordered w-full focus:outline-none ${
          error && "input-secondary"
        }`}
        defaultValue={selection || "disabled"}
        onChange={updateState}
      >
        <option disabled value="disabled">
          Service type
        </option>
        <option value="full service">Full service</option>
        <option value="chemical service">Chemical service</option>
      </select>
    </>
  );
}
