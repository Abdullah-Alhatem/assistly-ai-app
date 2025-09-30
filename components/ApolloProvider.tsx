"use client";

import { ApolloProvider } from "@apollo/client/react"; // ensure if the import with /react is necessary for ApolloProvider
import client from "@/graphql/apolloClient";

const ApolloProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
export default ApolloProviderWrapper;