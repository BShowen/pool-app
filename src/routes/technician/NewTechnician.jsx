import { redirect, useActionData } from "react-router-dom";

import { createNewTechnician } from "../../utils/apiFetches";
import TechnicianForm from "../../components/technician/TechnicianForm";

export async function action({ request }) {
  const formData = await request.formData();
  const formObject = Object.fromEntries(formData);
  const { response, status } = await createNewTechnician(formObject);
  console.log("response and status", response, status);
  if (status === 201) {
    return redirect(`/technicians/${response.data._id}`);
  } else {
    const errorsObject = {};
    response.errors.forEach((err) => {
      if (err.field.includes(".")) {
        const [_, index, field] = err.field.split(".");
        errorsObject.accountOwners = errorsObject.accountOwners || [];
        const subDocErrorsObject = errorsObject.accountOwners[index] || {};
        subDocErrorsObject[field] = err.message;
        errorsObject.accountOwners[index] = subDocErrorsObject;
      } else {
        errorsObject[err.field] = err.message;
      }
    });
    return errorsObject;
  }
}

export default function NewTechnicianForm() {
  const errors = useActionData() || {};
  console.log("Errors", errors);
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
