import { gql } from "@apollo/client";

export const GET_POOL_REPORT_PHOTO_URL = gql`
  query GetPoolReportPhotoUrl($input: PresignedUrlInput!) {
    getPoolReportPhotoUrl(input: $input)
  }
`;
