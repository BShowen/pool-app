import { gql } from "@apollo/client";

export const UPDATE_CUSTOMER_TECHNICIAN = gql`
  mutation UpdateCustomerAccount(
    $customerAccountInput: UpdateCustomerAccountInput
  ) {
    updateCustomerAccount(customerAccountInput: $customerAccountInput) {
      id
      technicianId
    }
  }
`;
