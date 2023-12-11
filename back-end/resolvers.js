import { GraphQLError } from "graphql";
import {
  products as productCollection,
  posts as postCollection,
  users as userCollection,
  chats as chatCollection,
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
  checkEmail,
  checkUserAndChatId,
  checkFirstNameAndLastName,
  capitalizeName,
} from "./helper.js";
import bcrypt from "bcryptjs";
const { hash, compare } = bcrypt;

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
        let id = checkId(args._id);
        const products = await productCollection();
        const product = await products.findOne({ _id: id.toString() });
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

    getUserById: async (_, args) => {
      try {
        let id = checkUserAndChatId(args._id.toString());
        const usersData = await userCollection();
        const user = await usersData.findOne({ _id: id });
        if (!user) {
          throw new GraphQLError("User not found", {
            extensions: { code: "NOT_FOUND" },
          });
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
        console.log(args);

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
  },

  Mutation: {
    addProduct: async (_, args) => {
      try {
        if (Object.keys(args).length !== 8) {
          throw new Error("all fields are required");
        }
        let name = args.name;
        let price = args.price;
        let date = new Date();
        let description = args.description;
        let condition = args.condition;
        let seller_id = args.seller_id;
        let image = args.image;
        let category = args.category;
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

    addUser: async (_, args) => {
      try {
        let { _id, email, firstname, lastname, password } = args;
        const saltRounds = 10;
        // check ID not implement yet
        email = checkEmail(email);
        firstname = capitalizeName(
          checkFirstNameAndLastName(firstname, "First Name")
        );
        lastname = capitalizeName(
          checkFirstNameAndLastName(lastname, "Last Name")
        );

        password = await bcrypt.hash(password, saltRounds);
        const usersData = await userCollection();
        const newUser = {
          _id,
          email,
          firstname,
          lastname,
          password,
        };
        const insertedUser = await usersData.insertOne(newUser);
        if (!insertedUser) {
          throw new GraphQLError(`Could not Add User`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
        return newUser;
      } catch (error) {
        throw new GraphQLError(error);
      }
    },

    editUser: async (_, args) => {
      try {
        let { _id, email, firstname, lastname, password } = args;
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

        let preUserInfo = await usersData.findOne({ _id });
        if (!(await bcrypt.compare(password, preUserInfo.password)))
          throw "Password doesn't match the previous password";
        let updatedUser = await usersData.findOneAndUpdate(
          { _id },
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

    editPassword: async (_, args) => {
      try {
        let { _id, prePassword, newPassword } = args;
        const usersData = await userCollection();
        newPassword = await bcrypt.hash(newPassword, 10);
        const updatedUserInfo = {
          password: newPassword,
        };

        let preUserInfo = await usersData.findOne({ _id });
        if (!(await bcrypt.compare(prePassword, preUserInfo.password)))
          throw "Password doesn't match the previous password";
        let updatedInfo = await usersData.findOneAndUpdate(
          { _id },
          { $set: updatedUserInfo },
          { returnDocument: "after" }
        );
        if (!updatedInfo) {
          throw new GraphQLError(`Could not Chage Password`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
        return updatedInfo;
      } catch (error) {
        throw new GraphQLError(error.message);
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
  },
};
