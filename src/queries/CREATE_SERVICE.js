import { gql } from "@apollo/client";

export const CREATE_SERVICE = gql`
  mutation CreateService($input: ServiceInput) {
    createNewService(input: $input) {
      description
      name
    }
  }
`;
