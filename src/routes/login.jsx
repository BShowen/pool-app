import { Form, useActionData, redirect } from "react-router-dom";
import { getLoginToken } from "../utils/apiFetches";

export async function action({ request, params }) {
  const formData = await request.formData();
  const { errors, data } = await getLoginToken(Object.fromEntries(formData));
  if (errors) {
    // There is only ever one error message returned at a time when logging in.
    const error = errors[0];
    return { [error.field]: error.message };
  } else {
    window.localStorage.setItem("apiToken", data.token);
    return redirect("/");
  }
}

export function loader() {
  // Redirect the user if they are already logged in.
  const apiToken = window.localStorage.getItem("apiToken") || false;
  if (apiToken) {
    return redirect("/");
  }
  return null;
}

export default function Login() {
  const { email: emailError, password: passwordError } = useActionData() || {};

  return (
    <div className="pt-6">
      <Form
        method="post"
        className="flex flex-col gap-4 w-full p-5 md:w-96 md:mx-auto"
      >
        <div>
          <div className="mb-2 block">
            <label
              htmlFor="email"
              className={emailError ? "text-secondary" : undefined}
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
              emailError ? "input-secondary" : undefined
            }`}
          />
          <p
            className={`mt-2 text-sm h-4 text-secondary ${
              !emailError && "invisible"
            }`}
          >
            {emailError}
          </p>
        </div>
        <div>
          <div className="mb-2 block">
            <label
              htmlFor="password"
              className={passwordError ? "text-secondary" : undefined}
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
              passwordError ? "input-secondary" : undefined
            }`}
          />
          <p
            className={`mt-2 text-sm h-4 text-secondary ${
              !passwordError && "invisible"
            }`}
          >
            {passwordError}
          </p>
        </div>
        <button className="btn btn-primary" type="submit">
          Login
        </button>
      </Form>
    </div>
  );
}
