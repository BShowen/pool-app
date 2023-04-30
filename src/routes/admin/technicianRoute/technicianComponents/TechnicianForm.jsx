import { Form, useNavigate, useSubmit } from "react-router-dom";
export default function TechnicianForm({ inputs, title, technician }) {
  const navigate = useNavigate();
  const submit = useSubmit();

  function handleSubmit(e) {
    e.preventDefault();

    const isValid = !inputs.map((input) => input.validate()).includes(false);

    if (isValid) {
      const formData = new FormData(e.currentTarget);
      if (technician) {
        // If technician is truthy then we are editing a technician
        // and not creating a new one.
        formData.set("technicianId", technician._id);
      }
      return submit(formData, { method: "post" });
    }
  }

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