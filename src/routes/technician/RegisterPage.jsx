import { useLoaderData, redirect } from "react-router-dom";

import {
  getRegistrationTechnician,
  registerTechnician,
} from "../../utils/apiFetches";
import TechnicianForm from "./components/TechnicianForm";
import ErrorDisplay from "../../components/ErrorDisplay";

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
  const { status, data, errors } = response;
  if (Number.parseInt(status) === 200) {
    return redirect("/login");
  } else {
    return errors;
  }
}
export default function RegisterPage() {
  const response = useLoaderData();
  const technician = response.data?.technician;
  const errors = response.errors;

  if (errors) {
    return <ErrorDisplay message={errors.message} />;
  } else {
    return (
      <TechnicianForm
        title="Registration"
        action=""
        technician={technician}
        errors={{}}
      />
    );
  }
}
