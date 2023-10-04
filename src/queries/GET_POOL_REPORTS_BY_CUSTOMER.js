import { gql } from "@apollo/client";

export const GET_POOL_REPORTS_BY_CUSTOMER = gql`
  query GetPoolReportsByCustomer($customerAccountId: ID!) {
    getPoolReportsByCustomer(customerAccountId: $customerAccountId) {
      id
      date
      customerNotes
      technicianNotes
      workLog {
        workLogItems {
          name
          description
        }
      }
      customerAccountId
      companyId
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
        customerAccountId
        date
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
