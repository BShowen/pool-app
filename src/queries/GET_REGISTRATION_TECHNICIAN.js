import { gql } from "@apollo/client";

export const GET_REGISTRATION_TECHNICIAN = gql`
  query GetRegistrationTechnician($id: ID, $secret: ID) {
    getRegistrationTechnician(id: $id, registrationSecret: $secret) {
      id
      firstName
      lastName
      emailAddress
      registrationSecret
    }
  }
`;
