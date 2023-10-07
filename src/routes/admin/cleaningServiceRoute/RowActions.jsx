import { Form } from "react-router-dom";
import { useState, useEffect } from "react";
import { FiEdit3, FiDelete } from "react-icons/fi";
import { useMutation } from "@apollo/client";

import {
  DELETE_SERVICE,
  GET_SERVICE_LIST,
  UPDATE_SERVICE,
} from "../../../queries/index.js";
import { SpinnerOverlay } from "../../../components/SpinnerOverlay";

export function RowActions({ service }) {
  return (
    <td className="flex flex-row justify-center items-center md:justify-end gap-8 h-full">
      <EditButton service={{ ...service }} />
      <DeleteButton service={{ ...service }} />
    </td>
  );
}

function EditButton({ service }) {
  const [state, setState] = useState(false);
  return (
    <>
      <FiEdit3
        className="text-xl lg:text-2xl text-gray-800 hover:text-blue-500 hover:cursor-pointer"
        onClick={() => {
          setState(true);
        }}
      />
      <EditServiceModal
        service={{ ...service }}
        state={state}
        toggleState={() => {
          setState(!state);
        }}
      />
    </>
  );
}

function DeleteButton({ service }) {
  const [deleteService, { loading, error, data }] = useMutation(
    DELETE_SERVICE,
    { refetchQueries: [{ query: GET_SERVICE_LIST }] }
  );

  if (loading) {
    return <span className="loading loading-spinner loading-md"></span>;
  }

  return (
    <FiDelete
      className="text-xl lg:text-2xl text-gray-800 hover:text-pink-600 hover:cursor-pointer"
      onClick={async () => {
        await deleteService({ variables: { serviceId: service.id } });
      }}
    />
  );
}

function EditServiceModal({ service, state, toggleState }) {
  const [values, setValues] = useState({ ...service });
  const [errors, setErrors] = useState({});
  const [updateService, { loading, data, error }] = useMutation(
    UPDATE_SERVICE,
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
      setValues({ ...service }); // Set form values back to un-edited service
      setErrors({}); // Remove any errors.
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
          <h3 className="font-bold text-xl text-gray-800">Update service</h3>
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
                await updateService({
                  variables: {
                    input: { ...values },
                  },
                });
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
