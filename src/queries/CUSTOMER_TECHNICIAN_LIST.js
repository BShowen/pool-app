import { gql } from "@apollo/client";

export const CUSTOMER_TECHNICIAN_LIST = gql`
  query customerTechnicianList {
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
    getTechnicianList {
      companyId
      emailAddress
      lastName
      id
      firstName
      password
    }
  }
`;
