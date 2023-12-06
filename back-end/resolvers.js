import { GraphQLError } from "graphql";
import {
  products as productCollection,
  posts as postCollection,
} from "./config/mongoCollections.js";
// import { v4 as uuid } from "uuid";
import { ObjectId } from "mongodb";
import { ObjectID, DateTime, Base64 } from "./typeDefs.js";
import {
  checkId,
  checkName,
  checkItem,
  checkCategory,
  checkPrice,
  checkCondition,
  checkDate,
  checkDescription,
} from "./helper.js";

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

    posts: async () => {
      try {
        const posts = await postCollection();
        const allPosts = await posts.find({}).toArray();
        if (!allPosts) {
          throw new GraphQLError("Post not found", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        return allPosts;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    searchProducts: async (_, args) => {
      try {
        const products = await productCollection();
        products.createIndex({
          name: "text",
          // description: "text",
          // category: "text",
        });

        const productList = await products
          .find({ $text: { $search: args.searchTerm } })
          .toArray();
        if (!productList) {
          throw new GraphQLError("product not found", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        return productList;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    searchProductsByName: async (_, args) => {
      try {
        let productName = checkName(args.name);
        const products = await productCollection();
        const productsByName = await products
          .find({ name: { $regex: productName, $options: "i" } })
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

    addPost: async (_, args) => {
      try {
        if (Object.keys(args).length !== 6) {
          throw new Error("all fields are required");
        }
        let buyer_id = checkId(args.buyer_id);
        let item = checkItem(args.item);
        let category = checkCategory(args.category);
        let price = checkPrice(args.price);
        let condition = checkCondition(args.condition);
        let description = checkDescription(args.description);
        const posts = await postCollection();
        const newPost = {
          _id: new ObjectId().toString(),
          buyer_id: buyer_id,
          seller_id: "",
          item: item,
          category: category,
          price: price,
          condition: condition,
          date: new Date(),
          description: description,
          isComplete: false,
        };
        let insertedPost = await posts.insertOne(newPost);
        if (!insertedPost) {
          throw new GraphQLError(`Could not Add Post`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
        return newPost;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
  },
};
