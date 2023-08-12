import { gql } from "@apollo/client";

export const DELETE_TECHNICIAN = gql`
  mutation DeleteTechnician($technicianId: ID) {
    deleteTechnician(technicianId: $technicianId) {
      id
      firstName
      lastName
      emailAddress
      roles
    }
  }
`;
