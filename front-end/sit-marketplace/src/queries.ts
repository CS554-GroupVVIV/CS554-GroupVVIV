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
      seller_id
      category
      isSold
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
      status
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

export const GET_USERS_BY_IDS = gql`
  query ($ids: [String!]!) {
    getUsersByIds(ids: $ids) {
      _id
      firstname
      lastname
      email
    }
  }
`;

export const GET_CHAT_BY_PARTICIPANTS = gql`
  query ($participants: [String!]!) {
    getChatByParticipants(participants: $participants) {
      _id
      participants
      messages {
        message
        sender
        time
      }
    }
  }
`;

export const GET_POSTS_BY_SELLER = gql`
  query ($_id: String!) {
    getPostBySeller(_id: $_id) {
      _id
      buyer_id
      seller_id
      item
      category
      price
      condition
      date
      description
      status
    }
  }
`;

export const GET_POSTS_BY_BUYER = gql`
  query ($_id: String!) {
    getPostByBuyer(_id: $_id) {
      _id
      buyer_id
      seller_id
      item
      category
      price
      condition
      date
      description
      status
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

export const EDIT_PRODUCT = gql`
  mutation (
    $id: String!
    $name: String!
    $price: Number!
    $date: DateTime!
    $description: String!
    $condition: String!
    $sellerId: String!
    $image: Base64!
    $category: String!
  ) {
    editProduct(
      _id: $id
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

export const DELETE_PRODUCT = gql`
  mutation ($id: String!) {
    deleteProduct(_id: $id) {
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
      status
    }
  }
`;

export const EDIT_POST = gql`
  mutation (
    $id: String!
    $buyer_id: String!
    $item: String!
    $category: String!
    $price: Number!
    $condition: String!
    $description: String!
  ) {
    editPost(
      _id: $id
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
      status
    }
  }
`;

export const DELETE_POST = gql`
  mutation ($id: String!) {
    deletePost(_id: $id) {
      _id
      buyer_id
      seller_id
      item
      category
      price
      condition
      date
      description
      status
    }
  }
`;

export const ADD_MESSAGE = gql`
  mutation (
    $chatId: String!
    $sender: ID!
    $message: String!
    $time: DateTime!
  ) {
    addMessage(_id: $chatId, sender: $sender, message: $message, time: $time) {
      message
      sender
      time
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

export const ADD_CHAT = gql`
  mutation ($participants: [String!]!) {
    addChat(participants: $participants) {
      _id
      participants
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

export const SEARCH_POST_BY_ID = gql`
  query Query($id: ObjectID!) {
    getPostById(_id: $id) {
      _id
      buyer_id
      seller_id
      item
      category
      price
      condition
      date
      description
      status
    }
  }
`;

export const RETRIEVE_POST = gql`
  mutation ($id: String!, $user_id: String!) {
    retrievePost(_id: $id, user_id: $user_id) {
      _id
      buyer_id
      seller_id
      item
      category
      price
      condition
      date
      description
      status
    }
  }
`;

export const REPOST_POST = gql`
  mutation ($id: String!, $user_id: String!) {
    repostPost(_id: $id, user_id: $user_id) {
      _id
      buyer_id
      seller_id
      item
      category
      price
      condition
      date
      description
      status
    }
  }
`;