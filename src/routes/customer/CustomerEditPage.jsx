import { useActionData, redirect, useOutletContext } from "react-router-dom";

import CustomerForm from "./components/CustomerForm";
import { deleteCustomer, updateCustomer } from "../../utils/apiFetches";

export async function action({ request }) {
  const formData = await request.formData();
  const formObject = Object.fromEntries(formData);
  formObject.customerAccountId = formObject._id;
  delete formObject._id;

  if (formObject.intent === "DELETE") {
    const { response, errors } = await deleteCustomer(formObject);
    if (response.status == "204") {
      return redirect("/customers");
    } else {
      console.log("error deleting customer", errors);
      return false;
    }
  } else {
    const { status, data, errors } = await updateCustomer(formObject);
    if (status === 200) {
      return redirect(`/customers/${data._id}`);
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
}
export default function CustomerEdit() {
  const { customerAccount } = useOutletContext();
  const errors = useActionData() || {};
  return (
    <CustomerForm
      title={"Edit customer"}
      customerAccount={customerAccount}
      action={`/customers/${customerAccount._id}/edit`}
      errors={errors}
    />
  );
}
