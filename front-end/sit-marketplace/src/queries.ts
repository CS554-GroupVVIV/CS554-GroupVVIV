import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query {
    products {
      _id
      name
    }
  }
`;
