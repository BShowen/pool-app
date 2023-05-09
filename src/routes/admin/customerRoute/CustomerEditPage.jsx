import { useActionData, redirect, useOutletContext } from "react-router-dom";

import CustomerForm from "./customerComponents/CustomerForm";
import { deleteCustomer, updateCustomer } from "../../../utils/apiFetches";
import routes from "../../routeDefinitions";

export async function action({ request }) {
  const formData = await request.formData();
  const formObject = Object.fromEntries(formData);
  formObject.customerAccountId = formObject._id;
  delete formObject._id;

  if (formObject.intent === "DELETE") {
    const { response, errors } = await deleteCustomer(formObject);
    if (response.status == "204") {
      return redirect(routes.customers);
    } else {
      console.log("error deleting customer", errors);
      return false;
    }
  } else {
    const { status, data, errors } = await updateCustomer(formObject);
    if (status === 200) {
      return redirect(
        routes.getDynamicRoute({ route: "customer", id: data._id })
      );
    } else {
      return errors;
    }
  }
}
export default function CustomerEdit() {
  const { customerAccount } = useOutletContext();
  const errors = useActionData() || {};
  return (
    <CustomerForm
      title={"Edit customer"}
      customerAccount={{
        ...customerAccount,
        technicianId: customerAccount.technicianId._id,
      }}
      errors={errors}
    />
  );
}
