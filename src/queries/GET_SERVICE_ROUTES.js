import { gql } from "@apollo/client";

export const GET_SERVICE_ROUTES = gql`
  query Query {
    serviceRouteAll {
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
      technician {
        id
        firstName
        lastName
        emailAddress
        roles
      }
      count
    }
  }
`;
