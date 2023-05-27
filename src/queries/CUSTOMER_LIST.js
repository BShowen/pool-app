import { gql } from "@apollo/client";

export const CUSTOMER_LIST = gql`
  query getCustomerAccountList {
    getCustomerAccountList {
      accountName
      accountOwners {
        emailAddress
        firstName
        lastName
        phoneNumber
        id
      }
      address
      companyId
      id
      price
      serviceDay
      serviceFrequency
      serviceType
      technicianId
    }
  }
`;
