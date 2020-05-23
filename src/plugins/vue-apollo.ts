import Vue from "vue";
import VueApollo from "vue-apollo";
import { ApolloClient, InMemoryCache, NormalizedCacheObject, gql } from "apollo-boost";
import { createHttpLink } from "apollo-link-http";
import { LogoutResult } from '@/struct';

Vue.use(VueApollo);

const options = {
  link: createHttpLink({
    uri: "http://localhost:8000/graphql",
    credentials: 'include'
  }),
  cache: new InMemoryCache(),
  
};

const apolloClient = new ApolloClient(options);

export function createApolloProvider() {
  const apolloProvider = new VueApollo({
    defaultClient: apolloClient
  });
  return apolloProvider;
}

// Name of the localStorage item
// const AUTH_TOKEN = 'apollo-token'

// Http endpoint
// const httpEndpoint =
//     process.env.VUE_APP_GRAPHQL_HTTP || 'http://localhost:4000/graphql'

// Config
// const defaultOptions = {
//     // You can use `https` for secure connection (recommended in production)
//     httpEndpoint,
//     // You can use `wss` for secure connection (recommended in production)
//     // Use `null` to disable subscriptions
//     wsEndpoint: process.env.VUE_APP_GRAPHQL_WS || 'ws://localhost:4000/graphql',
//     // LocalStorage token
//     tokenName: AUTH_TOKEN,
//     // Enable Automatic Query persisting with Apollo Engine
//     persisting: false,
//     // Use websockets for everything (no HTTP)
//     // You need to pass a `wsEndpoint` for this to work
//     websocketsOnly: false,
//     // Is being rendered on the server?
//     ssr: false

//     // Override default apollo link
//     // note: don't override httpLink here, specify httpLink options in the
//     // httpLinkOptions property of defaultOptions.
//     // link: myLink

//     // Override default cache
//     // cache: myCache

//     // Override the way the Authorization header is set
//     // getAuth: (tokenName) => ...

//     // Additional ApolloClient options
//     // apollo: { ... }

//     // Client local data (see apollo-link-state)
//     // clientState: { resolvers: { ... }, defaults: { ... } }
// }

// Call this in the Vue app file
// export function createProvider(options = {}) {
//     // Create apollo client
//     const { apolloClient, wsClient } = createApolloClient({
//         ...defaultOptions,
//         ...options
//     })
//     apolloClient.wsClient = wsClient

//     // Create vue apollo provider
//     const apolloProvider = new VueApollo({
//         defaultClient: apolloClient,
//         defaultOptions: {
//             $query: {
//                 // fetchPolicy: 'cache-and-network',
//             }
//         },
//         errorHandler(error) {
//             // eslint-disable-next-line no-console
//             console.log(
//                 '%cError',
//                 'background: red; color: white; padding: 2px 4px; border-radius: 3px; font-weight: bold;',
//                 error.message
//             )
//         }
//     })

//     return apolloProvider
// }

// // Manually call this when user log in
// export async function onLogin(apolloClient, token) {
//     if (typeof localStorage !== 'undefined' && token) {
//         localStorage.setItem(AUTH_TOKEN, token)
//     }
//     if (apolloClient.wsClient) restartWebsockets(apolloClient.wsClient)
//     try {
//         await apolloClient.resetStore()
//     } catch (e) {
//         // eslint-disable-next-line no-console
//         console.log(
//             '%cError on cache reset (login)',
//             'color: orange;',
//             e.message
//         )
//     }
// }

// Manually call this when user log out
// export async function onLogout(apolloClient: ApolloClient<NormalizedCacheObject>) {
//   try {
//     let res = await apolloClient.mutate<LogoutResult, {}>({
//       mutation: gql`
//         mutation {
//           logout {
//             message
//           }
//         }
//       `
//     });
//     // $store
//     // Vue.prototype.$store.commit("global/resetUserIdAndRole");
//     // this.$store.commit("global/resetUserInfo");
//     // sessionStorage.removeItem("user_id");
//     // sessionStorage.removeItem("role");
//     Vue.prototype.$router.push("/");
//     // must logout success
//     if (res.errors) throw res.errors.map(v => v.message).join(",");
//     if (res.data!.logout.message) throw res.data!.logout.message;
//   } catch (e) {
//     console.log(e.toString());
//   }
// }