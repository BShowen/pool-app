import { Form, redirect, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useMutation, gql } from "@apollo/client";

import routes from "./routeDefinitions";
import { SpinnerOverlay } from "../components/SpinnerOverlay.jsx";
import { LOGIN } from "../queries/index";

export function loader() {
  // Redirect the user if they are already logged in.
  const apiToken = window.localStorage.getItem("apiToken") || false;
  if (apiToken) {
    return redirect(routes.root);
  }
  return null;
}

export default function Login() {
  const navigate = useNavigate();
  const [login, { data, loading }] = useMutation(LOGIN);
  const [formErrors, setFormErrors] = useState({
    email: undefined,
    password: undefined,
  });

  useEffect(() => {
    // Place apiToken in local storage
    if (data?.login) {
      window.localStorage.setItem("apiToken", data.login);
      // Redirect to dashboard
      navigate(routes.root);
    }
  }, [data]);

  async function submitForm(formData) {
    try {
      await login({ variables: { input: formData } });
    } catch (error) {
      const errorMessages = {};
      error.graphQLErrors.forEach((er) => {
        const { field } = er.extensions;
        errorMessages[field] = er.message;
      });
      setFormErrors(errorMessages);
    }
  }

  return (
    <div className="pt-6">
      <Form
        method="post"
        className="flex flex-col gap-4 w-full p-5 md:w-96 md:mx-auto relative"
        onSubmit={(e) => {
          e.preventDefault();
          const formData = Object.fromEntries(new FormData(e.target));
          submitForm(formData);
        }}
      >
        {loading && <SpinnerOverlay />}
        <div>
          <div className="mb-2 block">
            <label
              htmlFor="email"
              className={formErrors.email ? "text-secondary" : ""}
            >
              Email
            </label>
          </div>
          <input
            required
            id="email"
            type="email"
            placeholder="Email"
            name="email"
            className={`input input-bordered w-full ${
              formErrors.email ? "input-secondary" : ""
            }`}
          />
          <p
            className={`mt-2 text-sm h-4 text-secondary ${
              (!formErrors.email && "invisible") || ""
            }`}
          >
            {formErrors.email}
          </p>
        </div>
        <div>
          <div className="mb-2 block">
            <label
              htmlFor="password"
              className={formErrors.password ? "text-secondary" : ""}
            >
              Password
            </label>
          </div>
          <input
            required
            id="password"
            type="password"
            placeholder="Password"
            name="password"
            className={`input input-bordered w-full ${
              formErrors.password ? "input-secondary" : ""
            }`}
          />
          <p
            className={`mt-2 text-sm h-4 text-secondary ${
              !formErrors.password && "invisible"
            }`}
          >
            {formErrors.password}
          </p>
        </div>
        <button className="btn btn-primary" type="submit">
          Login
        </button>
      </Form>
    </div>
  );
}
