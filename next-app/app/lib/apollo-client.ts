import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://api.studio.thegraph.com/query/84868/ntoboa-subgraph/version/latest', // Replace with your subgraph endpoint
  cache: new InMemoryCache(),
});

export default client;

export const GET_CHARITY_BY_ID = gql`
  query GetCharityById($id: Bytes!) {
    charity(id: $id) {
      id
      name
      description
      target
    }
  }
`;


export const GET_CHARITIES = gql`
  query GetCharities {
    charities(first: 3) {
      id
      name
      description
      target
    }
  }
`;