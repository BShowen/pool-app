import { Outlet } from "react-router-dom";
import { useQuery } from "@apollo/client";

import { TECHNICIAN_LIST } from "../../../queries/index.js";

export default function TechniciansPage() {
  const { loading, error } = useQuery(TECHNICIAN_LIST);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error...</p>;
  }

  return <Outlet />;
}
