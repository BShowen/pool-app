import { gql } from "@apollo/client";

export const DELETE_TECHNICIAN = gql`
  mutation DeleteTechnician($id: ID!) {
    deleteTechnician(technicianId: $id)
  }
`;
