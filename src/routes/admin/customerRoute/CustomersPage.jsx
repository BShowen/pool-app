import { Outlet } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";

import LoadingOverlay from "../../../components/LoadingOverlay";
import ErrorDisplay from "../../../components/ErrorDisplay";

const QUERY = gql`
  query Query {
    getCustomerAccountList {
      accountName
      accountOwners {
        emailAddress
        firstName
        lastName
        phoneNumber
      }
      address
      companyId
      id
      price
      serviceDay
      serviceFrequency
      serviceType
      technician {
        id
        firstName
        lastName
      }
    }
    getTechnicianList {
      companyId
      emailAddress
      lastName
      id
      firstName
      password
    }
  }
`;
export default function CustomersPage() {
  const { loading, error, data } = useQuery(QUERY);

  if (error) {
    return <ErrorDisplay message={error.message} />;
  }

  if (loading) {
    return <LoadingOverlay show={loading} />;
  }

  return <Outlet context={data} />;
}
