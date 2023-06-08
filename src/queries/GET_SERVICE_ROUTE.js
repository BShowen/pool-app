import { gql } from "@apollo/client";

export const GET_SERVICE_ROUTE = gql`
  query GetServiceRoute($technicianId: ID) {
    getServiceRoute {
      technician {
        firstName
        lastName
        id
      }
      count
      customerAccounts {
        accountName
        serviceType
        serviceDay
        serviceFrequency
        address
        price
        companyId
        id
        technicianId
        accountOwners {
          firstName
          lastName
          emailAddress
          phoneNumber
          id
        }
      }
    }
  }
`;
