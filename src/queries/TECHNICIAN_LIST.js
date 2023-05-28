import { gql } from "@apollo/client";

export const TECHNICIAN_LIST = gql`
  query GetTechnicianList {
    getTechnicianList {
      firstName
      lastName
      emailAddress
      id
      companyId
    }
  }
`;
