import { gql } from "@apollo/client";

export const GET_CUSTOMER_TECHNICIAN_LIST = gql`
  query GetCustomerTechnicianList {
    customerAccountList {
      accountName
      serviceType
      serviceDay
      serviceFrequency
      address
      price
      company
      id
      technician {
        id
        firstName
        lastName
        emailAddress
        roles
      }
      accountOwners {
        firstName
        lastName
        emailAddress
        phoneNumber
        account
        id
      }
    }
    technicianList {
      id
      firstName
      lastName
      emailAddress
      roles
    }
  }
`;
