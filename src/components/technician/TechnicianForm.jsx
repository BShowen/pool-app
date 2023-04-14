import { useState } from "react";
import { Form, useSubmit, useNavigate } from "react-router-dom";
export default function TechnicianForm({ title, action, values, errors }) {
  const navigate = useNavigate();

  return (
    <Form className="flex flex-col w-full px-5" method="post" action={action}>
      <div>
        <div className="p-1 lg:p-5 h-24 w-full flex flex-row justify-center items-baseline">
          <h1 className="text-3xl font-bold">{title}</h1>
        </div>

        <div className="w-full flex flex-col gap-10 lg:w-1/4 lg:mx-auto lg:pb-40">
          <div className="w-full rounded-lg px-2 py-3 bg-slate-100">
            <label className="label">
              <span
                className={`label-text ${errors.firstName && "text-secondary"}`}
              >
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
              defaultValue={values.firstName || ""}
              autoFocus
            />

            <label className="label">
              <span
                className={`label-text ${errors.lastName && "text-secondary"}`}
              >
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
              defaultValue={values.address || ""}
            />

            <label className="label">
              <span
                className={`label-text ${
                  errors.emailAddress && "text-secondary"
                }`}
              >
                {errors.emailAddress || "Email address"}
              </span>
            </label>
            <input
              type="text"
              placeholder="Email address"
              name="emailAddress"
              className={`input input-bordered w-full focus:outline-none ${
                errors.emailAddress && "input-secondary"
              }`}
              defaultValue={values.price || ""}
            />

            <label className="label">
              <span
                className={`label-text ${errors.password && "text-secondary"}`}
              >
                {errors.password || "Password"}
              </span>
            </label>
            <input
              type="password"
              placeholder="Password"
              name="password"
              className={`input input-bordered w-full focus:outline-none ${
                errors.password && "input-secondary"
              }`}
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
