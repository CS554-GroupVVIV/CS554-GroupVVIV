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

export const GET_POSTS = gql`
  query {
    posts {
      _id
      buyer_id
      seller_id
      item
      category
      price
      condition
      date
      description
      isComplete
    }
  }
`;

export const GET_USER = gql`
  query ($id: String!) {
    getUserById(_id: $id) {
      _id
      email
      firstname
      lastname
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

export const ADD_POST = gql`
  mutation (
    $buyer_id: String!
    $item: String!
    $category: String!
    $price: Number!
    $condition: String!
    $description: String!
  ) {
    addPost(
      buyer_id: $buyer_id
      item: $item
      category: $category
      price: $price
      condition: $condition
      description: $description
    ) {
      _id
      buyer_id
      seller_id
      item
      category
      price
      condition
      date
      description
      isComplete
    }
  }
`;

export const ADD_USER = gql`
  mutation (
    $id: String!
    $email: String!
    $firstname: String!
    $lastname: String!
  ) {
    addUser(
      _id: $id
      email: $email
      firstname: $firstname
      lastname: $lastname
    ) {
      _id
      email
      firstname
      lastname
    }
  }
`;

export const EDIT_USER = gql`
  mutation (
    $id: String!
    $email: String!
    $firstname: String!
    $lastname: String!
  ) {
    editUser(
      _id: $id
      email: $email
      firstname: $firstname
      lastname: $lastname
    ) {
      _id
      email
      firstname
      lastname
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

export const SEARCH_PRODUCTS_BY_ID = gql`
  query Query($id: ObjectID!) {
    getProductById(_id: $id) {
      _id
      category
      condition
      date
      description
      image
      isSold
      name
      price
    }
  }
`;
