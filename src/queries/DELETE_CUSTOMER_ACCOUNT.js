import { gql } from "@apollo/client";

export const DELETE_CUSTOMER_ACCOUNT = gql`
  mutation DeleteCustomerAccount($id: ID) {
    deleteCustomerAccount(id: $id)
  }
`;
