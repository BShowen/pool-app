import { gql } from "@apollo/client";

export const CREATE_TECHNICIAN = gql`
  mutation CreateNewTechnician($technician: CreateTechnicianInput!) {
    createNewTechnician(technician: $technician) {
      companyId
      emailAddress
      firstName
      id
      lastName
    }
  }
`;
