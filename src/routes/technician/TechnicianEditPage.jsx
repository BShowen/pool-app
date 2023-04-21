import { useActionData, redirect, useOutletContext } from "react-router-dom";

import { updateTechnician } from "../../utils/apiFetches";
import TechnicianForm from "./components/TechnicianForm";

export async function action({ request }) {
  const formData = await request.formData();
  const formObject = Object.fromEntries(formData);

  if (formObject.intent === "DELETE") {
    const { response, errors } = await deleteCustomer(formObject);
    if (response.status == "204") {
      return redirect("/customers");
    } else {
      console.log("error deleting customer", errors);
      return false;
    }
  } else {
    const { status, data, errors } = await updateTechnician(formObject);
    if (status === 200) {
      return redirect(`/technicians/${data._id}`);
    } else {
      return errors;
    }
  }
}
export default function TechnicianEditPage() {
  const technician = useOutletContext();
  const errors = useActionData() || {};

  return (
    <TechnicianForm
      title={"Edit customer"}
      technician={technician}
      action={`/technicians/${technician._id}/edit`}
      errors={errors}
    />
  );
}
