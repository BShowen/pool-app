import { Form } from "react-router-dom";
import { useRef } from "react";

import { updateCustomer } from "../../../../utils/apiFetches";

async function action({ technicianId, customerAccountId }) {
  const response = updateCustomer({ technicianId, customerAccountId });
}
export default function TechnicianSelector({
  customerAccountId,
  technician,
  technicianList,
}) {
  const form = useRef(null);

  function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function handleSubmit() {
    const formData = new FormData(form.current);
    const formObject = Object.fromEntries(formData);
    action(formObject);
  }

  return (
    <div className="h-full" onClick={handleClick}>
      <Form meth="post" ref={form}>
        <input
          hidden
          readOnly
          name="customerAccountId"
          value={customerAccountId}
        />
        <select
          className="select select-ghost w-full max-w-xs"
          defaultValue={technician?._id || 0}
          onChange={handleSubmit}
          name="technicianId"
        >
          <option disabled>Technicians</option>
          {technicianList.map((technician) => {
            return (
              <option key={technician._id} value={technician._id}>
                {technician.firstName}
              </option>
            );
          })}
          <option value="0">Unassigned</option>
        </select>
      </Form>
    </div>
  );
}
