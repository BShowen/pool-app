import { gql } from "@apollo/client";

export const DELETE_SERVICE = gql`
  mutation DeleteService($serviceId: ID!) {
    deleteService(serviceId: $serviceId) {
      id
      name
      description
    }
  }
`;
