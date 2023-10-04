import { gql } from "@apollo/client";

export const GET_POOL_REPORT = gql`
  query GetPoolReport($poolReportId: ID!, $customerAccountId: ID!) {
    getPoolReport(
      poolReportId: $poolReportId
      customerAccountId: $customerAccountId
    ) {
      customerAccountId
      companyId
      date
      workLog {
        workLogItems {
          name
          description
        }
      }
      notes
      id
      photo
      chemicalLog {
        id
        alkalinity {
          test
          add {
            unit
            quantity
          }
        }
        calcium {
          test
          add {
            unit
            quantity
          }
        }
        chlorine {
          test
          add {
            unit
            quantity
          }
        }
        customerAccountId
        date
        notes
        pH {
          test
          add {
            unit
            quantity
          }
        }
        salt {
          test
          add {
            unit
            quantity
          }
        }
        stabilizer {
          test
          add {
            unit
            quantity
          }
        }
        tablets {
          test
          add {
            unit
            quantity
          }
        }
      }
    }
  }
`;
