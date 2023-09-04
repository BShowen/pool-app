import { gql } from "@apollo/client";

export const CREATE_CHEMICAL_LOG = gql`
  mutation CreateChemicalLog($input: ChemicalLogInput) {
    createChemicalLog(input: $input) {
      id
      customerAccountId
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
      notes
      date
    }
  }
`;
