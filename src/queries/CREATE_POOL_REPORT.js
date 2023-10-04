import { gql } from "@apollo/client";

export const CREATE_POOL_REPORT = gql`
  mutation CreatePoolReport($input: PoolReportInput!) {
    createPoolReport(input: $input) {
      companyId
      customerAccountId
      date
      customerNotes
      technicianNotes
      workLog {
        workLogItems {
          name
          description
        }
      }
      chemicalLog {
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
        date
        customerAccountId
        id
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
