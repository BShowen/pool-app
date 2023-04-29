import { useLoaderData, redirect } from "react-router-dom";

import {
  getRegistrationTechnician,
  registerTechnician,
} from "../../../utils/apiFetches";
import TechnicianForm from "./technicianComponents/TechnicianForm";
import ErrorDisplay from "../../../components/ErrorDisplay";
import useInput from "../../../hooks/useInput";
import routes from "../../routeDefinitions";
import store from "../../../utils/store";

export async function loader({ request }) {
  const url = new URL(request.url);
  const [technicianId, registrationSecret] = url.searchParams
    .get("q")
    .split("-");
  const response = await getRegistrationTechnician({
    technicianId,
    registrationSecret,
  });
  return response;
}

export async function action({ request }) {
  const formData = await request.formData();
  const formObject = Object.fromEntries(formData);
  const url = new URL(request.url);
  const [_, registrationSecret] = url.searchParams.get("q").split("-");
  const response = await registerTechnician({
    ...formObject,
    registrationSecret,
  });
  const { status, errors } = response;
  if (Number.parseInt(status) === 204) {
    store.save(routes.login, "Registration successful.");
    return redirect(routes.login);
  } else {
    return errors;
  }
}
export default function RegisterPage() {
  const response = useLoaderData();
  const technician = response.data?.technician || {};
  const loaderError = response.loaderError;

  const [firstName] = useInput({
    value: technician.firstName,
    type: "text",
    name: "firstName",
    placeholder: "First name",
    labelValue: "First name",
    error: "First name is required",
    autoFocus: true,
  });

  const [lastName] = useInput({
    value: technician.lastName,
    type: "text",
    name: "lastName",
    placeholder: "Last name",
    labelValue: "Last name",
    error: "Last name is required",
  });

  const [email] = useInput({
    value: technician.emailAddress,
    type: "email",
    name: "emailAddress",
    placeholder: "Email address",
    labelValue: "Email",
    error: "Email is invalid",
    disabled: true,
    validator: function () {
      return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
        this.value.trim()
      );
    },
  });

  const [password] = useInput({
    value: "",
    type: "password",
    name: "password",
    placeholder: "Password",
    labelValue: "Password",
    error: "Password is required",
  });

  if (loaderError) {
    return <ErrorDisplay message={loaderError.message} />;
  } else {
    return (
      <TechnicianForm
        title="Registration"
        technician={technician}
        errors={{}}
        inputs={[firstName, lastName, email, password]}
      />
    );
  }
}
