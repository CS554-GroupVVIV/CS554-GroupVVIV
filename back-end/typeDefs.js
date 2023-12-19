import { GraphQLScalarType, Kind } from "graphql";
import { ObjectId } from "mongodb";
export const typeDefs = `#graphql
    scalar DateTime

    type Query {
        products: [Product],
        posts: [Post],
        users: [User],
        searchPosts(searchTerm: String!): [Post],
        searchProductsByName(name: String!): [Product],
        getProductById(_id:String!):Product,
        getProductsByCategory(category:String!):[Product],
        getProductsByPriceRange(low:Int,high:Int!):[Product],
        getProductsByStatus(status:String!):[Product],
        getPostById(_id:String!):Post,
        getPostsByCategory(category:String!):[Post],
        getPostsByStatus(status:String!):[Post],
        getUserById(_id: String!): User,
        getChatById(_id: String!): Chat,
        getChatByParticipants(participants: [String!]!): Chat,
        getUsersByIds(ids: [String!]!): [User],
        getPostBySeller(_id: String!):[Post],
        getPostByBuyer(_id: String!):[Post],
        getProductBySeller(_id: String!):[Product],
        getProductByBuyer(_id: String!):[Product],
        getBuyerByProduct(_id: String!):User,
        getSellerByPost(_id: String!):User,
        getComment(user_id:String!, comment_id:String!): User
    }
    
    type Product {
        _id: String!,
        name: String!,
        price: Float!,
        date: String!,
        description:String,
        condition:String!,
        seller_id:String!,
        buyer_id:String,
        image:String!,
        category:String!,
        status:String!,
        possible_buyers:[User]
    }

    type Post {
      _id: String!,
      buyer_id: String!,
      seller_id: String,
      item: String!,
      category:String!,
      price: Float!,
      condition:String!,
      date: String!,
      description:String,
      status:String!,
      possible_sellers:[User]
  }

    type Comment{
      _id : String!,
      rating: Int!,
      comment_id: String!,
      comment: String,
    }

    type User{
    _id : String!,
    email: String!,
    firstname: String!,
    lastname: String!,
    comments:[Comment]
    rating: Float
    favorite: [String]!
  }

    type Message{
    sender : String!,
    time : DateTime!,
    message : String!
  }

    type Chat{
    _id : String!,
    participants : [String!]!,
    messages : [Message!]!
  }

    type Mutation {
        addProduct(name:String!, price: Float!,description:String!,condition:String!,seller_id:String!, image:String!,category:String!):Product,
        addPossibleBuyer(_id:String!,buyer_id:String!):Product,
        editProduct(_id: String!, name:String!, price: Float!,description:String!,condition:String!,seller_id:String!,buyer_id:String, image:String!,category:String!,status:String! ):Product,
        removeProduct(_id:String!):Product,
        addPost(buyer_id: String!, item:String!, category:String!, price: Float!, condition:String!, description:String):Post,
        addPossibleSeller(_id:String!,seller_id:String!):Post,
        editPost(_id: String!, buyer_id: String!, item:String!, category:String!, price: Float!, condition:String!, description:String!, status:String!):Post,
        removePost(_id:String!):Post,
        addUser(_id: String!, email: String!, firstname: String!, lastname: String!, favorite: String): User,
        editUser(_id: String!, email: String!, firstname: String!, lastname: String!): User,
        addChat(participants: [String!]!): Chat,
        addMessage(_id: String!, sender: ID!, time: DateTime!, message: String!): Message,
        retrievePost(_id: String!, user_id:String!): Post,
        repostPost(_id: String!, user_id:String!): Post,
        addComment(user_id: String!, comment_id: String!, rating: Int!, comment: String): User,
        editComment(user_id: String!, comment_id: String!, rating: Int!, comment: String): User,
        addProductToUserFavorite(_id:String!,productId:String!):[String],
        removeProductFromUserFavorite(_id:String!,productId:String!):[String]
    }
`;

// export const ObjectID = new GraphQLScalarType({
//   name: "ObjectID",
//   description: "MongoDB ObjectID scalar type",
//   serialize(value) {
//     return value.toString();
//   },
//   parseValue(value) {
//     return new ObjectId(value);
//   },
//   parseLiteral(ast) {
//     if (ast.kind === "StringValue") {
//       return new ObjectId(ast.value);
//     }
//     return null;
//   },
// });

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

// export const Base64 = new GraphQLScalarType({
//   name: "Base64",
//   description: "Base64 custom scalar type",
//   serialize(value) {
//     return Buffer.from(value).toString("base64");
//   },
//   parseValue(value) {
//     return Buffer.from(value, "base64");
//   },
//   parseLiteral(ast) {
//     if (ast.kind === "StringValue") {
//       return Buffer.from(ast.value, "base64");
//     }
//     return null;
//   },
// });
