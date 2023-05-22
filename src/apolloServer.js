// GraphQL packages.
import { ApolloClient, InMemoryCache } from "@apollo/client";

export default new ApolloClient({
  uri: "http://192.168.1.74:8080/",
  cache: new InMemoryCache(),
});
