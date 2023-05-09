import { useFetcher } from "react-router-dom";
export default function TechnicianSelector({
  customerAccountId,
  technician,
  technicianList,
}) {
  const fetcher = useFetcher();

  /**
   * fetcher.formData is available when the form is submitting. Use that value
   * first to take advantage of optimistic UI. fetcher.data is what is the
   * finalized value returned from the backend server. fetcher.formData is not
   * available once fetcher.data is available. Use fetcher.data (finalized value)
   * once the request has completed. If either of these isn't available then
   * the user hasn't submitted a form and/or this is the initial render and we
   * use the value passed in from props.
   */
  const selectionValue =
    fetcher?.formData?.get("technicianId") ||
    fetcher?.data?.technicianId ||
    technician._id;

  function handleClick(e) {
    e.stopPropagation();
  }

  async function handleChange(e) {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.target.parentElement));
    fetcher.submit(formData, {
      method: "post",
    });
  }

  return (
    <div className="h-full flex flex-col justify-center" onClick={handleClick}>
      <fetcher.Form method="post">
        <input
          hidden
          readOnly
          name="customerAccountId"
          value={customerAccountId}
        />
        <select
          className="focus:outline-none focus:bg-transparent bg-transparent w-min hover:cursor-pointer"
          readOnly
          value={selectionValue}
          onChange={handleChange}
          name="technicianId"
        >
          <option disabled>Technicians</option>
          {technicianList.map((tech) => {
            return (
              <option key={tech._id} value={tech._id}>
                {tech.firstName}
              </option>
            );
          })}
          <option value="0">Unassigned</option>
        </select>
      </fetcher.Form>
    </div>
  );
}
