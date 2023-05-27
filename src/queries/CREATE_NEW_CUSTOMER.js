import { gql } from "@apollo/client";

export const CREATE_NEW_CUSTOMER = gql`
  mutation createNewCustomerAccount(
    $customerAccountInput: CustomerAccountInput
  ) {
    createNewCustomerAccount(customerAccountInput: $customerAccountInput) {
      accountName
      serviceType
      serviceDay
      serviceFrequency
      address
      price
      companyId
      id
      technicianId
      accountOwners {
        firstName
        lastName
        emailAddress
        phoneNumber
        id
      }
    }
  }
`;
