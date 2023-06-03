import { gql } from "@apollo/client";

export const UPDATE_CUSTOMER_TECHNICIAN = gql`
  mutation UpdateCustomerAccount(
    $customerAccountInput: UpdateCustomerAccountInput
  ) {
    updateCustomerAccount(customerAccountInput: $customerAccountInput) {
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
