import { capitalize } from "../../../utils/formatters";
import { useEffect, useState } from "react";
import { Form } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { GET_SERVICE_LIST, CREATE_SERVICE } from "../../../queries/index.js";
import { SpinnerOverlay } from "../../../components/SpinnerOverlay";
import { RowActions } from "./RowActions";

export function CleaningServicePage() {
  const { loading, data, error } = useQuery(GET_SERVICE_LIST);

  // I want the new-service-modal window to be a controlled component.
  // newServiceModalState is a boolean. true if window is open, false if
  // window is closed
  const [newServiceModalState, setNewServiceModalState] = useState(false);

  useEffect(() => {
    return () => {};
  }, []);

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
              setNewServiceModalState(true);
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
      <NewServiceModal
        state={newServiceModalState}
        toggleState={() => {
          setNewServiceModalState(!newServiceModalState);
        }}
      />
    </>
  );
}

function CleaningService({ id, name, description }) {
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
      <RowActions service={{ id, name, description }} />
    </>
  );
}

function NewServiceModal({ state, toggleState }) {
  const [values, setValues] = useState({ name: "", description: "" });
  const [errors, setErrors] = useState({});
  const [createService, { loading, data, error }] = useMutation(
    CREATE_SERVICE,
    { refetchQueries: [{ query: GET_SERVICE_LIST }] }
  );

  useEffect(() => {
    // When the service has been submitted and the response is successful then
    // click the hidden button that closes the modal.
    if (data) {
      toggleState(); //Close the modal window
    }
  }, [data]);

  useEffect(() => {
    // Highlight any errors on the form
    if (error) {
      setErrors({ ...(error.graphQLErrors[0].extensions?.fields || {}) });
      setValues((prevState) => {
        return {
          ...prevState,
          name: prevState?.name?.trim() || "",
          description: prevState?.description?.trim() || "",
        };
      });
    }
  }, [error]);

  useEffect(() => {
    // This component is not "mounted/unmounted" because it is a modal window.
    // Rather, this component toggles between a hidden/not-hidden state.
    // So, this useEffect hook serves as the "mount/unmount" setup/teardown method.
    if (state) {
      // On mount (when state is "true")
      document.addEventListener("keydown", closeOnKeydown);
    } else {
      // On unmount (when state is "false")
      document.removeEventListener("keydown", closeOnKeydown);
      setValues({ name: "", description: "" });
      setErrors({});
    }
  }, [state]);

  function closeOnKeydown(e) {
    if (e.code === "Escape") {
      toggleState();
    }
  }

  return (
    <dialog
      id="create-service-modal"
      className={`modal modal-bottom md:modal-middle backdrop-blur-sm ${
        state ? "modal-open" : ""
      }`}
    >
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
                setErrors({});
              } catch (error) {
                return;
              }
            }}
          >
            <div>
              <label className="label">
                <span
                  className={`label-text ${errors?.name ? "text-red-500" : ""}`}
                >
                  {errors?.name ? errors.name : "Service name"}
                </span>
              </label>
              <input
                type="text"
                placeholder="Service name"
                name="name"
                className={`input input-bordered w-full input-md ${
                  errors?.name && "input-error"
                }`}
                value={values.name}
                onInput={(e) => {
                  setValues((prevState) => {
                    return { ...prevState, [e.target.name]: e.target.value };
                  });
                }}
                required
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
      {/* This div enables closing the modal by clicking outside the modal */}
      <div className="modal-backdrop" onClick={() => toggleState()}></div>
    </dialog>
  );
}
