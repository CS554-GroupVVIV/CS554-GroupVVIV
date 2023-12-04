import { GraphQLScalarType, Kind } from "graphql";
import { ObjectId } from "mongodb";
export const typeDefs = `#graphql
    scalar ObjectID
    scalar Number
    scalar DateTime
    scalar base64

    type Query {
        products: [Product],
        searchProductsByName(name: String!): [Product],
        getProductById(_id:ObjectID!):Product
    }
    
    type Product {
        _id: ObjectID!,
        name: String!,
        price: Number!,
        date:DateTime!,
        description:String,
        condition:String,
        seller_id:String!,
        buyer_id:ObjectID,
        image:base64,
        category:String,
        isSold:Boolean!
    }

    type Mutation {
        addProduct(name:String!, price: Number!,date:DateTime!,description:String!,condition:String!,seller_id:String!, image:base64!,category:String!):Product,
        editProduct(_id: ObjectID!, name:String, price: Number,date:DateTime,description:String,condition:String,seller_id:String,buyer_id:ObjectID, image:base64,category:String,isSold:Boolean! ):Product,
        removeProduct(_id:ObjectID!):Product
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
