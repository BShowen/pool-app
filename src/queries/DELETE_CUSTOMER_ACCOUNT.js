import { gql } from "@apollo/client";

export const DELETE_CUSTOMER_ACCOUNT = gql`
  mutation DeleteCustomerAccount($id: ID) {
    deleteCustomerAccount(id: $id) {
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
