import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query Products {
    products {
      _id
      buyer {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      category
      condition
      date
      description
      image
      name
      price
      seller {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      status
      possible_buyers {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      completion_date
    }
  }
`;

export const GET_POSTS = gql`
  query {
    posts {
      _id
      buyer {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      seller {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      name
      category
      date
      price
      condition
      description
      status
      possible_sellers {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      completion_date
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
      comments {
        _id
        commenter {
          _id
          firstname
          lastname
        }
        rating
        comment
        date
      }
      rating
      favorite_products {
        _id
        buyer {
          _id
        }
        seller {
          _id
        }
        possible_buyers {
          _id
        }
        category
        condition
        date
        description
        image
        name
        price
        status
        completion_date
      }
      favorite_posts {
        _id
        buyer {
          _id
        }
        seller {
          _id
        }
        possible_sellers {
          _id
        }
        category
        condition
        date
        description
        name
        price
        status
        completion_date
      }
      possible_buyer {
        _id
        category
        condition
        date
        description
        image
        buyer {
          _id
          firstname
        }
        name
        price
        seller {
          _id
          firstname
          lastname
          rating
          comments {
            _id
            commenter {
              _id
              firstname
              lastname
            }
            rating
            comment
            date
          }
        }
        possible_buyers {
          _id
        }
        status
      }
      possible_seller {
        _id
        category
        condition
        date
        description
        name
        price
        possible_sellers {
          _id
        }
        buyer {
          _id
          firstname
        }
        seller {
          _id
          firstname
          lastname
          rating
          comments {
            _id
            commenter {
              _id
              firstname
              lastname
            }
            rating
            comment
            date
          }
        }
        status
      }
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
      participants {
        _id
        firstname
      }
      messages {
        message
        sender {
          _id
          firstname
        }
        time
      }
    }
  }
`;

export const GET_POSTS_BY_SELLER = gql`
  query ($_id: String!) {
    getPostBySeller(_id: $_id) {
      _id
      buyer {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      seller {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      name
      category
      price
      condition
      date
      description
      status
      possible_sellers {
        _id
        firstname
        lastname
      }
      completion_date
    }
  }
`;

export const GET_POSTS_BY_BUYER = gql`
  query ($_id: String!) {
    getPostByBuyer(_id: $_id) {
      _id
      buyer {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      seller {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      name
      category
      price
      condition
      date
      description
      status
      possible_sellers {
        _id
        firstname
        lastname
      }
      completion_date
    }
  }
`;

export const GET_PRODUCTS_BY_SELLER = gql`
  query GetProductBySeller($id: String!) {
    getProductBySeller(_id: $id) {
      _id
      buyer {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      category
      condition
      date
      description
      image
      name
      price
      seller {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      status
      possible_buyers {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      completion_date
    }
  }
`;

export const GET_PRODUCTS_BY_BUYER = gql`
  query GetProductByBuyer($id: String!) {
    getProductByBuyer(_id: $id) {
      _id
      buyer {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      category
      condition
      date
      description
      image
      name
      price
      seller {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      status
      possible_buyers {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      completion_date
    }
  }
`;

export const GET_PRODUCTS_BY_STATUS = gql`
  query GetProductsByStatus($status: String!) {
    getProductsByStatus(status: $status) {
      _id
      buyer {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      category
      condition
      date
      description
      image
      name
      price
      seller {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      status
      possible_buyers {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      completion_date
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
        commenter {
          _id
          firstname
          lastname
        }
        rating
        comment
        date
      }
      rating
    }
  }
`;

export const ADD_PRODUCT = gql`
  mutation Mutation(
    $name: String!
    $price: Float!
    $description: String!
    $condition: String!
    $sellerId: String!
    $image: String!
    $category: String!
  ) {
    addProduct(
      name: $name
      price: $price
      description: $description
      condition: $condition
      seller_id: $sellerId
      image: $image
      category: $category
    ) {
      _id
      buyer {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      category
      condition
      date
      description
      image
      name
      price
      seller {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      status
      possible_buyers {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      completion_date
    }
  }
`;

export const EDIT_PRODUCT = gql`
  mutation (
    $id: String!
    $name: String!
    $price: Float!
    $description: String
    $condition: String!
    $sellerId: String!
    $image: String!
    $category: String!
    $status: String!
    $buyerId: String
  ) {
    editProduct(
      _id: $id
      name: $name
      price: $price
      description: $description
      condition: $condition
      seller_id: $sellerId
      buyer_id: $buyerId
      image: $image
      status: $status
      category: $category
    ) {
      _id
      buyer {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
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
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      price
      seller {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      status
      completion_date
    }
  }
`;

export const ADD_POST = gql`
  mutation (
    $buyer_id: String!
    $name: String!
    $category: String!
    $price: Float!
    $condition: String!
    $description: String!
  ) {
    addPost(
      buyer_id: $buyer_id
      name: $name
      category: $category
      price: $price
      condition: $condition
      description: $description
    ) {
      _id
      buyer {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      seller {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      name
      category
      price
      condition
      date
      description
      status
      possible_sellers {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      completion_date
    }
  }
`;

export const EDIT_POST = gql`
  mutation (
    $id: String!
    $buyer_id: String!
    $seller_id: String
    $name: String!
    $category: String!
    $price: Float!
    $condition: String!
    $description: String
    $status: String!
  ) {
    editPost(
      _id: $id
      buyer_id: $buyer_id
      seller_id: $seller_id
      name: $name
      category: $category
      price: $price
      condition: $condition
      description: $description
      status: $status
    ) {
      _id
      buyer {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      seller {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      name
      category
      price
      condition
      date
      description
      status
      possible_sellers {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      completion_date
    }
  }
`;

export const ADD_MESSAGE = gql`
  mutation (
    $chatId: String!
    $sender_id: String!
    $message: String!
    $time: DateTime!
  ) {
    addMessage(
      _id: $chatId
      sender_id: $sender_id
      message: $message
      time: $time
    ) {
      message
      sender {
        _id
        firstname
      }
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
      rating
      comments {
        _id
        commenter {
          _id
          firstname
          lastname
        }
        rating
        comment
        date
      }
      favorite_products {
        _id
      }
      favorite_posts {
        _id
      }
    }
  }
`;

export const ADD_CHAT = gql`
  mutation ($participants_id: [String!]!) {
    addChat(participants_id: $participants_id) {
      _id
      participants {
        _id
        firstname
      }
      messages {
        message
        sender {
          _id
          firstname
        }
        time
      }
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

export const ADD_POSSIBLE_BUYER = gql`
  mutation Mutation($id: String!, $buyerId: String!) {
    addPossibleBuyer(_id: $id, buyer_id: $buyerId) {
      _id
      buyer {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      category
      condition
      date
      description
      image
      name
      price
      seller {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      status
      possible_buyers {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
    }
  }
`;

export const REMOVE_POSSIBLE_BUYER = gql`
  mutation Mutation($id: String!, $buyerId: String!) {
    removePossibleBuyer(_id: $id, buyer_id: $buyerId) {
      _id
      buyer {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      category
      condition
      date
      description
      image
      name
      price
      seller {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      status
      possible_buyers {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
    }
  }
`;

export const ADD_POSSIBLE_SELLER = gql`
  mutation Mutation($id: String!, $sellerId: String!) {
    addPossibleSeller(_id: $id, seller_id: $sellerId) {
      _id
      buyer {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      category
      condition
      date
      description
      name
      possible_sellers {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      price
      seller {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      status
    }
  }
`;

export const REMOVE_POSSIBLE_SELLER = gql`
  mutation Mutation($id: String!, $sellerId: String!) {
    removePossibleSeller(_id: $id, seller_id: $sellerId) {
      _id
      buyer {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      category
      condition
      date
      description
      name
      possible_sellers {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      price
      seller {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      status
    }
  }
`;

export const SEARCH_POSTS = gql`
  query ($searchTerm: String!, $category: String) {
    searchPostsByName(searchTerm: $searchTerm, category: $category) {
      _id
      buyer {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      seller {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      name
      category
      date
      price
      condition
      description
      status
      possible_sellers {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      completion_date
    }
  }
`;

export const SEARCH_PRODUCTS_BY_NAME = gql`
  query ($name: String!, $category: String) {
    searchProductsByName(name: $name, category: $category) {
      _id
      buyer {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      category
      condition
      image
      date
      description
      name
      price
      seller {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      status
      possible_buyers {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      completion_date
    }
  }
`;

export const SEARCH_PRODUCTS_BY_ID = gql`
  query GetProductById($id: String!) {
    getProductById(_id: $id) {
      _id
      buyer {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
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
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      price
      seller {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      status
      completion_date
    }
  }
`;

export const SEARCH_POST_BY_ID = gql`
  query Query($id: String!) {
    getPostById(_id: $id) {
      _id
      buyer {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      category
      completion_date
      condition
      date
      description
      name
      possible_sellers {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      price
      seller {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      status
      completion_date
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation (
    $user_id: String!
    $comment_id: String!
    $rating: Int!
    $comment: String
    $firstname: String!
  ) {
    addComment(
      user_id: $user_id
      comment_id: $comment_id
      rating: $rating
      comment: $comment
      firstname: $firstname
    ) {
      _id
      email
      firstname
      lastname
      comments {
        _id
        commenter {
          _id
          firstname
          lastname
        }
        rating
        comment
        date
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
        commenter {
          _id
          firstname
          lastname
        }
        rating
        comment
        date
      }
      rating
    }
  }
`;

export const ADD_FAVORITE_TO_USER = gql`
  mutation Mutation($id: String!, $productId: String!) {
    addProductToUserFavorite(_id: $id, productId: $productId) {
      _id
      email
      firstname
      lastname
      comments {
        _id
        commenter {
          _id
          firstname
          lastname
        }
        rating
        comment
        date
      }
      rating
      favorite_products {
        _id
      }
      favorite_posts {
        _id
      }
    }
  }
`;

export const REMOVE_FAVORITE_FROM_USER = gql`
  mutation Mutation($id: String!, $productId: String!) {
    removeProductFromUserFavorite(_id: $id, productId: $productId) {
      _id
      email
      firstname
      lastname
      comments {
        _id
        commenter {
          _id
          firstname
          lastname
        }
        rating
        comment
        date
      }
      rating
      favorite_products {
        _id
      }
      favorite_posts {
        _id
      }
    }
  }
`;

export const ADD_FAVORITE_POST_TO_USER = gql`
  mutation Mutation($id: String!, $postId: String!) {
    addPostToUserFavorite(_id: $id, postId: $postId) {
      _id
      email
      firstname
      lastname
      comments {
        _id
        commenter {
          _id
          firstname
          lastname
        }
        rating
        comment
        date
      }
      rating
      favorite_products {
        _id
      }
      favorite_posts {
        _id
      }
    }
  }
`;

export const REMOVE_FAVORITE_POST_FROM_USER = gql`
  mutation Mutation($id: String!, $postId: String!) {
    removePostFromUserFavorite(_id: $id, postId: $postId) {
      _id
      email
      firstname
      lastname
      comments {
        _id
        commenter {
          _id
          firstname
          lastname
        }
        rating
        comment
        date
      }
      rating
      favorite_products {
        _id
      }
      favorite_posts {
        _id
      }
    }
  }
`;

export const GET_PRODUCTS_BY_CATEGORY = gql`
  query Query($category: String!) {
    getProductsByCategory(category: $category) {
      _id
      buyer {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      category
      condition
      date
      description
      image
      name
      price
      seller {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      status
      possible_buyers {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      completion_date
    }
  }
`;

export const GET_POSTS_BY_CATEGORY = gql`
  query Query($category: String!) {
    getPostsByCategory(category: $category) {
      _id
      buyer {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      condition
      category
      date
      description
      name
      price
      status
      seller {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      possible_sellers {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      completion_date
    }
  }
`;

export const GET_POSTS_BY_STATUS = gql`
  query GetPostsByStatus($status: String!) {
    getPostsByStatus(status: $status) {
      _id
      buyer {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      condition
      category
      date
      description
      name
      price
      status
      seller {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      possible_sellers {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      completion_date
    }
  }
`;

export const CLEAR_PRODUCT_BUY = gql`
  mutation Mutation($_id: String!) {
    clearProductBuy(_id: $_id) {
      _id
      email
      firstname
      lastname
      comments {
        _id
        commenter {
          _id
          firstname
          lastname
        }
        rating
        comment
        date
      }
      rating
      favorite_products {
        _id
        buyer {
          _id
        }
        seller {
          _id
        }
        possible_buyers {
          _id
        }
        category
        condition
        date
        description
        image
        name
        price
        status
        completion_date
      }
      favorite_posts {
        _id
        buyer {
          _id
        }
        seller {
          _id
        }
        possible_sellers {
          _id
        }
        category
        condition
        date
        description
        name
        price
        status
        completion_date
      }
      possible_buyer {
        _id
        category
        condition
        date
        description
        image
        name
        price
        seller {
          _id
          firstname
          lastname
          rating
          comments {
            _id
            commenter {
              _id
              firstname
              lastname
            }
            rating
            comment
            date
          }
        }
        possible_buyers {
          _id
        }
        status
      }
      possible_seller {
        _id
        category
        condition
        date
        description
        name
        price
        possible_sellers {
          _id
        }
        buyer {
          _id
        }
        seller {
          _id
          firstname
          lastname
          rating
          comments {
            _id
            commenter {
              _id
              firstname
              lastname
            }
            rating
            comment
            date
          }
        }
        status
      }
    }
  }
`;

export const CLEAR_PRODUCT_SELL = gql`
  mutation Mutation($_id: String!) {
    clearProductSell(_id: $_id) {
      _id
      buyer {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      condition
      category
      date
      description
      name
      price
      status
      image
      seller {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      possible_buyers {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      completion_date
    }
  }
`;

export const CLEAR_POST_BUY = gql`
  mutation Mutation($_id: String!) {
    clearPostBuy(_id: $_id) {
      _id
      buyer {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      condition
      category
      date
      description
      name
      price
      status
      seller {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      possible_sellers {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      completion_date
    }
  }
`;

export const CLEAR_POST_SELL = gql`
  mutation Mutation($_id: String!) {
    clearPostSell(_id: $_id) {
      _id
      email
      firstname
      lastname
      comments {
        _id
        commenter {
          _id
          firstname
          lastname
        }
        rating
        comment
        date
      }
      rating
      favorite_products {
        _id
        buyer {
          _id
        }
        seller {
          _id
        }
        possible_buyers {
          _id
        }
        category
        condition
        date
        description
        image
        name
        price
        status
        completion_date
      }
      favorite_posts {
        _id
        buyer {
          _id
        }
        seller {
          _id
        }
        possible_sellers {
          _id
        }
        category
        condition
        date
        description
        name
        price
        status
        completion_date
      }
      possible_buyer {
        _id
        category
        condition
        date
        description
        image
        name
        price
        seller {
          _id
          firstname
          lastname
          rating
          comments {
            _id
            commenter {
              _id
              firstname
              lastname
            }
            rating
            comment
            date
          }
        }
        possible_buyers {
          _id
        }
        status
      }
      possible_seller {
        _id
        category
        condition
        date
        description
        name
        price
        possible_sellers {
          _id
        }
        buyer {
          _id
        }
        seller {
          _id
          firstname
          lastname
          rating
          comments {
            _id
            commenter {
              _id
              firstname
              lastname
            }
            rating
            comment
            date
          }
        }
        status
      }
    }
  }
`;

export const CONFIRM_PRODUCT = gql`
  mutation Mutation($_id: String!, $buyer_id: String!) {
    confirmProduct(_id: $_id, buyer_id: $buyer_id) {
      _id
      buyer {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      category
      condition
      date
      description
      image
      name
      price
      seller {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      status
      possible_buyers {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      completion_date
    }
  }
`;

export const CONFIRM_POST = gql`
  mutation Mutation($_id: String!, $seller_id: String!) {
    confirmPost(_id: $_id, seller_id: $seller_id) {
      _id
      buyer {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      seller {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      name
      category
      date
      price
      condition
      description
      status
      possible_sellers {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      completion_date
    }
  }
`;

export const REJECT_PRODUCT = gql`
  mutation Mutation($_id: String!, $buyer_id: String!) {
    rejectProduct(_id: $_id, buyer_id: $buyer_id) {
      _id
      buyer {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      category
      condition
      date
      description
      image
      name
      price
      seller {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      status
      possible_buyers {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      completion_date
    }
  }
`;

export const REJECT_POST = gql`
  mutation Mutation($_id: String!, $seller_id: String!) {
    rejectPost(_id: $_id, seller_id: $seller_id) {
      _id
      buyer {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      seller {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      name
      category
      date
      price
      condition
      description
      status
      possible_sellers {
        _id
        firstname
        lastname
        rating
        comments {
          _id
          commenter {
            _id
            firstname
            lastname
          }
          rating
          comment
          date
        }
      }
      completion_date
    }
  }
`;
