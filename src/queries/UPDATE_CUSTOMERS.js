import { gql } from "@apollo/client";

export const UPDATE_CUSTOMERS = gql`
  mutation UpdateCustomers($input: [UpdateCustomer!]!) {
    updateCustomers(input: $input) {
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
