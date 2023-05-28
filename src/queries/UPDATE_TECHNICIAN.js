import { gql } from "@apollo/client";

export const UPDATE_TECHNICIAN = gql`
  mutation UpdateTechnician($updateTechnicianInput: updateTechnicianInput!) {
    updateTechnician(updateTechnicianInput: $updateTechnicianInput) {
      firstName
      lastName
      emailAddress
      id
      companyId
    }
  }
`;
