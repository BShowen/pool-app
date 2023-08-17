import { gql } from "@apollo/client";

export const GET_SERVICE_ROUTE_TODAY = gql`
  query GetServiceRouteToday {
    serviceRouteToday {
      technician {
        firstName
        lastName
      }
      count
      customerAccounts {
        accountName
        serviceType
        serviceDay
        serviceFrequency
        address
        price
        id
        accountOwners {
          firstName
          lastName
          emailAddress
          phoneNumber
          account
          id
        }
      }
    }
  }
`;
