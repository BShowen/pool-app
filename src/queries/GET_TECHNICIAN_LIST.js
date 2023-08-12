import { gql } from "@apollo/client";

export const GET_TECHNICIAN_LIST = gql`
  query GetTechnicianList {
    technicianList {
      id
      firstName
      lastName
      emailAddress
      roles
    }
  }
`;
