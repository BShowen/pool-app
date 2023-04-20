import { Form, useNavigate, useSubmit } from "react-router-dom";

import useInput from "../../../hooks/useInput";
import { useEffect, useState } from "react";
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

  const [firstName] = useInput({
    value: defaultValues?.firstName || "",
    type: "text",
    name: "firstName",
    placeholder: "First name",
    labelValue: "First name",
    error: "First name is required",
    autoFocus: true,
  });

  const [lastName] = useInput({
    value: defaultValues?.lastName || "",
    type: "text",
    name: "lastName",
    placeholder: "Last name",
    labelValue: "Last name",
    error: "Last name is required",
  });

  const [password] = useInput({
    type: "password",
    name: "password",
    placeholder: "Password",
    labelValue: "Password",
    error: "Password is required",
  });

  const [email, setEmailError] = useInput({
    value: defaultValues?.emailAddress || "",
    type: "email",
    name: "emailAddress",
    placeholder: "Email address",
    labelValue: "Email",
    error: "Email is invalid",
    validator: function () {
      return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
        this.value.trim()
      );
    },
  });

  function handleSubmit(e) {
    e.preventDefault();

    // make sure all fields are valid
    const isValid = ![
      firstName.validate(),
      lastName.validate(),
      email.validate(),
      password.validate(),
    ].includes(false);

    if (isValid) {
      return submit(e.currentTarget);
    }
  }

  useEffect(() => {
    if (errors.emailAddress) {
      setEmailError(errors.emailAddress);
    }
  }, [errors]);

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
              <span className={`label-text ${firstName.label.className}`}>
                {firstName.label.value}
              </span>
            </label>
            <input
              {...firstName.input}
              // onBlur={handleInput}
            />

            <label className="label">
              <span className={`label-text ${lastName.label.className}`}>
                {lastName.label.value}
              </span>
            </label>
            <input
              {...lastName.input}
              // onBlur={handleInput}
            />

            <label className="label">
              <span className={`label-text ${email.label.className}`}>
                {email.label.value}
              </span>
            </label>
            <input
              {...email.input}
              // onBlur={handleInput}
            />

            <label className="label">
              <span className={`label-text ${password.label.className}`}>
                {password.label.value}
              </span>
            </label>
            <input
              {...password.input}
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
