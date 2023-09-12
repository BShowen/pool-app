import { gql } from "@apollo/client";

export const UPDATE_SERVICE = gql`
  mutation UpdateService($input: ServiceUpdateInput!) {
    updateService(input: $input) {
      id
      name
      description
    }
  }
`;
