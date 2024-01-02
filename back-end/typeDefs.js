import { GraphQLScalarType, Kind } from "graphql";
export const typeDefs = `#graphql
    scalar DateTime

    type Query {
        products: [Product],
        posts: [Post],
        users: [User],
        searchPostsByName(searchTerm: String!, category: String): [Post],
        searchProductsByName(name: String!, category: String): [Product],
        getProductById(_id:String!):Product,
        getProductsByCategory(category:String!):[Product],
        getProductsByPriceRange(low:Int,high:Int!):[Product],
        getProductsByStatus(status:String!):[Product],
        getPostById(_id:String!):Post,
        getPostsByCategory(category:String!):[Post],
        getPostsByStatus(status:String!):[Post],
        getUserById(_id: String!): User,
        getChatByParticipants(participants: [String!]!): Chat,
        getUsersByIds(ids: [String!]!): [User],
        getPostBySeller(_id: String!):[Post],
        getPostByBuyer(_id: String!):[Post],
        getProductBySeller(_id: String!):[Product],
        getProductByBuyer(_id: String!):[Product],
        getComment(user_id:String!, comment_id:String!): User
    }
    
    type Product {
        _id: String!,
        name: String!,
        price: Float!,
        date: String!,
        description:String,
        condition:String!,
        seller:User!,
        buyer:User,
        image:String!,
        category:String!,
        status:String!,
        possible_buyers:[User]!,
        completion_date: String
    }

    type Post {
      _id: String!,
      buyer: User!,
      seller: User,
      name: String!,
      category:String!,
      price: Float!,
      condition:String!,
      date: String!,
      description:String,
      status:String!,
      possible_sellers:[User]!,
      completion_date: String
    }

    type Comment{
      _id : String!,
      rating: Int!,
      commenter: User!,
      comment: String,
      date: String!,
    }

    type User{
      _id : String!,
      email: String!,
      firstname: String!,
      lastname: String!,
      comments:[Comment]!,
      rating: Float!,
      favorite_products: [Product]!,
      favorite_posts:[Post]!,
      possible_buyer:[Product]!,
      possible_seller:[Post]!
    }

    type Chat{
      _id : String!,
      participants : [User!]!,
      messages : [Message!]!,
    }

    type Message{
      sender : User!,
      time : DateTime!,
      message : String!
    }

    type Mutation {
        addProduct(name:String!, price: Float!,description:String!,condition:String!,seller_id:String!, image:String!,category:String!):Product,
        addPossibleBuyer(_id:String!,buyer_id:String!):Product,
        removePossibleBuyer(_id:String!,buyer_id:String!):Product,
        editProduct(_id: String!, name:String!, price: Float!,description:String,condition:String!,seller_id:String!,buyer_id:String, image:String!,category:String!,status:String! ):Product,
        removeProduct(_id:String!):Product,
        addPost(buyer_id: String!, name:String!, category:String!, price: Float!, condition:String!, description:String):Post,
        addPossibleSeller(_id:String!,seller_id:String!):Post,
        removePossibleSeller(_id:String!,seller_id:String!):Post,
        editPost(_id: String!, buyer_id: String!,seller_id:String, name:String!, category:String!, price: Float!, condition:String!, description:String, status:String!):Post,
        removePost(_id:String!):Post,
        addUser(_id: String!, email: String!, firstname: String!, lastname: String!, favorite: String): User,
        editUser(_id: String!, email: String!, firstname: String!, lastname: String!): User,
        addChat(participants_id: [String!]!): Chat,
        addMessage(_id: String!, sender_id: String!, time: DateTime!, message: String!): Message,
        addComment(user_id: String!, comment_id: String!, rating: Int!, comment: String,firstname: String!): User,
        editComment(user_id: String!, comment_id: String!, rating: Int!, comment: String): User,
        addProductToUserFavorite(_id:String!,productId:String!):User!,
        removeProductFromUserFavorite(_id:String!,productId:String!):User!
        addPostToUserFavorite(_id:String!,postId:String!):User!,
        removePostFromUserFavorite(_id:String!,postId:String!):User!,
        clearProductBuy(_id:String!): User!,
        clearProductSell(_id:String!): [Product]!,
        clearPostBuy(_id:String!): [Post]!,
        clearPostSell(_id:String!): User!,
        confirmProduct(_id: String!,buyer_id:String!):Product!,
        confirmPost(_id: String!,seller_id:String!):Post!,
        rejectProduct(_id: String!,buyer_id:String!):Product!,
        rejectPost(_id: String!,seller_id:String!):Post!
    }
`;
// clearInactiveProductFav(_id:String!): User!,
// clearInactivePostFav(_id:String!): User!,
// clearCompletedProductFav(_id:String!): User!,
// clearCompletedProductFav(_id:String!): User!,

export const DateTime = new GraphQLScalarType({
  // MM/DD/YYYY LOCALTIME
  name: "DateTime",
  description: "DateTime scalar type",
  serialize(value) {
    return new Date(value).toISOString();
  },
  parseValue(value) {
    return new Date(value);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});
