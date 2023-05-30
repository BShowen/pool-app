// GraphQL packages.
import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { removeTypenameLink } from "./utils/removeTypenameLink";

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_SERVER,
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("apiToken") || "";
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});
export default new ApolloClient({
  link: from([removeTypenameLink, authLink.concat(httpLink)]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getCustomerAccount: {
            read(_, { args, toReference }) {
              return toReference({
                __typename: "CustomerAccount",
                id: args.id,
              });
            },
          },
          getTechnician: {
            read(_, { args, toReference }) {
              return toReference({
                __typename: "Technician",
                id: args.id,
              });
            },
          },
        },
      },
    },
  }),
});
