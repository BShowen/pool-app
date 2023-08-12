import { gql } from "@apollo/client";

export const GET_ALL_SERVICE_ROUTES = gql`
  query ServiceRouteAll {
    serviceRouteAll {
      technician {
        id
        firstName
        lastName
        emailAddress
        roles
      }
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
      count
    }
  }
`;
