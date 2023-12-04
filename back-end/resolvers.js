import { GraphQLError } from "graphql";
import { products as productCollection } from "./config/mongoCollections.js";
// import { v4 as uuid } from "uuid";
import { ObjectId } from "mongodb";
import { ObjectID, DateTime, Base64 } from "./typeDefs.js";
import { checkId, checkName } from "./helper.js";

export const resolvers = {
  ObjectID: ObjectID,
  DateTime: DateTime,
  base64: Base64,

  Query: {
    products: async (_, args) => {
      try {
        const products = await productCollection();
        const allProducts = await products.find({}).toArray();
        if (!allProducts) {
          throw new GraphQLError("Products not found", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        return allProducts;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    searchProductsByName: async (_, args) => {
      try {
        let productName = checkName(args.name);
        const products = await productCollection();
        const productsByName = await products
          .find({ name: productName })
          .toArray();
        if (!productsByName) {
          throw new GraphQLError("product not found", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        return productsByName;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    getProductById: async (_, args) => {
      try {
        console.log(args);
        let id = checkId(args._id.toString());
        const products = await productCollection();
        const product = await products.find({ _id: id });
        if (!product) {
          throw new GraphQLError("product not found", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        return product;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
  },

  Mutation: {
    addProduct: async (_, args) => {
      try {
        if (Object.keys(args).length !== 8) {
          throw new Error("all fields are required");
        }
        let name = args.name;
        let price = args.price;
        let date = args.date;
        let description = args.description;
        let condition = args.condition;
        let seller_id = args.seller_id;
        let image = args.image;
        let category = args.category;
        // ********need input check*************
        const products = await productCollection();
        const newProduct = {
          _id: new ObjectId().toString(),
          name: name,
          price: price,
          date: date,
          description: description,
          condition: condition,
          seller_id: seller_id,
          buyer_id: undefined,
          image: image,
          category: category,
          isSold: false,
        };
        let insertedProduct = await products.insertOne(newProduct);
        if (!insertedProduct) {
          throw new GraphQLError(`Could not Add Author`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
        return newProduct;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
  },
};
