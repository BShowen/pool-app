import { gql } from "@apollo/client";

export const CREATE_TECHNICIAN = gql`
  mutation NewTechnician($input: NewTechnician) {
    newTechnician(input: $input) {
      id
      firstName
      lastName
      emailAddress
      roles
    }
  }
`;
