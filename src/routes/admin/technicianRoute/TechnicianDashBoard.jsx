import { useNavigate, useLoaderData } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";

import { capitalizeName } from "../../../utils/formatters";
import routes from "../../routeDefinitions";
import { TECHNICIAN, GET_TECHNICIAN_LIST } from "../../../queries/index.js";
import { DELETE_TECHNICIAN } from "../../../queries/DELETE_TECHNICIAN";
import BannerAlert from "../../../components/BannerAlert";
import store from "../../../utils/store";

export default function TechnicianDashboard() {
  // -----------------------------------------------------------------
  // This is a message that is displayed when a technician has been updated.
  const [message] = store.get();
  useEffect(() => {
    return () => {
      // Clear the store only when unmounting.
      store.clear();
    };
  });
  // -----------------------------------------------------------------

  const navigate = useNavigate();
  const [replace, setReplace] = useState(false);
  const [
    deleteTechnician,
    { data: mutationData, error: mutationError, loading: mutationLoading },
  ] = useMutation(DELETE_TECHNICIAN, {
    fetchPolicy: "no-cache",
    refetchQueries: [{ query: GET_TECHNICIAN_LIST }],
  });
  const { technicianId } = useLoaderData();
  const {
    loading: queryLoading,
    error: queryError,
    data: queryData,
  } = useQuery(TECHNICIAN, {
    variables: { id: technicianId },
  });

  useEffect(() => {
    if (mutationData) {
      if (mutationData?.deleteTechnician === true) {
        navigate(routes.technicians);
      }
    }
  }, [mutationData]);

  if (queryLoading || mutationLoading) {
    return <p>Loading...</p>;
  }

  if (queryError) {
    return <p>Error...</p>;
  }

  const { getTechnician: technician } = queryData;

  return (
    <>
      {mutationError && <BannerAlert message={mutationError.message} />}
      {message && <BannerAlert message={message} />}
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
                navigate(
                  routes.getDynamicRoute({
                    route: "editTechnician",
                    id: technician.id,
                  }),
                  { replace }
                );
              }}
            >
              Edit
            </button>
            <button
              className="btn btn-error btn-md lg:btn-sm"
              onClick={async () => {
                const canDelete = confirm(
                  `Delete ${capitalizeName(
                    technician.firstName,
                    technician.lastName
                  )}?`
                );
                if (canDelete) {
                  try {
                    await deleteTechnician({
                      variables: { technicianId: technician.id },
                    });
                  } catch (error) {
                    console.log("Error deleting technician: ", error.message);
                  }
                }
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
