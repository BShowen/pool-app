import { gql } from "@apollo/client";

export const CUSTOMER_ACCOUNT = gql`
  query GetCustomerAccount($id: ID) {
    getCustomerAccount(id: $id) {
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
`;
