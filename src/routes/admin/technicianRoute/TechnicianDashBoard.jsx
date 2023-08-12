import { useNavigate, useLoaderData } from "react-router-dom";
import { useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";

import { capitalizeName } from "../../../utils/formatters";
import routes from "../../routeDefinitions";
import { TECHNICIAN, GET_TECHNICIAN_LIST } from "../../../queries/index.js";
import { DELETE_TECHNICIAN } from "../../../queries/DELETE_TECHNICIAN";
import BannerAlert from "../../../components/BannerAlert";

export default function TechnicianDashboard() {
  const { technicianId } = useLoaderData();
  const { loading, error, data } = useQuery(TECHNICIAN, {
    variables: { id: technicianId },
  });

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Error...</p>;

  const { getTechnician: technician } = data;

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
          <EditTechnicianButton technician={technician} />
          <DeleteTechnicianButton technician={technician} />
        </div>
      </div>
    </div>
  );
}

function EditTechnicianButton({ technician }) {
  const navigate = useNavigate();
  return (
    <button
      className="btn btn-primary btn-md lg:btn-sm"
      onClick={() => {
        navigate(
          routes.getDynamicRoute({
            route: "editTechnician",
            id: technician.id,
          })
        );
      }}
    >
      Edit
    </button>
  );
}

function DeleteTechnicianButton({ technician }) {
  const [deleteTechnician, { data, error, loading }] = useMutation(
    DELETE_TECHNICIAN,
    {
      fetchPolicy: "no-cache",
      refetchQueries: [{ query: GET_TECHNICIAN_LIST }],
    }
  );

  // Redirect the user after successfully deleting technician
  useEffect(() => {
    if (data && data.deleteTechnician) {
      navigate(routes.technicians);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;

  return (
    <>
      {error && <BannerAlert message={error.message} />}
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
              console.log({ error });
            }
          }
        }}
      >
        Delete
      </button>
    </>
  );
}
