import { useQuery } from "@apollo/client";

import Loading from "../../../components/Loading";
import ErrorDisplay from "../../../components/ErrorDisplay";
import { GET_SERVICE_ROUTE } from "../../../queries/index.js";

export function AdminDashboard() {
  const { loading, error, data } = useQuery(GET_SERVICE_ROUTE);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorDisplay message={error.message} />;
  }

  console.log({ data });
  return (
    <div className="w-full flex flex-col flex-wrap justify-start items-center">
      <p>Admin dashboard</p>
    </div>
  );
}
