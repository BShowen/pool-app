import { redirect, useActionData } from "react-router-dom";

import CustomerForm from "../../components/customer/CustomerForm";
import { createNewAccount } from "../../utils/apiFetches";

export async function action({ request }) {
  const formData = await request.formData();
  const formObject = Object.fromEntries(formData);
  const { status, data: customer, errors } = await createNewAccount(formObject);
  if (status === 201) {
    return redirect(`/customers/${customer._id}`);
  } else {
    return errors;
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
