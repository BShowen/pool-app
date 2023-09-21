import { gql } from "@apollo/client";

export const UPDATE_CUSTOMER_ACCOUNT_SERVICE_DAY = gql`
  mutation UpdateCustomerAccountServiceDay($input: UpdateCustomerAccountInput) {
    updateCustomerAccount(input: $input) {
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
