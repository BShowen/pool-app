import { redirect, useActionData, useNavigation } from "react-router-dom";
import { useEffect } from "react";

import TechnicianForm from "./components/TechnicianForm";
import LoadingOverlay from "../../components/LoadingOverlay";
import { createNewTechnician } from "../../utils/apiFetches";
import useInput from "../../hooks/useInput";

export async function action({ request }) {
  const formData = await request.formData();
  const formObject = Object.fromEntries(formData);
  const { protocol, host } = window.location;
  // This is the url that brings the user from their email to the app.
  formObject.registrationUrl = `${protocol}//${host}/technicians/register`;
  const { status, data, errors } = await createNewTechnician(formObject);
  if (status === 201) {
    return redirect(`/technicians/${data.technician.id}`);
  } else {
    return errors;
  }
}

export default function NewTechnicianPage() {
  const errors = useActionData() || {};
  const navigation = useNavigation();

  const [firstName] = useInput({
    value: "",
    type: "text",
    name: "firstName",
    placeholder: "First name",
    labelValue: "First name",
    error: "First name is required",
    autoFocus: true,
  });

  const [lastName] = useInput({
    value: "",
    type: "text",
    name: "lastName",
    placeholder: "Last name",
    labelValue: "Last name",
    error: "Last name is required",
  });

  const [email, setEmailError] = useInput({
    value: "",
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
    <>
      {/* LoadingOverlay is conditionally rendered. Only when submitting. */}
      <LoadingOverlay />
      <TechnicianForm
        inputs={[firstName, lastName, email]}
        title={"New technician"}
      />
    </>
  );
  // }
}
