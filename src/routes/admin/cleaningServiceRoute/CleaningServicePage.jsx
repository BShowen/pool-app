import { capitalize } from "../../../utils/formatters";
import { useEffect, useState } from "react";
import { Form } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { GET_SERVICE_LIST, CREATE_SERVICE } from "../../../queries/index.js";
import { SpinnerOverlay } from "../../../components/SpinnerOverlay";
import { RowActions } from "./RowActions";

export function CleaningServicePage() {
  const { loading, data, error } = useQuery(GET_SERVICE_LIST);

  if (error) {
    return <p>Error...</p>;
  }

  const serviceList = data?.getAllServices || [];

  return (
    <>
      <div className="sticky p-1 lg:p-5 top-0 z-40 bg-white w-full">
        <div className="w-full flex flex-row justify-between items-center flex-wrap gap-4">
          <h1 className="text-2xl p-5 mx-auto lg:m-0 md:text-3xl font-bold">
            Pool cleaning services
          </h1>
          <button
            className="btn btn-info w-full md:w-auto btn-sm md:btn-md"
            onClick={() => {
              document.getElementById("my_modal_5").showModal();
            }}
          >
            Add new service
          </button>
        </div>
      </div>
      <div className="w-full h-full flex flex-col justify-start items-center p-0 md:px-5 relative">
        {loading && <SpinnerOverlay />}
        <table className="table h-min">
          {/* head */}
          <thead className="border-b-4">
            <tr>
              <th className="text-black w-9/12 text-start">Name</th>
              <th className="text-black w-3/12 text-center md:text-right md:pe-9">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="h-full">
            {serviceList.map((service, index) => {
              return (
                <tr className="hover" key={index}>
                  <CleaningService {...service} />
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <NewServiceModal />
    </>
  );
}

function CleaningService({ name, description, id }) {
  const serviceName = name
    .split(" ")
    .map((word) => capitalize(word))
    .join(" ");
  return (
    <>
      <td className="p-3">
        <div>
          <p className="text-lg lg:text-lg">{serviceName}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">{capitalize(description)}</p>
        </div>
      </td>
      <RowActions serviceId={id} />
    </>
  );
}

function NewServiceModal() {
  const [values, setValues] = useState({ name: "", description: "" });
  const [errors, setErrors] = useState({ fields: {} });
  const [createService, { loading, data, error }] = useMutation(
    CREATE_SERVICE,
    { refetchQueries: [{ query: GET_SERVICE_LIST }] }
  );

  useEffect(() => {
    // When the service has been submitted and the response is successful then
    // click the hidden button that closes the modal.
    if (data) {
      document.getElementById("close-modal").click(); // Close the modal window.
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      setErrors({ ...error.graphQLErrors[0].extensions });
    }
  }, [error]);

  return (
    <dialog id="my_modal_5" className="modal modal-bottom md:modal-middle">
      <div className="modal-box">
        <div className="w-full text-center">
          <h3 className="font-bold text-xl text-gray-800">Add a new service</h3>
        </div>
        <div className="modal-action relative p-1">
          {loading && <SpinnerOverlay />}
          <Form
            method="dialog"
            className="w-full flex flex-col gap-3"
            onSubmit={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              try {
                await createService({
                  variables: {
                    input: { ...values },
                  },
                });
                setValues({ name: "", description: "" });
                setErrors({ fields: {} });
              } catch (error) {
                return;
              }
            }}
          >
            <div>
              <label className="label">
                <span className="label-text">Service name</span>
              </label>
              <input
                type="text"
                placeholder="Service name"
                name="name"
                className={`input input-bordered w-full input-md ${
                  errors.fields?.name && "input-error"
                }`}
                value={values.name}
                onInput={(e) => {
                  setValues((prevState) => {
                    return { ...prevState, [e.target.name]: e.target.value };
                  });
                }}
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Service description</span>
              </label>
              <textarea
                className="textarea textarea-bordered w-full text-area-md"
                placeholder="Service description"
                name="description"
                value={values.description}
                onInput={(e) => {
                  setValues((prevState) => {
                    return { ...prevState, [e.target.name]: e.target.value };
                  });
                }}
              ></textarea>
            </div>
            <div>
              <button
                className="btn btn-info w-full btn-md text-gray-800"
                type="submit"
              >
                Save
              </button>
            </div>
          </Form>
        </div>
      </div>
      {/* This form enables closing the modal by clicking outside the modal */}
      <form method="dialog" className="modal-backdrop">
        <button id="close-modal"></button>
      </form>
    </dialog>
  );
}
