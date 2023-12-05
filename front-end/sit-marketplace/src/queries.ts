import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query {
    products {
      _id
      name
    }
  }
`;

export const GET_POSTS = gql`
  query {
    posts {
      _id
      title
    }
  }
`;
