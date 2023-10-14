import { gql } from "@apollo/client";

export const GET_IMAGES = gql`
  query GetImages($awsKeyList: [String!]!, $poolReportId: ID!) {
    getImages(awsKeyList: $awsKeyList, poolReportId: $poolReportId) {
      key
      url
    }
  }
`;
