import { gql } from "@apollo/client";

export const UPDATE_TECHNICIAN = gql`
  mutation UpdateTechnician($input: UpdateTechnician) {
    updateTechnician(input: $input) {
      id
      firstName
      lastName
      emailAddress
      roles
    }
  }
`;
