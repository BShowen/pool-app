import { useActionData, redirect, useOutletContext } from "react-router-dom";
import { useEffect } from "react";

import { updateTechnician, deleteTechnician } from "../../../utils/apiFetches";
import TechnicianForm from "./technicianComponents/TechnicianForm";
import useInput from "../../../hooks/useInput";
import routes from "../../routeDefinitions";
export async function action({ request }) {
  const formData = await request.formData();
  const formObject = Object.fromEntries(formData);

  if (formObject.intent === "DELETE") {
    const { response, errors } = await deleteTechnician({
      technicianId: formObject.technicianId,
    });
    if (response.status == "204") {
      return redirect(routes.technicians);
    } else {
      console.log("error deleting customer", errors);
      return false;
    }
  } else {
    const { status, data, errors } = await updateTechnician(formObject);
    if (status === 200) {
      return redirect(
        routes.getDynamicRoute({ route: "technician", id: data._id })
      );
    } else {
      return errors;
    }
  }
}
export default function TechnicianEditPage() {
  const technician = useOutletContext();
  const errors = useActionData() || {};
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

  const [email, setEmailError] = useInput({
    value: technician.emailAddress,
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

  useEffect(() => {
    if (errors.emailAddress) {
      setEmailError(errors.emailAddress);
    }
  }, [errors]);

  return (
    <TechnicianForm
      title={"Edit customer"}
      technician={technician}
      errors={errors}
      inputs={[firstName, lastName, email]}
    />
  );
}
