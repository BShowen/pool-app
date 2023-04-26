import { Await, Outlet, defer, useLoaderData } from "react-router-dom";
import { Suspense } from "react";

import { getCustomers } from "../../../utils/apiFetches";

import Loading from "../../../components/Loading";
import ErrorDisplay from "../../../components/ErrorDisplay";

export async function loader() {
  const response = getCustomers();
  return defer({
    response,
  });
}
export default function CustomersPage() {
  const { response } = useLoaderData();
  return (
    <Suspense fallback={<Loading />}>
      <Await
        resolve={response}
        errorElement={<ErrorDisplay message="Cannot load customers" />}
      >
        <Outlet />
      </Await>
    </Suspense>
  );
}
