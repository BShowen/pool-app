import { gql } from "@apollo/client";

export const CUSTOMER_LIST = gql`
  query getCustomerAccountList {
    getCustomerAccountList {
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
