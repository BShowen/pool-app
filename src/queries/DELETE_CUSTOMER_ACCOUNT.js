import { gql } from "@apollo/client";

export const DELETE_CUSTOMER_ACCOUNT = gql`
  mutation Mutation($accountId: ID) {
    deleteCustomerAccount(accountId: $accountId) {
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
  }
`;
