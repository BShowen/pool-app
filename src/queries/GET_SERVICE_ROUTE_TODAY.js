import { gql } from "@apollo/client";

export const GET_SERVICE_ROUTE_TODAY = gql`
  query GetServiceRouteToday {
    serviceRouteToday {
      technician {
        firstName
        lastName
      }
      count
      customerAccounts {
        accountName
        serviceType
        serviceDay
        serviceFrequency
        address
        price
        id
        accountOwners {
          firstName
          lastName
          emailAddress
          phoneNumber
          account
          id
        }
        latestChemicalLog {
          id
          date
          notes
          chlorine {
            test
            add {
              unit
              quantity
            }
          }
          pH {
            test
            add {
              unit
              quantity
            }
          }
          alkalinity {
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
          salt {
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
          tablets {
            test
            add {
              unit
              quantity
            }
          }
          customerAccountId
        }
      }
    }
  }
`;
