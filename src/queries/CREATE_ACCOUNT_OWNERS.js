import { gql } from "@apollo/client";

export const CREATE_ACCOUNT_OWNERS = gql`
  mutation NewCustomers($input: NewCustomer!) {
    newCustomers(input: $input) {
      firstName
      lastName
      emailAddress
      phoneNumber
      account
      id
    }
  }
`;
