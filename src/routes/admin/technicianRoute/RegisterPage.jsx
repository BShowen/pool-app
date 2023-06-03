import { useLoaderData, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";

import { TechnicianForm } from "./technicianComponents/TechnicianForm";
import {
  GET_REGISTRATION_TECHNICIAN,
  REGISTER_TECHNICIAN,
} from "../../../queries/index.js";
import ErrorDisplay from "../../../components/ErrorDisplay";
import Loading from "../../../components/Loading";
import useInput from "../../../hooks/useInput";
import routes from "../../routeDefinitions";
import store from "../../../utils/store";
import { useEffect } from "react";

export async function loader({ request }) {
  const url = new URL(request.url);
  const [technicianId, registrationSecret] = url.searchParams
    .get("q")
    .split("-");
  return { technicianId, registrationSecret };
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const { technicianId, registrationSecret } = useLoaderData();
  const [technician, setTechnician] = useState({});

  const [registerTechnician, { loading: mutationLoading }] =
    useMutation(REGISTER_TECHNICIAN);

  const {
    loading: queryLoading,
    error: queryError,
    data: queryData,
  } = useQuery(GET_REGISTRATION_TECHNICIAN, {
    variables: {
      id: technicianId,
      secret: registrationSecret,
    },
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

  useEffect(() => {
    // Update form values when the technician is loaded from the query.
    if (queryData) {
      const { getRegistrationTechnician: technician } = queryData;
      setTechnician(technician);
      // For each field in the technician object...
      // Assign it's value to the formField for that field.
      for (const [key, value] of Object.entries(technician)) {
        // key is the formField. i.e firstName, emailAddress, etc.
        // value is the value  for that field.
        formFields[key] &&
          formFields[key].dispatch({ action: "SET_VALUE", value });
      }
    }
  }, [queryData]);

  const formFields = { firstName, lastName, emailAddress, password };

  if (queryLoading || mutationLoading) {
    return <Loading />;
  }

  if (queryError) {
    return <ErrorDisplay message={queryError.message} />;
  }

  return (
    <TechnicianForm
      canCancel={false}
      inputList={Object.values(formFields)}
      formTitle="Registration"
      onSubmit={async ({ formData }) => {
        const variables = { technician: { ...technician, ...formData } };
        try {
          await registerTechnician({ variables });
          // Technician was registered successfully. Save a success message and
          // redirect to login page.
          store.save(routes.login, "Registration successful.");
          return navigate(routes.login);
        } catch (error) {
          const errorObj = error?.graphQLErrors[0]?.extensions?.fields || {};
          for (const [key, value] of Object.entries(errorObj)) {
            // key is the formField. i.e firstName, emailAddress, etc.
            // value is the error message for that field.
            formFields[key].dispatch({ action: "SET_ERROR", value });
          }
        }
      }}
    />
  );
}
