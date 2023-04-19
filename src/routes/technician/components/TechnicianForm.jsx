import { useState } from "react";
import { Form, useNavigate, useSubmit } from "react-router-dom";
export default function TechnicianForm({
  title,
  action,
  defaultValues,

  // errors parameters are backend validation errors.
  // This is populated only when an invalid form has been submitted.
  // Backend validates form and responds with error messages for each field.
  errors,
}) {
  const navigate = useNavigate();
  const submit = useSubmit();
  const [state, setState] = useState({
    firstName: {
      value: defaultValues?.firstName || "",
      validated: false,
      valid: function () {
        return this.value.trim().length > 0;
      },
      validatedAndInvalid: function () {
        return this.validated && !this.valid();
      },
      label: function () {
        return this.validated == this.valid()
          ? "First name"
          : "First name is required";
      },
      labelClassList: function () {
        if (this.validatedAndInvalid()) {
          return "text-secondary";
        } else {
          return "";
        }
      },
      inputClassList: function (validationErrors) {
        if (validationErrors.firstName || this.validatedAndInvalid()) {
          return "input-secondary";
        } else {
          return "";
        }
      },
    },
    lastName: {
      value: defaultValues?.lastName || "",
      validated: false,
      valid: function () {
        return this.value.trim().length > 0;
      },
      validatedAndInvalid: function () {
        return this.validated && !this.valid();
      },
      label: function () {
        return this.validated == this.valid()
          ? "Last name"
          : "Last name is required";
      },
      labelClassList: function () {
        if (this.validatedAndInvalid()) {
          return "text-secondary";
        } else {
          return "";
        }
      },
      inputClassList: function (validationErrors) {
        if (validationErrors.lastName || this.validatedAndInvalid()) {
          return "input-secondary";
        } else {
          return "";
        }
      },
    },
    emailAddress: {
      value: defaultValues?.emailAddress || "",
      validated: false,
      valid: function () {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
          this.value.trim()
        );
      },
      validatedAndInvalid: function () {
        return this.validated && !this.valid();
      },
      label: function () {
        return this.validated == this.valid()
          ? "Email address"
          : "Email address is required";
      },
      labelClassList: function () {
        if (this.validatedAndInvalid()) {
          return "text-secondary";
        } else {
          return "";
        }
      },
      inputClassList: function (validationErrors) {
        if (validationErrors.emailAddress || this.validatedAndInvalid()) {
          return "input-secondary";
        } else {
          return "";
        }
      },
    },
    password: {
      value: defaultValues?.password || "",
      validated: false,
      valid: function () {
        return this.value.trim().length > 0;
      },
      validatedAndInvalid: function () {
        return this.validated && !this.valid();
      },
      label: function () {
        return this.validated == this.valid()
          ? "Password"
          : "Password is required";
      },
      labelClassList: function () {
        if (this.validatedAndInvalid()) {
          return "text-secondary";
        } else {
          return "";
        }
      },
      inputClassList: function (validationErrors) {
        if (validationErrors.password || this.validatedAndInvalid()) {
          return "input-secondary";
        } else {
          return "";
        }
      },
    },
  });

  function handleInput(e) {
    e.preventDefault();
    const name = e.target.name;
    setState((prevState) => {
      return {
        ...prevState,
        [name]: {
          ...prevState[name],
          value: e.target.value,
          validated: true,
        },
      };
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    let isValid = true;
    for (const fieldName in state) {
      if (state[fieldName].valid()) {
        continue;
      } else {
        isValid = false;
        setState((prevState) => {
          return {
            ...prevState,
            [fieldName]: { ...prevState[fieldName], validated: true },
          };
        });
      }
    }
    if (isValid) {
      submit(e.currentTarget);
    }
  }

  return (
    <Form
      className="flex flex-col w-full px-5"
      method="post"
      action={action}
      onSubmit={handleSubmit}
    >
      <div>
        <div className="p-1 lg:p-5 h-24 w-full flex flex-row justify-center items-baseline">
          <h1 className="text-3xl font-bold">{title}</h1>
        </div>

        <div className="w-full flex flex-col gap-10 lg:w-1/4 lg:mx-auto lg:pb-40">
          <div className="w-full rounded-lg px-2 py-3 bg-slate-100">
            <label className="label">
              <span
                className={`label-text ${state.firstName.labelClassList()}`}
              >
                {state.firstName.label()}
              </span>
            </label>
            <input
              type="text"
              placeholder="First name"
              name="firstName"
              className={`input input-bordered w-full focus:outline-none 
              ${state.firstName.inputClassList(errors)}`}
              value={state.firstName.value}
              onChange={handleInput}
              // onBlur={handleInput}
              autoFocus
            />

            <label className="label">
              <span className={`label-text ${state.lastName.labelClassList()}`}>
                {errors.lastName || state.lastName.label()}
              </span>
            </label>
            <input
              type="text"
              placeholder="Last name"
              name="lastName"
              className={`input input-bordered w-full focus:outline-none 
              ${state.lastName.inputClassList(errors)}`}
              value={state.lastName.value}
              onChange={handleInput}
              // onBlur={handleInput}
            />

            <label className="label">
              <span
                className={`label-text ${state.emailAddress.labelClassList()}`}
              >
                {errors.emailAddress || state.emailAddress.label()}
              </span>
            </label>
            <input
              type="email"
              placeholder="Email address"
              name="emailAddress"
              className={`input input-bordered w-full focus:outline-none
                  ${state.emailAddress.inputClassList(errors)}`}
              value={state.emailAddress.value}
              onChange={handleInput}
              // onBlur={handleInput}
            />

            <label className="label">
              <span className={`label-text ${state.password.labelClassList()}`}>
                {errors.password || state.password.label()}
              </span>
            </label>
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={state.password.value}
              className={`input input-bordered w-full focus:outline-none
                  ${state.password.inputClassList(errors)}`}
              onChange={handleInput}
              // onBlur={handleInput}
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
