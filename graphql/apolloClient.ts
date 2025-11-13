import {
  ApolloClient,
  InMemoryCache,
  DefaultOptions,
  createHttpLink,
} from "@apollo/client";

// ✅ نبقي على BASE_URL للاستخدام في أماكن أخرى
export const BASE_URL =
  process.env.NODE_ENV !== "development"
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : "http://localhost:3000";

// ✅ دالة جديدة للحصول على الـ URL الصحيح لـ Apollo Client فقط
const getApolloUri = () => {
  // في المتصفح: استخدم الدومين الحالي
  if (typeof window !== "undefined") {
    return `${window.location.origin}/api/graphql`;
  }
  
  // في السيرفر: استخدم BASE_URL
  return `${BASE_URL}/api/graphql`;
};

const httpLink = createHttpLink({
  uri: getApolloUri(),
});

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  },
  query: {
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  },
  mutate: {
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  },
};

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: defaultOptions,
});

export default client;