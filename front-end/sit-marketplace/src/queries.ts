import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query Products {
    products {
      _id
      buyer_id
      category
      condition
      date
      description
      name
      price
      seller_id
      status
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
      date
      price
      condition
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

export const GET_PRODUCTS_BY_SELLER = gql`
  query GetProductBySeller($id: String!) {
    getProductBySeller(_id: $id) {
      _id
      buyer_id
      category
      condition
      date
      description
      image
      name
      price
      seller_id
      status
    }
  }
`;

export const GET_PRODUCTS_BY_BUYER = gql`
  query GetProductByBuyer($id: String!) {
    getProductByBuyer(_id: $id) {
      _id
      buyer_id
      category
      condition
      date
      description
      image
      name
      price
      seller_id
      status
    }
  }
`;

export const GET_COMMENT = gql`
  query ($user_id: String!, $comment_id: String!) {
    getComment(user_id: $user_id, comment_id: $comment_id) {
      _id
      email
      firstname
      lastname
      comments {
        _id
        rating
        comment_id
        comment
      }
      rating
    }
  }
`;

export const ADD_PRODUCT = gql`
mutation Mutation($name: String!, $price: Float!, $description: String!, $condition: String!, $sellerId: String!, $image: String!, $category: String!) {
  addProduct(name: $name, price: $price, description: $description, condition: $condition, seller_id: $sellerId, image: $image, category: $category) {
    _id
    buyer_id
    category
    condition
    date
    description
    image
    name
    price
    seller_id
    status
  }
}
`;

export const EDIT_PRODUCT = gql`
  mutation (
    $id: String!
    $name: String!
    $price: Float!
    $date: String!
    $description: String!
    $condition: String!
    $sellerId: String!
    $image: String!
    $category: String!
    $buyerId: String
  ) {
    editProduct(
      _id: $id
      name: $name
      price: $price
      date: $date
      description: $description
      condition: $condition
      seller_id: $sellerId
      buyer_id: $buyerId
      image: $image
      category: $category
    ) {
      _id
      buyer_id
      category
      condition
      date
      description
      image
      name
      possible_buyers {
        _id
        firstname
        lastname
      }
      price
      seller_id
      status
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
    $price: Float!
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
    $price: Float!
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
    $favorite: String
  ) {
    addUser(
      _id: $id
      email: $email
      firstname: $firstname
      lastname: $lastname
      favorite: $favorite
    ) {
      _id
      email
      firstname
      lastname
      favorite
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
}
`;


export const ADD_POSSIBLE_BUYER = gql`
mutation Mutation($id: String!, $buyerId: String!) {
  addPossibleBuyer(_id: $id, buyer_id: $buyerId) {
    _id
    buyer_id
    category
    condition
    date
    description
    image
    name
    price
    seller_id
    status
    possible_buyers {
      _id
      firstname
      lastname
    }
  }
}
`;

export const ADD_POSSIBLE_SELLER = gql`
  mutation Mutation($id: String!, $sellerId: String!) {
    addPossibleSeller(_id: $id, seller_id: $sellerId) {
      _id
      buyer_id
      category
      condition
      date
      description
      item
      possible_sellers
      price
      seller_id
      status
    }
  }
`;

// export const SEARCH_PRODUCTS = gql`
//   query ($searchTerm: String!) {
//     searchProducts(searchTerm: $searchTerm) {
//       _id
//       buyer_id
//       category
//       condition
//       date
//       description
//       name
//       price
//       seller_id
//       status
//     }
//   }
// `;

export const SEARCH_POSTS = gql`
  query ($searchTerm: String!) {
    searchPosts(searchTerm: $searchTerm) {
      _id
      buyer_id
      seller_id
      item
      category
      date
      price
      condition
      description
      status
    }
  }
`;

export const SEARCH_PRODUCTS_BY_NAME = gql`
  query ($name: String!) {
    searchProductsByName(name: $name) {
      _id
      buyer_id
      category
      condition
      date
      description
      name
      price
      seller_id
      status
    }
  }
`;

export const SEARCH_PRODUCTS_BY_ID = gql`
  query GetProductById($id: String!) {
    getProductById(_id: $id) {
      _id
      buyer_id
      category
      condition
      date
      description
      image
      name
      possible_buyers {
        _id
        firstname
        lastname
      }
      price
      seller_id
      status
    }
  }
`;

export const SEARCH_POST_BY_ID = gql`
  query GetProductById($id: String!) {
    getPostById(_id: $id) {
      _id
      buyer_id
      category
      condition
      date
      description
      item
      possible_sellers {
        _id
        firstname
        lastname
      }
      price
      seller_id
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

export const ADD_COMMENT = gql`
  mutation (
    $user_id: String!
    $comment_id: String!
    $rating: Int!
    $comment: String
  ) {
    addComment(
      user_id: $user_id
      comment_id: $comment_id
      rating: $rating
      comment: $comment
    ) {
      _id
      email
      firstname
      lastname
      comments {
        _id
        rating
        comment_id
        comment
      }
      rating
    }
  }
`;

export const EDIT_COMMENT = gql`
  mutation (
    $user_id: String!
    $comment_id: String!
    $rating: Int!
    $comment: String
  ) {
    editComment(
      user_id: $user_id
      comment_id: $comment_id
      rating: $rating
      comment: $comment
    ) {
      _id
      email
      firstname
      lastname
      comments {
        _id
        rating
        comment_id
        comment
      }
      rating
    }
  }
`;

export const ADD_FAVORITE_TO_USER = gql`
  mutation Mutation($id: String!, $productId: String!) {
    addProductToUserFavorite(_id: $id, productId: $productId)
  }
`;

export const REMOVE_FAVORITE_FROM_USER = gql`
  mutation Mutation($id: String!, $productId: String!) {
    removeProductFromUserFavorite(_id: $id, productId: $productId)
  }
`;

export const GET_PRODUCTS_BY_IDS = gql`
  query Query($ids: [String!]!) {
    getProductsByIds(ids: $ids) {
      _id
      name
      price
    }
  }
`;

export const GET_PRODUCTS_BY_CATEGORY = gql`
  query Query($category: String!) {
    getProductsByCategory(category: $category) {
      _id
      buyer_id
      category
      condition
      date
      description
      image
      name
      price
      seller_id
      status
    }
  }
`;
