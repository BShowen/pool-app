import { Outlet } from "react-router-dom";
import { useQuery } from "@apollo/client";

import Loading from "../../../components/Loading";
import ErrorDisplay from "../../../components/ErrorDisplay";
import { TECHNICIAN_LIST } from "../../../queries/index.js";

export default function TechniciansPage() {
  const { loading, error } = useQuery(TECHNICIAN_LIST);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorDisplay message={error.message} />;
  }

  return <Outlet />;
}
