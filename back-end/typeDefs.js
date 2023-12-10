import { GraphQLScalarType, Kind } from "graphql";
import { ObjectId } from "mongodb";
export const typeDefs = `#graphql
    scalar ObjectID
    scalar Number
    scalar DateTime
    scalar base64

    type Query {
        products: [Product],
        posts: [Post],
        searchProducts(searchTerm: String!): [Product],
        searchProductsByName(name: String!): [Product],
        getProductById(_id:ObjectID!):Product,
        getUserById(_id: String!): User,
        getChatById(_id: String!): Chat,
        getChatByParticipants(participants: [String!]!): Chat
    }
    
    type Product {
        _id: ObjectID!,
        name: String!,
        price: Number!,
        date:DateTime!,
        description:String,
        condition:String,
        seller_id:ObjectID,
        buyer_id:ObjectID,
        image:base64,
        category:String,
        isSold:Boolean!
    }

    type Post {
      _id: ObjectID!,
      buyer_id: ObjectID!,
      seller_id: ObjectID,
      item: String!,
      category:String!,
      price: Number!,
      condition:String,
      date:DateTime!,
      description:String,
      isComplete:Boolean!
  }

    type User{
    _id : String,
    email: String,
    firstname: String,
    lastname: String,
    password: String
  }

    type Message{
    sender : String!,
    time : DateTime,
    message : String
  }

    type Chat{
    _id : ObjectID!,
    participants : [String],
    messages : [Message]
  }

    type Mutation {
        addProduct(name:String!, price: Number!,date:DateTime!,description:String!,condition:String!,seller_id:ObjectID!, image:base64!,category:String!):Product,
        addPost(buyer_id: String!, item:String!, category:String!, price: Number!, condition:String!, description:String!):Post,
        editProduct(_id: ObjectID!, name:String, price: Number,date:DateTime,description:String,condition:String,seller_id:ObjectID!,buyer_id:ObjectID, image:base64,category:String,isSold:Boolean! ):Product,
        removeProduct(_id:ObjectID!):Product,
        addUser(_id: String!, email: String!, firstname: String!, lastname: String!, password: String!): User,
        editUser(_id: String!, email: String!, firstname: String!, lastname: String!, password: String!): User,
        editPassword(_id: String!, prePassword: String!, newPassword: String!): User,
        addChat(participants: [String!]!): Chat,
        addMessage(_id: ObjectID!, sender: ID!, time: DateTime!, message: String!): Message
    }
`;

export const ObjectID = new GraphQLScalarType({
  name: "ObjectID",
  description: "MongoDB ObjectID scalar type",
  serialize(value) {
    return value.toString();
  },
  parseValue(value) {
    return new ObjectId(value);
  },
  parseLiteral(ast) {
    if (ast.kind === "StringValue") {
      return new ObjectId(ast.value);
    }
    return null;
  },
});

export const DateTime = new GraphQLScalarType({
  // MM/DD/YYYY LOCALTIME
  name: "DateTime",
  description: "DateTime scalar type",
  serialize(value) {
    return value.toISOString();
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

export const Base64 = new GraphQLScalarType({
  name: "Base64",
  description: "Base64 custom scalar type",
  serialize(value) {
    return Buffer.from(value).toString("base64");
  },
  parseValue(value) {
    return Buffer.from(value, "base64");
  },
  parseLiteral(ast) {
    if (ast.kind === "StringValue") {
      return Buffer.from(ast.value, "base64");
    }
    return null;
  },
});
