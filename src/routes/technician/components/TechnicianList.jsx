import { useAsyncValue, Link, useNavigate } from "react-router-dom";

import { capitalizeName } from "../../../utils/formatters";

import routes from "../../routeDefinitions";
export default function TechnicianList() {
  const { data, errors } = useAsyncValue();
  const navigate = useNavigate();
  const technicianList = data.technicianList;

  return (
    <>
      <div className="sticky p-1 lg:p-5 top-0 z-50 bg-white shadow-sm">
        <div className="w-full flex flex-row justify-center">
          <h1 className="text-3xl font-bold">Technicians</h1>
        </div>
        <div className="w-full p-5 lg:px-5 flex flex-row justify-end">
          <Link
            as="button"
            to="/technicians/new"
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
                  key={technician._id}
                  className="hover:cursor-pointer"
                  onClick={() => {
                    navigate(
                      routes.getDynamicRoute({
                        route: "technician",
                        id: technician._id,
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
