import { redirect, useActionData } from "react-router-dom";

import { createNewTechnician } from "../../utils/apiFetches";
import TechnicianForm from "./components/TechnicianForm";

export async function action({ request }) {
  const formData = await request.formData();
  const formObject = Object.fromEntries(formData);
  const { status, data, errors } = await createNewTechnician(formObject);
  if (status === 201) {
    return redirect(`/technicians/${data.technician.id}`);
  } else {
    return errors;
  }
}

export default function NewTechnicianPage() {
  const errors = useActionData() || {};
  return (
    <div className="w-full flex flex-row justify-center bg-white">
      <TechnicianForm
        title={"New technician"}
        action={"/technicians/new"}
        errors={errors}
      />
    </div>
  );
}
