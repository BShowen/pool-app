import { useSubmit, useNavigate, useOutletContext } from "react-router-dom";
import { useState } from "react";
import { capitalizeName } from "../../utils/formatters";

export default function TechnicianDashboard() {
  const submit = useSubmit();
  const navigate = useNavigate();
  const [replace, setReplace] = useState(false);
  const technician = useOutletContext();

  return (
    <div className="card bg-base-100 w-full lg:w-3/5 lg:shadow-lg">
      <div className="card-body card-compact flex flex-col lg:flex-row lg:justify-around lg:flex-wrap">
        <div className="card">
          <div className="card-body card-compact">
            <h1 className="card-title">Contact information</h1>

            <div className="py-2">
              <p className="font-semibold">
                {capitalizeName(technician.firstName, technician.lastName)}
              </p>
              <p>{technician.emailAddress}</p>
            </div>
          </div>
        </div>

        <div className="card-actions justify-end w-full">
          <button
            className="btn btn-primary btn-md lg:btn-sm"
            onClick={() => {
              if (!replace) {
                setReplace(true);
              }
              navigate(`/technicians/${technician._id}/edit`, { replace });
            }}
          >
            Edit
          </button>
          <button
            className="btn btn-error btn-md lg:btn-sm"
            onClick={() => {
              let canDelete = confirm(
                `Delete ${capitalizeName(
                  technician.firstName,
                  technician.lastName
                )}?`
              );
              if (canDelete) {
                const formData = new FormData();
                formData.set("_id", technician._id);
                formData.set("intent", "DELETE");
                submit(formData, {
                  method: "post",
                  action: `/technicians/${technician._d}/edit`,
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
