import { redirect, useActionData } from "react-router-dom";

import CustomerForm from "./customerComponents/CustomerForm";
import { createNewAccount } from "../../../utils/apiFetches";
import routes from "../../routeDefinitions";

export async function action({ request }) {
  const formData = await request.formData();
  const formObject = Object.fromEntries(formData);
  const { status, data: customer, errors } = await createNewAccount(formObject);
  if (status === 201) {
    return redirect(
      routes.getDynamicRoute({ route: "customer", id: customer._id })
    );
  } else {
    return errors;
  }
}

export default function NewCustomerPage() {
  const errors = useActionData() || {};
  return (
    <div className="w-full flex flex-row justify-center bg-white">
      <CustomerForm title={"New customer"} errors={errors} />
    </div>
  );
}
