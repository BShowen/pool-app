import { gql } from "@apollo/client";

export const GET_CUSTOMER_ACCOUNT = gql`
  query GetCustomerAccount($accountId: ID!) {
    customerAccount(accountId: $accountId) {
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
