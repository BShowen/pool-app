import { gql } from "@apollo/client";

export const CREATE_CUSTOMER_ACCOUNT = gql`
  mutation NewCustomerAccount($input: NewCustomerAccount) {
    newCustomerAccount(input: $input) {
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
        password
        registrationSecret
        roles
      }
      accountOwners {
        firstName
        lastName
        emailAddress
        phoneNumber
        password
        account
        id
      }
    }
  }
`;
