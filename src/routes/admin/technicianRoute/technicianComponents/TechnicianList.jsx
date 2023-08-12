import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";

import { capitalizeName } from "../../../../utils/formatters";
import { GET_TECHNICIAN_LIST } from "../../../../queries/index.js";

import routes from "../../../routeDefinitions";
export default function TechnicianList() {
  const { loading, data, error } = useQuery(GET_TECHNICIAN_LIST);
  const navigate = useNavigate();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error...</p>;

  const { technicianList } = data;
  return (
    <>
      <div className="sticky p-1 lg:p-5 top-0 z-50 bg-white shadow-sm">
        <div className="w-full flex flex-row justify-center">
          <h1 className="text-3xl font-bold">Technicians</h1>
        </div>
        <div className="w-full p-5 lg:px-5 flex flex-row justify-end">
          <Link
            as="button"
            to={routes.newTechnician}
            className="btn btn-primary btn-sm lg:btn-md"
          >
            New technician
          </Link>
        </div>
      </div>
      <div className="overflow-x-auto w-full pt-5">
        <div className="p-2">
          <span className="badge badge-primary p-3">
            {technicianList.length} technicians
          </span>
        </div>
        <table className="table w-full">
          <tbody>
            {technicianList.map((technician) => {
              return (
                <tr
                  key={technician.id}
                  className="hover:cursor-pointer"
                  onClick={() => {
                    navigate(
                      routes.getDynamicRoute({
                        route: "technician",
                        id: technician.id,
                      })
                    );
                  }}
                >
                  <td className="hover:bg-gray-50">
                    {capitalizeName(technician.firstName, technician.lastName)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
