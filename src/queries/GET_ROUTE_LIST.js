import { gql } from "@apollo/client";

export const GET_ROUTE_LIST = gql`
  query getServiceRouteList {
    getServiceRouteList {
      technician {
        firstName
        id
        lastName
      }
      customerAccounts {
        accountName
        serviceDay
        id
      }
      count
    }
  }
`;
