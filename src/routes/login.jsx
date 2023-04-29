import { Form, useActionData, redirect } from "react-router-dom";
import { useEffect, useState } from "react";
import { getLoginToken } from "../utils/apiFetches";
import routes from "./routeDefinitions";
import store from "../utils/store";
export async function action({ request, params }) {
  const formData = await request.formData();
  const { errors, data } = await getLoginToken(Object.fromEntries(formData));
  if (errors) {
    return errors;
  } else {
    window.localStorage.setItem("apiToken", data.token);
    return redirect(routes.root);
  }
}

export function loader() {
  // Redirect the user if they are already logged in.
  const apiToken = window.localStorage.getItem("apiToken") || false;
  if (apiToken) {
    return redirect(routes.root);
  }
  return null;
}

export default function Login() {
  const { email, password } = useActionData() || {};
  const [messageList] = useState(store.get()); //Get any messages associated with this route

  useEffect(() => {
    return () => {
      // Clear the store only when unmounting.
      store.clear();
    };
  });

  return (
    <div className="pt-6">
      <Form
        method="post"
        className="flex flex-col gap-4 w-full p-5 md:w-96 md:mx-auto"
      >
        <p>{messageList[0]}</p>
        <div>
          <div className="mb-2 block">
            <label htmlFor="email" className={email ? "text-secondary" : ""}>
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
              email ? "input-secondary" : ""
            }`}
          />
          <p
            className={`mt-2 text-sm h-4 text-secondary ${
              (!email && "invisible") || ""
            }`}
          >
            {email}
          </p>
        </div>
        <div>
          <div className="mb-2 block">
            <label
              htmlFor="password"
              className={password ? "text-secondary" : ""}
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
              password ? "input-secondary" : ""
            }`}
          />
          <p
            className={`mt-2 text-sm h-4 text-secondary ${
              !password && "invisible"
            }`}
          >
            {password}
          </p>
        </div>
        <button className="btn btn-primary" type="submit">
          Login
        </button>
      </Form>
    </div>
  );
}
