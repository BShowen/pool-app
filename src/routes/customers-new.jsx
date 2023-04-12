import { redirect, useActionData } from "react-router-dom";

import CustomerForm from "../components/CustomerForm";
import { createNewAccount } from "../utils/apiFetches";

export async function action({ request }) {
  const formData = await request.formData();
  const formObject = Object.fromEntries(formData);
  const { response, status } = await createNewAccount(formObject);
  if (status === 201) {
    return redirect(`/customers/${response.data._id}`);
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

export default function newCustomerForm() {
  const errors = useActionData() || {};
  return (
    <div className="w-full flex flex-row justify-center bg-white">
      <CustomerForm
        title={"New customer"}
        action={"/customers/new"}
        errors={errors}
      />
    </div>
  );
}
