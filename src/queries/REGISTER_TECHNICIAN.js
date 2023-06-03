import { gql } from "@apollo/client";

export const REGISTER_TECHNICIAN = gql`
  mutation RegisterTechnician($technician: registrationInput!) {
    registerTechnician(technician: $technician) {
      id
      firstName
      lastName
      emailAddress
      password
      companyId
      registrationSecret
    }
  }
`;
