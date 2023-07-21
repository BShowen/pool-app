import { gql } from "@apollo/client";

export const CUSTOMER_ACCOUNT = gql`
  query CustomerAccount($accountId: ID!) {
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
