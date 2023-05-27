import { Outlet } from "react-router-dom";
import { useQuery } from "@apollo/client";

import LoadingOverlay from "../../../components/LoadingOverlay";
import ErrorDisplay from "../../../components/ErrorDisplay";
import { CUSTOMER_TECHNICIAN_LIST } from "../../../queries/index.js";
export default function CustomersPage() {
  /**
   * Get a list of customer accounts and a list of technician accounts.
   * This data is cached automatically by ApolloClient.
   *
   * Components rendered in <Outlet /> will issue queries. ApolloClient will
   * see these queries and fetch the data from the cache first. If the data
   * isn't in the cache then ApolloClient will send the query to the backend.
   * I'm taking advantage of ApolloClient's caching so that I don't have to pass
   * data into child components using props, like I was doing initially. Passing
   * data down as props lead to stale data/UI.
   */
  const { loading, error } = useQuery(CUSTOMER_TECHNICIAN_LIST);

  if (error) {
    return <ErrorDisplay message={error.message} />;
  }

  if (loading) {
    return <LoadingOverlay show={loading} />;
  }

  return <Outlet />;
}
