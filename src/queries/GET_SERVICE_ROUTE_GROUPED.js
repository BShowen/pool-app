import { gql } from "@apollo/client";

export const GET_SERVICE_ROUTE_GROUPED = gql`
  query GetGroupedServiceRoute($id: ID) {
    getGroupedServiceRoute(id: $id) {
      count
      total
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
      serviceDay
    }
  }
`;
