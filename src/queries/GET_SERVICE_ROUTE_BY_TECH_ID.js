import { gql } from "@apollo/client";

export const GET_SERVICE_ROUTE_BY_TECH_ID = gql`
  query ServiceRouteByTechId($technicianId: ID!) {
    serviceRouteByTechId(technicianId: $technicianId) {
      serviceDay
      count
      total
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
          password
          account
          id
        }
      }
    }
  }
`;
