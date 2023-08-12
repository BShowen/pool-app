import { useMutation } from "@apollo/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { TechnicianForm } from "./technicianComponents/TechnicianForm";
import {
  CREATE_TECHNICIAN,
  GET_TECHNICIAN_LIST,
} from "../../../queries/index.js";
import useInput from "../../../hooks/useInput";
import routes from "../../routeDefinitions";

export default function NewTechnicianPage() {
  const navigate = useNavigate();
  const [createTechnician, { loading, data }] = useMutation(CREATE_TECHNICIAN, {
    refetchQueries: [{ query: GET_TECHNICIAN_LIST }],
  });

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

  const [emailAddress] = useInput({
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

  const formFields = { firstName, lastName, emailAddress };

  async function handleSubmit({ formData }) {
    const isValid = !Object.values(formFields)
      .map((input) => input.validate())
      .includes(false);
    if (!isValid) return;
    const { protocol, host } = window.location;
    const variables = { technician: { ...formData } };
    // ---------------------------------------------------------------
    // This is the url that brings the user from their email to the app.
    // This string is not persisted in the DB. It is used in the backend
    // and data is appended to this string before an email is sent to the
    // technician with this url as a link within the email.
    variables.technician.registrationUrl = `${protocol}//${host}${routes.registerTechnician}`;
    // ---------------------------------------------------------------
    try {
      await createTechnician({ variables });
    } catch (error) {
      const errorObj = error.graphQLErrors[0].extensions.fields;
      for (const [key, value] of Object.entries(errorObj)) {
        // key is the formField. i.e firstName, emailAddress, etc.
        // value is the error message for that field.
        formFields[key].dispatch({ action: "SET_ERROR", value });
      }
    }
  }

  useEffect(() => {
    // Redirect to the technician page after a successful submission.
    if (data) {
      const technicianId = data.createNewTechnician.id;
      navigate(
        routes.getDynamicRoute({ route: "technician", id: technicianId })
      );
    }
  }, [data]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <TechnicianForm
      inputList={Object.values(formFields)}
      formTitle={"New technician"}
      onSubmit={handleSubmit}
    />
  );
}
