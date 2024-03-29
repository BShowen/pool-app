import { gql } from "@apollo/client";

export const GET_TECHNICIAN = gql`
  query GetTechnicianList($id: ID) {
    getTechnician(id: $id) {
      firstName
      lastName
      emailAddress
      id
    }
  }
`;
