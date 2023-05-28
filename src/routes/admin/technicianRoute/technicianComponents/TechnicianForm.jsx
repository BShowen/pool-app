import { useMutation } from "@apollo/client";
import { Form, useNavigate } from "react-router-dom";
import { UPDATE_TECHNICIAN } from "../../../../queries/UPDATE_TECHNICIAN";
import { useEffect } from "react";
import routes from "../../../routeDefinitions";
import store from "../../../../utils/store";
export default function TechnicianForm({ inputs, title, technician }) {
  const navigate = useNavigate();
  const [
    updateTechnician,
    { data: updateData, loading: updateLoading, error: updateError },
  ] = useMutation(UPDATE_TECHNICIAN);
  // const [
  //   createNewTechnician,
  //   { data: creationData, loading: creationLoading, error: creationError },
  // ] = useMutation(UPDATE_TECHNICIAN);

  async function handleSubmit(e) {
    e.preventDefault();

    const isValid = !inputs.map((input) => input.validate()).includes(false);

    if (isValid) {
      const formData = new FormData(e.currentTarget);
      const formDataObject = Object.fromEntries(formData);
      if (technician) {
        // We are updating a technician
        formDataObject["id"] = technician.id;
        const variables = { updateTechnicianInput: { ...formDataObject } };
        try {
          await updateTechnician({ variables });
        } catch (error) {
          console.log("Error updating technician: ", error.message);
        }
      } else {
        console.log("Creating new technician...");
        // We are creating a new technician.
        // const variables = { technician: { ...formDataObject } };

        // try {
        //   await createNewTechnician({ variables });
        // } catch (error) {
        //   console.log("Error creating technician: ", error.message);
        // }
      }
    }
  }

  useEffect(() => {
    if (updateData) {
      // Redirect the user to the technician dashboard.

      // The url to redirect to.
      const redirectUrl = routes.getDynamicRoute({
        route: "technician",
        id: updateData.updateTechnician.id,
      });
      // The message to be displayed when the technician dashboard loads.
      store.save(redirectUrl, "Technician updated successfully.");
      // Redirect the user.
      navigate(redirectUrl);
    }
  }, [updateData]);
  return (
    <Form
      className="flex flex-col w-full px-5"
      method="post"
      onSubmit={handleSubmit}
    >
      <div>
        <div className="p-1 lg:p-5 h-24 w-full flex flex-row justify-center items-baseline">
          <h1 className="text-3xl font-bold">{title}</h1>
        </div>

        <div className="w-full flex flex-col gap-10 lg:w-1/4 lg:mx-auto lg:pb-40">
          <div className="w-full rounded-lg px-2 py-3 bg-slate-100">
            {inputs.map((input, index) => (
              <div key={index}>
                <label className="label">
                  <span className={`label-text ${input.label.className}`}>
                    {input.label.value}
                  </span>
                </label>
                <input {...input.input} />
              </div>
            ))}
          </div>

          <div className="w-full flex flex-col justify-start gap-3">
            <div className="divider !p-0 !m-0"></div>
            <div className="flex gap-2 justify-evenly">
              <button className="btn btn-primary w-2/4" type="submit">
                Submit
              </button>
              <button
                className="btn btn-error w-2/4"
                type="button"
                onClick={() => {
                  navigate(-1);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </Form>
  );
}
