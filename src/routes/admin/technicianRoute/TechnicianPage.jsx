import { useLoaderData, Outlet } from "react-router-dom";
import { useQuery } from "@apollo/client";

import TechnicianTopNav from "./technicianComponents/TechnicianTopNav";
import { capitalizeName } from "../../../utils/formatters";

import { TECHNICIAN } from "../../../queries/index.js";
import Loading from "../../../components/LoadingOverlay";
import ErrorDisplay from "../../../components/ErrorDisplay";
export async function loader({ params }) {
  return { technicianId: params.technicianId };
}
export default function TechnicianPage() {
  const { technicianId } = useLoaderData();
  const { loading, error, data } = useQuery(TECHNICIAN, {
    variables: { id: technicianId },
  });

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorDisplay message={error.message} />;
  }

  const { getTechnician: technicianAccount } = data;

  return (
    <div className="w-full flex flex-col flex-wrap justify-start">
      {/* Page container */}

      {/* Page header */}
      <div className="w-full flex flex-col gap-5 justify-center items-center sticky top-0 bg-white z-50 p-5">
        <div>
          <h1 className="text-3xl mx-auto">
            {capitalizeName(
              technicianAccount.firstName,
              technicianAccount.lastName
            )}
          </h1>
        </div>
        <div className="w-full flex flex-row justify-center p-1">
          <TechnicianTopNav />
        </div>
      </div>

      {/* Page body */}
      <div className="w-full flex flex-col justify-start items-center pt-5">
        <Outlet context={technicianAccount} />
      </div>
    </div>
  );
}
