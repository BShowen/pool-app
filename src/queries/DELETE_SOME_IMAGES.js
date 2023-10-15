import { gql } from "@apollo/client";

export const DELETE_SOME_IMAGES = gql`
  mutation DeleteSomeImages($input: PresignedUrlInput!) {
    deleteSomeImages(input: $input) {
      deleteCountActual
      deleteCountRequested
      keysDeleted
      keysNotDeleted
    }
  }
`;
