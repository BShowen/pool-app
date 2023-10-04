import { gql } from "@apollo/client";

export const GET_POOL_REPORT_PHOTO_URL = gql`
  query GetPoolReportPhotoUrl($poolReportId: ID!, $customerAccountId: ID!) {
    getPoolReport(
      poolReportId: $poolReportId
      customerAccountId: $customerAccountId
    ) {
      photo
    }
  }
`;
