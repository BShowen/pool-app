import { gql } from "@apollo/client";

export const DELETE_ACCOUNT_OWNER = gql`
  mutation DeleteAccountOwner($customerId: ID!) {
    deleteCustomer(customerId: $customerId) {
      firstName
      lastName
      emailAddress
      phoneNumber
      password
      account
      id
    }
  }
`;
