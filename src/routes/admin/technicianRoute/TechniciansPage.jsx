import { Outlet, Await, defer, useLoaderData } from "react-router-dom";
import { Suspense } from "react";

import { getTechnicians } from "../../../utils/apiFetches";

import Loading from "../../../components/Loading";
import ErrorDisplay from "../../../components/ErrorDisplay";

export async function loader() {
  const response = getTechnicians();
  return defer({ response });
}
export default function TechniciansPage() {
  const { response } = useLoaderData();

  return (
    <Suspense fallback={<Loading />}>
      <Await
        resolve={response}
        errorElement={<ErrorDisplay message="Cannot load technician routes." />}
      >
        <Outlet />
      </Await>
    </Suspense>
  );
}
