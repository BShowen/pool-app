import { Outlet } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";

import LoadingOverlay from "../../../components/LoadingOverlay";
import ErrorDisplay from "../../../components/ErrorDisplay";
import { CUSTOMER_TECHNICIAN_LIST } from "../../../queries/index.js";
export default function CustomersPage() {
  const { loading, error, data } = useQuery(CUSTOMER_TECHNICIAN_LIST);

  if (error) {
    return <ErrorDisplay message={error.message} />;
  }

  if (loading) {
    return <LoadingOverlay show={loading} />;
  }

  return <Outlet context={data} />;
}
