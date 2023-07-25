import { gql } from "@apollo/client";

export const UPDATE_CUSTOMER = gql`
  mutation UpdateCustomerAccount($input: UpdateCustomerAccountInput) {
    updateCustomerAccount(input: $input) {
      accountName
      serviceType
      serviceDay
      serviceFrequency
      address
      price
      company
      id
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
