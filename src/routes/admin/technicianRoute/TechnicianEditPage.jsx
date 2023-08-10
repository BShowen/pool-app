import { useNavigate, useLoaderData } from "react-router-dom";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";

import useInput from "../../../hooks/useInput";
import routes from "../../routeDefinitions";
import { TECHNICIAN, UPDATE_TECHNICIAN } from "../../../queries";
import { TechnicianForm } from "./technicianComponents/TechnicianForm.jsx";

export default function TechnicianEditPage() {
  const navigate = useNavigate();
  const { technicianId } = useLoaderData();
  const { loading, data, error } = useQuery(TECHNICIAN, {
    variables: { id: technicianId },
  });

  const [updateTechnician, { data: submitData, loading: submitLoading }] =
    useMutation(UPDATE_TECHNICIAN);
  const [technician, setTechnician] = useState({});

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

  useEffect(() => {
    // Once the technician is loaded, update the form values.
    // The form values are empty on initial load while the technician gets
    // fetched.
    if (data) {
      const technician = { ...data.getTechnician };
      setTechnician(technician);
      // For each field in the data.getTechnician object...
      // Assign it's value to the formField for that field.
      for (const [key, value] of Object.entries(technician)) {
        // key is the formField. i.e firstName, emailAddress, etc.
        // value is the value  for that field.
        formFields[key] &&
          formFields[key].dispatch({ action: "SET_VALUE", value });
      }
    }
  }, [data]);

  useEffect(() => {
    // Redirect the user to the technician page after successful submission
    if (submitData) {
      const technicianId = submitData.updateTechnician.id;
      navigate(
        routes.getDynamicRoute({ route: "technician", id: technicianId })
      );
    }
  }, [submitData]);

  async function handleSubmit() {
    const isValid = !Object.values(formFields)
      .map((input) => input.validate())
      .includes(false);

    if (!isValid) return;

    const updateTechnicianInput = {
      ...technician,
      firstName: firstName.input.value,
      lastName: lastName.input.value,
      emailAddress: emailAddress.input.value,
    };

    try {
      await updateTechnician({ variables: { updateTechnicianInput } });
    } catch (error) {
      const errorObj = error?.graphQLErrors[0]?.extensions?.fields;
      for (const [key, value] of Object.entries(errorObj)) {
        // key is the formField. i.e firstName, emailAddress, etc.
        // value is the error message for that field.
        formFields[key].dispatch({ action: "SET_ERROR", value });
      }
    }
  }

  if (loading || submitLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error...</p>;
  }

  return (
    <TechnicianForm
      inputList={Object.values(formFields)}
      formTitle={"Edit technician"}
      onSubmit={handleSubmit}
    />
  );
}
