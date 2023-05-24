import { useSubmit, useNavigate, useOutletContext } from "react-router-dom";
import { useState } from "react";
import {
  capitalizeName,
  formatAccountName,
} from "../../../../utils/formatters";
import routes from "../../../routeDefinitions";
export default function CustomerDashboard() {
  const submit = useSubmit();
  const navigate = useNavigate();
  const [replace, setReplace] = useState(false);
  const { customerAccount } = useOutletContext();

  return (
    <div className="card bg-base-100 w-full lg:w-3/5 lg:shadow-lg">
      <div className="card-body card-compact flex flex-col lg:flex-row lg:justify-around lg:flex-wrap">
        <div className="card">
          <div className="card-body card-compact">
            <h1 className="card-title">Contacts</h1>
            {customerAccount.accountOwners.map((contact) => {
              return (
                <div key={contact.id} className="py-2">
                  <p className="font-semibold">
                    {capitalizeName(contact.firstName, contact.lastName)}
                  </p>
                  <p>{contact.emailAddress}</p>
                  <p>{contact.phoneNumber}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <div className="card-body card-compact">
            <h1 className="card-title">Address</h1>
            <p>{customerAccount.address}</p>
          </div>
        </div>

        <div className="card">
          <div className="card-body card-compact">
            <h1 className="card-title">Service</h1>
            <p>
              <span className="font-semibold">Type:</span>{" "}
              {customerAccount.serviceType}
            </p>
            <p>
              <span className="font-semibold">Frequency:</span>{" "}
              {customerAccount.serviceFrequency}
            </p>
            <p>
              <span className="font-semibold">Day:</span>{" "}
              {customerAccount.serviceDay}
            </p>
            <p>
              <span className="font-semibold">Price:</span>{" "}
              {customerAccount.price}
            </p>
          </div>
        </div>

        <div className="card-actions justify-end w-full">
          <button
            className="btn btn-primary btn-md lg:btn-sm"
            onClick={() => {
              if (!replace) {
                setReplace(true);
              }
              navigate(
                routes.getDynamicRoute({
                  route: "editCustomer",
                  id: customerAccount.id,
                }),
                { replace }
              );
            }}
          >
            Edit
          </button>
          <button
            className="btn btn-error btn-md lg:btn-sm"
            onClick={() => {
              let canDelete = confirm(
                `Delete ${formatAccountName(customerAccount.accountName)}?`
              );
              if (canDelete) {
                const formData = new FormData();
                formData.set("_id", customerAccount._id);
                formData.set("intent", "DELETE");
                submit(formData, {
                  method: "post",
                  action: routes.getDynamicRoute({
                    route: "editCustomer",
                    id: customerAccount._id,
                  }),
                });
              }
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
