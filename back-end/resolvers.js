import { GraphQLError } from "graphql";
import {
  products as productCollection,
  posts as postCollection,
  users as userCollection,
  chats as chatCollection,
} from "./config/mongoCollections.js";
import { client } from "./server.js";
import { ObjectId } from "mongodb";
import { ObjectID, DateTime } from "./typeDefs.js";
import {
  checkId,
  checkName,
  checkItem,
  checkCategory,
  checkPrice,
  checkCondition,
  checkDate,
  checkDescription,
  checkEmail,
  checkUserAndChatId,
  checkFirstNameAndLastName,
  capitalizeName,
  checkUrl,
  dateObjectToHTMLDate,
  HTMLDateToDateObject,
} from "./helper.js";

export const resolvers = {
  ObjectID: ObjectID,
  DateTime: DateTime,
  // base64: Base64,

  Query: {
    products: async (_, args) => {
      try {
        const products = await productCollection();
        var allProducts = await client.json.get(`allProducts`, "$");
        if (!allProducts) {
          allProducts = await products.find({}).toArray();
          if (!allProducts) {
            throw new GraphQLError("Internal Server Error", {
              extensions: { code: "INTERNAL_SERVER_ERROR" },
            });
          }
          client.json.set(`allProducts`, "$", allProducts);
          client.expire(`allProducts`, 3600);
        }
        return allProducts;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    posts: async () => {
      try {
        const posts = await postCollection();
        var allPosts = await client.json.get(`allPosts`, "$");
        if (!allPosts) {
          allPosts = await posts.find({}).toArray();
          if (!allPosts) {
            throw new GraphQLError("Internal Server Error", {
              extensions: { code: "INTERNAL_SERVER_ERROR" },
            });
          }
          client.json.set(`allPosts`, "$", allPosts);
          client.expire(`allPosts`, 3600);
        }
        return allPosts;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    searchProducts: async (_, args) => {
      try {
        const products = await productCollection();
        var productList = await client.json.get(
          `searchProducts-${args.searchTerm}`,
          "$"
        );
        if (!productList) {
          products.createIndex({
            name: "text",
            // description: "text",
            // category: "text",
          });
          productList = await products
            .find({ $text: { $search: args.searchTerm } })
            .toArray();
          if (!productList) {
            throw new GraphQLError("product not found", {
              extensions: { code: "NOT_FOUND" },
            });
          }
          client.json.set(
            `searchProducts-${args.searchTerm}`,
            "$",
            productList
          );
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
        var productsByName = await client.json.get(
          `searchProductsByName-${productName}`,
          "$"
        );
        if (!productsByName) {
          productsByName = await products
            .find({ name: { $regex: productName, $options: "i" } })
            .toArray();
          if (!productsByName) {
            throw new GraphQLError("product not found", {
              extensions: { code: "NOT_FOUND" },
            });
          }
          client.json.set(
            `searchProductsByName-${productName}`,
            "$",
            productsByName
          );
        }
        return productsByName;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    getProductById: async (_, args) => {
      try {
        let id = checkId(args._id);
        var product = await client.json.get(`getProductById-${id}`, "$");
        if (!product) {
          const products = await productCollection();
          product = await products.findOne({ _id: new ObjectId(id) });
          if (!product) {
            throw new GraphQLError("product not found", {
              extensions: { code: "NOT_FOUND" },
            });
          }
          client.json.set(`getProductById-${id}`, "$", product);
        }
        return product;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    getProductsByIds: async (_, args) => {
      try {
        const productData = await productCollection();
        const objectIds = args.ids.map((id) => new ObjectId(id));
        const products = await productData
          .find({ _id: { $in: objectIds } })
          .toArray();
        if (!products) {
          throw new GraphQLError("product not found", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        return products;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    getPostById: async (_, args) => {
      try {
        let id = checkId(args._id);
        var post = await client.json.get(`getPostById-${id}`, "$");
        if (!post) {
          const posts = await postCollection();
          const post = await posts.findOne({ _id: id.toString() });
          if (!post) {
            throw new GraphQLError("post not found", {
              extensions: { code: "NOT_FOUND" },
            });
          }
        }
        return post;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    getUserById: async (_, args) => {
      try {
        let id = checkUserAndChatId(args._id.toString());
        const usersData = await userCollection();
        var user = await client.json.get(`getUserById-${id}`, "$");
        if (!user) {
          const user = await usersData.findOne({ _id: id });
          if (!user) {
            throw new GraphQLError("User not found", {
              extensions: { code: "NOT_FOUND" },
            });
          }
        }
        return user;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    getUsersByIds: async (_, args) => {
      try {
        // console.log(args);
        // let ids = checkUserAndChatId();
        const usersData = await userCollection();
        const users = await usersData
          .find({ _id: { $in: args.ids } })
          .toArray();
        if (!users) {
          throw new GraphQLError("User not found", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        return users;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    getChatById: async (_, args) => {
      try {
        console.log(args);
        let id = checkUserAndChatId(args._id.toString());
        const chatData = await chatCollection();
        const chat = await chatData.findOne({ _id: id });
        // console.log(chat);
        if (!chat) {
          throw new GraphQLError("Chat not found", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        return chat;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    getChatByParticipants: async (_, args) => {
      try {
        // console.log(args);

        const chatData = await chatCollection();
        const chat = await chatData.findOne({
          participants: { $all: args.participants },
        });

        if (!chat) {
          throw new GraphQLError("Chat not found", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        return chat;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    getPostBySeller: async (_, args) => {
      try {
        const posts = await postCollection();
        var sellerPosts = await client.json.get(
          `getPostBySeller-${args._id}`,
          "$"
        );
        if (!sellerPosts) {
          sellerPosts = await posts.find({ seller_id: args._id }).toArray();
          if (!sellerPosts) {
            throw new GraphQLError("Post not found", {
              extensions: { code: "NOT_FOUND" },
            });
          }
          client.json.set(`getPostBySeller-${args._id}`, "$", sellerPosts);
          client.expire(`getPostBySeller-${args._id}`, 60);
        }
        return sellerPosts;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    getPostByBuyer: async (_, args) => {
      try {
        var buyerPosts = await client.json.get(
          `getPostByBuyer-${args._id}`,
          "$"
        );
        if (!buyerPosts) {
          const posts = await postCollection();
          buyerPosts = await posts.find({ buyer_id: args._id }).toArray();
          if (!buyerPosts) {
            throw new GraphQLError("Post not found", {
              extensions: { code: "NOT_FOUND" },
            });
          }
          client.json.set(`getPostByBuyer-${args._id}`, "$", buyerPosts);
          client.expire(`getPostByBuyer-${args._id}`, 60);
        }
        return buyerPosts;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
  },

  Mutation: {
    addProduct: async (_, args) => {
      try {
        if (Object.keys(args).length !== 7) {
          throw new Error("all fields are required");
        }
        let name = checkName(args.name);
        let price = checkPrice(args.price);
        let date = new Date();
        let description = checkDescription(args.description);
        let condition = checkCondition(args.condition);
        let seller_id = checkId(args.seller_id);
        let image = checkUrl(args.image);
        let category = checkCategory(args.category);
        // ********need input check*************
        const products = await productCollection();
        const newProduct = {
          _id: new ObjectId(),
          name: name,
          price: price,
          date: date,
          description: description,
          condition: condition,
          seller_id: seller_id,
          buyer_id: "",
          image: image,
          category: category,
          status: "available",
        };
        let insertedProduct = await products.insertOne(newProduct);
        client.json.del(`allProducts`);
        client.json.set(`getProductById-${newProduct._id}`, "$", newProduct);
        if (!insertedProduct) {
          throw new GraphQLError(`Could not Add Author`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
        newProduct.date = dateObjectToHTMLDate(newProduct.date);
        return newProduct;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    editProduct: async (_, args) => {
      try {
        if (Object.keys(args).length !== 7) {
          throw new Error("all fields are required");
        }
        let name = checkName(args.name);
        let price = checkPrice(args.price);
        let description = checkDescription(args.description);
        let condition = checkCondition(args.condition);
        let seller_id = checkId(args.seller_id);
        let image = checkUrl(args.image);
        let category = checkCategory(args.category);
        // ********need input check*************
        const products = await productCollection();
        const updatedProduct = {
          name: name,
          price: price,
          description: description,
          condition: condition,
          seller_id: seller_id,
          buyer_id: "",
          image: image,
          category: category,
          status: "available",
        };
        let updated = await products.findOneAndUpdate(
          { _id: args._id },
          { $set: updatedProduct },
          { returnDocument: "after" }
        );
        client.json.del(`allProducts`);
        client.json.set(`getProductById-${args._id}`, "$", updated);
        if (!updated) {
          throw new GraphQLError(`Could not Edit Product`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
        return updated;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
    removeProduct: async (_, args) => {
      try {
        let id = checkId(args._id);
        const products = await productCollection();
        const deletedProduct = await products.findOneAndDelete({ _id: id });
        client.json.del(`allProducts`);
        client.json.del(`getProductById-${id}`);
        if (!deletedProduct) {
          throw new GraphQLError(`Could not Delete Product`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
        return deletedProduct;
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
          status: "active",
        };
        let insertedPost = await posts.insertOne(newPost);
        if (!insertedPost) {
          throw new GraphQLError(`Could not Add Post`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
        client.json.del(`allPosts`);
        client.json.set(`getPostById-${newPost._id}`, "$", newPost);
        newPost.date = dateObjectToHTMLDate(newPost.date);
        return newPost;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
    editPost: async (_, args) => {
      try {
        if (Object.keys(args).length !== 7) {
          throw new Error("all fields are required");
        }
        let buyer_id = checkId(args.buyer_id);
        let item = checkItem(args.item);
        let category = checkCategory(args.category);
        let price = checkPrice(args.price);
        let condition = checkCondition(args.condition);
        let description = checkDescription(args.description);
        const posts = await postCollection();
        const updatedPost = {
          buyer_id: buyer_id,
          seller_id: "",
          item: item,
          category: category,
          price: price,
          condition: condition,
          date: date,
          description: description,
          status: "available",
        };
        let updated = await posts.findOneAndUpdate(
          { _id: args._id },
          { $set: updatedPost },
          { returnDocument: "after" }
        );
        if (!updated) {
          throw new GraphQLError(`Could not Edit Post`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
        client.json.del(`allPosts`);
        client.json.set(`getPostById-${args._id}`, "$", updated);
        return updated;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
    removePost: async (_, args) => {
      try {
        let id = checkId(args._id);
        const posts = await postCollection();
        const deletedPost = await posts.findOneAndDelete({ _id: id });
        if (!deletedPost) {
          throw new GraphQLError(`Could not Delete Post`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
        client.json.del(`allPosts`);
        client.json.del(`getPostById-${id}`);
        return deletedPost;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
    addUser: async (_, args) => {
      try {
        let { _id, email, firstname, lastname } = args;
        // check ID not implement yet
        email = checkEmail(email);
        firstname = capitalizeName(
          checkFirstNameAndLastName(firstname, "First Name")
        );
        lastname = capitalizeName(
          checkFirstNameAndLastName(lastname, "Last Name")
        );

        const usersData = await userCollection();
        const newUser = {
          _id: _id.toString(),
          email,
          firstname,
          lastname,
        };
        const insertedUser = await usersData.insertOne(newUser);
        if (!insertedUser) {
          throw new GraphQLError(`Could not Add User`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
        client.json.set(`getUserById-${_id}`, "$", newUser);
        client.json.del(`allUsers`);
        return newUser;
      } catch (error) {
        throw new GraphQLError(error);
      }
    },

    editUser: async (_, args) => {
      try {
        let { _id, email, firstname, lastname } = args;
        console.log(args);
        // check ID not implement yet
        email = checkEmail(email);
        firstname = capitalizeName(
          checkFirstNameAndLastName(firstname, "First Name")
        );
        lastname = capitalizeName(
          checkFirstNameAndLastName(lastname, "Last Name")
        );

        const usersData = await userCollection();
        const updatedUserInfo = {
          email,
          firstname,
          lastname,
        };

        let updatedUser = await usersData.findOneAndUpdate(
          { _id: _id.toString() },
          { $set: updatedUserInfo },
          { returnDocument: "after" }
        );
        if (!updatedUser) {
          throw new GraphQLError(`Could not Edit User`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
        return updatedUser;
      } catch (error) {
        throw new GraphQLError(error);
      }
    },

    addChat: async (_, args) => {
      try {
        let { participants } = args;
        const chatData = await chatCollection();
        const newChat = {
          _id: new ObjectId(),
          participants,
          messages: [],
        };
        let insertedChat = await chatData.insertOne(newChat);
        if (!insertedChat) {
          throw new GraphQLError(`Could not Add chat`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
        return newChat;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    addMessage: async (_, args) => {
      try {
        let { _id, sender, time, message } = args;
        const chatData = await chatCollection();
        const newMessage = {
          sender,
          time,
          message,
        };

        let insertedMessage = await chatData.findOneAndUpdate(
          { _id: new ObjectId(_id) },
          {
            $push: {
              messages: newMessage,
            },
          }
        );
        if (!insertedMessage) {
          throw new GraphQLError(`Could not Add Message`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
        return newMessage;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    retrievePost: async (_, args) => {
      try {
        const id = checkId(args._id);
        const user_id = args.user_id;
        if (!user_id) {
          throw "Invalid User";
        }
        const posts = await postCollection();
        let post = await posts.findOne({ _id: id.toString() });
        if (!post) {
          throw new GraphQLError("post not found", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        if (post.buyer_id != user_id) {
          throw "Invalid User";
        }
        if (post.status !== "active") {
          throw "Cannot retrieve post";
        }
        const retrieve = await posts.updateOne(
          { _id: id.toString() },
          { $set: { status: "inactive" } }
        );

        if (retrieve.acknowledged != true) {
          throw "Fail to retrieve post";
        }
        post = await posts.findOne({ _id: id.toString() });
        return post;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    repostPost: async (_, args) => {
      try {
        const id = checkId(args._id);
        const user_id = args.user_id;
        if (!user_id) {
          throw "Invalid User";
        }
        const posts = await postCollection();
        let post = await posts.findOne({ _id: id.toString() });
        if (!post) {
          throw new GraphQLError("post not found", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        if (post.buyer_id != user_id) {
          throw "Invalid User";
        }
        if (post.status !== "inactive") {
          throw "Cannot repost post";
        }
        const repost = await posts.updateOne(
          { _id: id.toString() },
          { $set: { status: "active", date: new Date() } }
        );
        if (repost.acknowledged != true) {
          throw "Fail to repost";
        }
        post = await posts.findOne({ _id: id.toString() });
        return post;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    addProductToUserFavorite: async (_, args) => {
      let { _id, productId } = args;
      try {
        //find current user by id
        const usersData = await userCollection();
        let userToUpdate = await usersData.findOne({ _id: _id.toString() });
        if (!userToUpdate) {
          throw new GraphQLError(`USER NOT FOUND`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
        //check if the productId already exists
        let favorite = userToUpdate.favorite || [];
        if (favorite && favorite.includes(productId)) {
          throw new GraphQLError(`Areadly favorite this product`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }

        //add new product into favorite array and update
        favorite.push(productId);
        userToUpdate.favorite = favorite;
        const updatedUser = await usersData.findOneAndUpdate(
          { _id: _id.toString() },
          { $set: { favorite: favorite } },
          { new: true }
        );

        if (!updatedUser) {
          throw new GraphQLError(`Could not Edit User`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }

        return updatedUser.favorite;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    removeProductFromUserFavorite: async (_, args) => {
      let { _id, productId } = args;
      try {
        //find current user by id
        const usersData = await userCollection();
        const userToUpdate = await usersData.findOne({ _id: _id.toString() });
        if (!userToUpdate) {
          throw new GraphQLError(`USER NOT FOUND`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
        //check if the productIdexists
        let favorite = userToUpdate.favorite || [];
        if (favorite && !favorite.includes(productId)) {
          throw new GraphQLError(`Cannot found this product in favorite`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }

        //add new product into favorite array and update
        favorite = favorite.filter((id) => id !== productId);
        const updatedUser = await usersData.findOneAndUpdate(
          { _id: _id.toString() },
          { $set: { favorite: favorite } },
          { new: true }
        );

        if (!updatedUser) {
          throw new GraphQLError(`Could not Edit User`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }

        return updatedUser.favorite;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
  },
};
