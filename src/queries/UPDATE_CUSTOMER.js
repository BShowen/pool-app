import { gql } from "@apollo/client";

export const UPDATE_CUSTOMER = gql`
  mutation UpdateCustomerAccount(
    $customerAccountInput: UpdateCustomerAccountInput
  ) {
    updateCustomerAccount(customerAccountInput: $customerAccountInput) {
      accountName
      address
      companyId
      id
      price
      serviceDay
      serviceFrequency
      serviceType
      accountOwners {
        emailAddress
        firstName
        id
        lastName
        phoneNumber
      }
    }
  }
`;
