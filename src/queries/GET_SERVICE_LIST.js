import { gql } from "@apollo/client";

export const GET_SERVICE_LIST = gql`
  query GetServiceList {
    getAllServices {
      description
      name
      id
    }
  }
`;
