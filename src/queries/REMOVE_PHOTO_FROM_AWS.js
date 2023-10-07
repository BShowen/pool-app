import { gql } from "@apollo/client";

export const REMOVE_PHOTO_FROM_AWS = gql`
  mutation RemovePhotoFromAWS($input: PresignedUrlInput!) {
    removePhotoFromAWS(input: $input)
  }
`;
