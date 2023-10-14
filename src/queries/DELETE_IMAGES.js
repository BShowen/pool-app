import { gql } from "@apollo/client";

export const DELETE_IMAGES = gql`
  mutation DeleteImages($input: PresignedUrlInput!) {
    deleteImages(input: $input) {
      deleteCountActual
      deleteCountRequested
      deletedObjects {
        Key
      }
      errors {
        Code
        Key
        Message
      }
    }
  }
`;
