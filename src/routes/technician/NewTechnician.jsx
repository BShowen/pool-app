import { redirect, useActionData } from "react-router-dom";

import { createNewTechnician } from "../../utils/apiFetches";
import TechnicianForm from "../../components/technician/TechnicianForm";

export async function action({ request }) {
  const formData = await request.formData();
  const formObject = Object.fromEntries(formData);
  const { response, status } = await createNewTechnician(formObject);
  if (status === 201) {
    return redirect(`/technicians/${response.data.technician.id}`);
  } else {
    const errorsObject = {};
    response.errors.forEach((err) => {
      errorsObject[err.field] = err.message;
    });
    return errorsObject;
  }
}

export default function NewTechnicianForm() {
  const errors = useActionData() || {};
  return (
    <div className="w-full flex flex-row justify-center bg-white">
      <TechnicianForm
        title={"New technician"}
        action={"/technicians/new"}
        values={{}}
        errors={errors}
      />
    </div>
  );
}
