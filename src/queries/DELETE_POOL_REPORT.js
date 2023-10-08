import { gql } from "@apollo/client";

export const DELETE_POOL_REPORT = gql`
  mutation DeletePoolReport($poolReportId: ID!) {
    deletePoolReport(poolReportId: $poolReportId)
  }
`;
