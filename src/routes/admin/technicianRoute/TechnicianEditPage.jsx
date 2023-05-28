import { useActionData, redirect, useLoaderData } from "react-router-dom";
import { useEffect } from "react";
import { useQuery } from "@apollo/client";

import TechnicianForm from "./technicianComponents/TechnicianForm";
import useInput from "../../../hooks/useInput";
import routes from "../../routeDefinitions";
import { TECHNICIAN } from "../../../queries";
import Loading from "../../../components/Loading";
import ErrorDisplay from "../../../components/ErrorDisplay";

export default function TechnicianEditPage() {
  const { technicianId } = useLoaderData();
  const { loading, data, error } = useQuery(TECHNICIAN, {
    variables: { id: technicianId },
  });

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorDisplay message={error.message} />;
  }

  const { getTechnician: technician } = data;

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

  // useEffect(() => {
  //   if (error.emailAddress) {
  //     setEmailError(error.emailAddress);
  //   }
  // }, [error]);

  return (
    <TechnicianForm
      title={"Edit customer"}
      technician={technician}
      errors={error}
      inputs={[firstName, lastName, email]}
    />
  );
}
