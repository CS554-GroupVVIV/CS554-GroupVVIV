import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query {
    products {
      _id
      name
      price
      date
      description
      condition
      category
    }
  }
`;

export const ADD_PRODUCT = gql`
  mutation (
    $name: String!
    $price: Number!
    $date: DateTime!
    $description: String!
    $condition: String!
    $sellerId: String!
    $image: Base64!
    $category: String!
  ) {
    addProduct(
      name: $name
      price: $price
      date: $date
      description: $description
      condition: $condition
      seller_id: $sellerId
      image: $image
      category: $category
    ) {
      name
      price
      date
      description
      condition
      category
    }
  }
`;

export const SEARCH_PRODUCTS = gql`
  query ($searchTerm: String!) {
    searchProducts(searchTerm: $searchTerm) {
      _id
      name
    }
  }
`;

export const SEARCH_PRODUCTS_BY_NAME = gql`
  query ($name: String!) {
    searchProductsByName(name: $name) {
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
