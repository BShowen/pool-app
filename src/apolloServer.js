// GraphQL packages.
import { ApolloClient, InMemoryCache, from } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { setContext } from "@apollo/client/link/context";
import { removeTypenameLink } from "./utils/removeTypenameLink";

const uploadLink = createUploadLink({
  uri: import.meta.env.VITE_GRAPHQL_SERVER,
  headers: { "Apollo-Require-Preflight": "true" },
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
  link: from([removeTypenameLink, authLink, uploadLink]),
  // link: from([removeTypenameLink, authLink.concat(uploadLink)]),
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
