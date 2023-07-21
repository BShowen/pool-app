import { gql } from "@apollo/client";

export const CUSTOMER_TECHNICIAN_LIST = gql`
  query CustomerTechnicianList {
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
