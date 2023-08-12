import { useQuery } from "@apollo/client";

import { GET_SERVICE_ROUTES } from "../../../queries/index.js";

export function AdminDashboard() {
  const { loading, error, data } = useQuery(GET_SERVICE_ROUTES);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error...</p>;
  }

  console.log({ data });
  return (
    <div className="w-full flex flex-col flex-wrap justify-start items-center">
      <p>Admin dashboard</p>
    </div>
  );
}
