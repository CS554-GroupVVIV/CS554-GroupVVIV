import { GraphQLError } from "graphql";
import {
  products as productCollection,
  posts as postCollection,
  users as userCollection,
  chats as chatCollection,
} from "./config/mongoCollections.js";
import { client } from "./server.js";
import { ObjectId } from "mongodb";
import { DateTime } from "./typeDefs.js";
import {
  checkId,
  checkString,
  checkName,
  checkCategory,
  checkPrice,
  checkCondition,
  checkDescription,
  checkEmail,
  checkFirstNameAndLastName,
  capitalizeName,
  checkUrl,
  dateObjectToHTMLDate,
  checkRating,
  checkStatus,
} from "./helper.js";

export const resolvers = {
  DateTime: DateTime,

  Product: {
    seller: async (parentValue) => {
      try {
        const users = await userCollection();
        const seller = await users.findOne({ _id: parentValue.seller_id });
        if (!seller) {
          throw new GraphQLError("Seller not found", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        return seller;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
    buyer: async (parentValue) => {
      try {
        if (parentValue.buyer_id == null) {
          return null;
        }
        const users = await userCollection();
        const buyer = await users.findOne({ _id: parentValue.buyer_id });
        if (!buyer) {
          throw new GraphQLError("Buyer not found", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        return buyer;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
    possible_buyers: async (parentValue) => {
      try {
        const possible_buyers = parentValue.possible_buyers;
        const users = await userCollection();
        const usersData = await users
          .find({ _id: { $in: possible_buyers } })
          .toArray();
        return usersData;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
  },

  Post: {
    seller: async (parentValue) => {
      try {
        if (parentValue.seller_id == null) {
          return null;
        }
        const users = await userCollection();
        const seller = await users.findOne({ _id: parentValue.seller_id });
        if (!seller) {
          throw new GraphQLError("Seller not found", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        return seller;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
    buyer: async (parentValue) => {
      try {
        const users = await userCollection();
        const buyer = await users.findOne({ _id: parentValue.buyer_id });
        if (!buyer) {
          throw new GraphQLError("Buyer not found", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        return buyer;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    possible_sellers: async (parentValue) => {
      try {
        const possible_sellers = parentValue.possible_sellers;
        const users = await userCollection();
        const usersData = await users
          .find({ _id: { $in: possible_sellers } })
          .toArray();
        return usersData;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
  },

  User: {
    rating: async (parentValue) => {
      try {
        const users = await userCollection();
        const user = await users.findOne({
          _id: parentValue._id,
        });
        if (!user) {
          throw new GraphQLError("User not found", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        const comments = user.comments;
        let total = 0;
        let count = 0;
        comments.map((comment) => {
          total += comment.rating;
          count += 1;
        });
        return isNaN(total / count) ? 0 : Number((total / count).toFixed(2));
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
    favorite_products: async (parentValue) => {
      try {
        let favorite_products = parentValue.favorite;
        favorite_products = favorite_products.map((id) => new ObjectId(id));
        const product = await productCollection();
        const productsData = await product
          .find({ _id: { $in: favorite_products } })
          .toArray();
        const result = productsData.map((data) => ({
          ...data,
          _id: data._id.toString(),
        }));

        return result;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
    favorite_posts: async (parentValue) => {
      try {
        let favorite_posts = parentValue.favorite_post;
        favorite_posts = favorite_posts.map((id) => new ObjectId(id));
        const post = await postCollection();
        const postsData = await post
          .find({ _id: { $in: favorite_posts } })
          .toArray();
        const result = postsData.map((data) => ({
          ...data,
          _id: data._id.toString(),
        }));
        return result;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
    possible_buyer: async (parentValue) => {
      try {
        let wantBuyProduct = parentValue.possible_buyer_id;
        wantBuyProduct = wantBuyProduct.map((id) => new ObjectId(id));
        const product = await productCollection();
        const productsData = await product
          .find({ _id: { $in: wantBuyProduct } })
          .toArray();
        const result = productsData.map((data) => ({
          ...data,
          _id: data._id.toString(),
        }));
        return result;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
    possible_seller: async (parentValue) => {
      try {
        let wantSellPost = parentValue.possible_seller_id;
        wantSellPost = wantSellPost.map((id) => new ObjectId(id));
        const post = await postCollection();
        const postsData = await post
          .find({ _id: { $in: wantSellPost } })
          .toArray();
        const result = postsData.map((data) => ({
          ...data,
          _id: data._id.toString(),
        }));
        return result;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
  },

  Comment: {
    commenter: async (parentValue) => {
      try {
        const users = await userCollection();
        const commenter = await users.findOne({ _id: parentValue.comment_id });
        if (!commenter) {
          throw new GraphQLError("Commenter not found", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        return commenter;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
  },

  Chat: {
    participants: async (parentValue) => {
      try {
        const participants = parentValue.participants_id;
        const users = await userCollection();
        const participantsData = await users
          .find({
            _id: { $in: participants },
          })
          .toArray();
        if (!participantsData) {
          throw new GraphQLError("Participants not found", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        return participantsData;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
  },

  Message: {
    sender: async (parentValue) => {
      try {
        const users = await userCollection();
        const sender = await users.findOne({ _id: parentValue.sender_id });
        if (!sender) {
          throw new GraphQLError("Sender not found", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        return sender;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
  },

  Query: {
    products: async () => {
      try {
        const products = await productCollection();
        var allProducts = await client.json.get(`allProducts`, "$");
        if (!allProducts) {
          allProducts = await products.find({}).sort({ date: -1 }).toArray();
          // for (let i = 0; i < allProducts.length; i++) {
          //   allProducts[i].date = dateObjectToHTMLDate(allProducts[i].date);
          // }
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
          allPosts = await posts.find({}).sort({ date: -1 }).toArray();
          // for (let i = 0; i < allPosts.length; i++) {
          //   allPosts[i].date = dateObjectToHTMLDate(allPosts[i].date);
          // }
          client.json.set(`allPosts`, "$", allPosts);
          client.expire(`allPosts`, 3600);
        }
        return allPosts;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    searchPostsByName: async (_, args) => {
      try {
        let postName = checkName(args.searchTerm);
        if (args.category) {
          args.category = checkCategory(args.category);
        }
        const posts = await postCollection();
        let postsByName = [];
        if (args.category) {
          postsByName = await posts
            .find({
              name: { $regex: postName, $options: "i" },
              category: args.category,
            })
            .sort({ date: -1 })
            .toArray();
        } else {
          postsByName = await posts
            .find({
              name: { $regex: postName, $options: "i" },
            })
            .sort({ date: -1 })
            .toArray();
        }
        // for (let i = 0; i < postsByName.length; i++) {
        //   postsByName[i].date = dateObjectToHTMLDate(postsByName[i].date);
        // }
        return postsByName;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    searchProductsByName: async (_, args) => {
      try {
        let productName = checkName(args.name);
        if (args.category) {
          args.category = checkCategory(args.category);
        }
        const products = await productCollection();
        let productsByName = [];
        if (args.category) {
          productsByName = await products
            .find({
              name: { $regex: productName, $options: "i" },
              category: args.category,
            })
            .sort({ date: -1 })
            .toArray();
        } else {
          productsByName = await products
            .find({
              name: { $regex: productName, $options: "i" },
            })
            .sort({ date: -1 })
            .toArray();
        }
        // for (let i = 0; i < productsByName.length; i++) {
        //   productsByName[i].date = dateObjectToHTMLDate(productsByName[i].date);
        // }
        return productsByName;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    getProductById: async (_, args) => {
      try {
        let id = checkId(args._id);
        let product = await client.json.get(`getProductById-${id}`, "$");
        if (!product) {
          const products = await productCollection();
          product = await products.findOne({ _id: new ObjectId(id) });
          if (!product) {
            throw new GraphQLError("Product not found", {
              extensions: { code: "NOT_FOUND" },
            });
          }
          // product.date = dateObjectToHTMLDate(product.date);
          client.json.set(`getProductById-${id}`, "$", product);
          client.expire(`getProductById-${id}`, 3600);
        }
        return product;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    getProductsByStatus: async (_, args) => {
      try {
        let status = checkStatus(args.status);
        const products = await productCollection();
        let productList = await products
          .find({ status: status })
          .sort({ date: -1 })
          .toArray();
        // for (let i = 0; i < productList.length; i++) {
        //   productList[i].date = dateObjectToHTMLDate(productList[i].date);
        // }
        return productList;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    getProductsByCategory: async (_, args) => {
      try {
        let category = checkCategory(args.category);
        const productData = await productCollection();
        const products = await productData
          .find({ category: category })
          .sort({ date: -1 })
          .toArray();
        // for (let i = 0; i < products.length; i++) {
        //   products[i].date = dateObjectToHTMLDate(products[i].date);
        // }
        return products;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    // getProductsByPriceRange: async (_, args) => {
    //   try {
    //     let { low, high } = args;
    //     if (!low) {
    //       low = 0;
    //     }
    //     checkPriceMinMax(low, high);

    //     const productData = await productCollection();
    //     const products = await productData
    //       .find({ price: { $lte: high, $gte: low } })
    //       .toArray();
    //     if (!products) {
    //       throw new GraphQLError("product not found", {
    //         extensions: { code: "NOT_FOUND" },
    //       });
    //     }
    //     return products;
    //   } catch (error) {
    //     throw new GraphQLError(error.message);
    //   }
    // },

    getPostById: async (_, args) => {
      try {
        let id = checkId(args._id);
        let post = await client.json.get(`getPostById-${id}`, "$");
        if (!post) {
          const posts = await postCollection();
          post = await posts.findOne({ _id: new ObjectId(id) });
          if (!post) {
            throw new GraphQLError("post not found", {
              extensions: { code: "NOT_FOUND" },
            });
          }
          // post.date = dateObjectToHTMLDate(post.date);
          client.json.set(`getPostById-${id}`, "$", post);
          client.expire(`getPostById-${id}`, 3600);
        }
        return post;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    getPostsByCategory: async (_, args) => {
      try {
        let category = checkCategory(args.category);
        const posts = await postCollection();
        let postsByCategory = await posts
          .find({ category: category })
          .sort({ date: -1 })
          .toArray();
        // for (let i = 0; i < postsByCategory.length; i++) {
        //   postsByCategory[i].date = dateObjectToHTMLDate(
        //     postsByCategory[i].date
        //   );
        // }
        return postsByCategory;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    getPostsByStatus: async (_, args) => {
      try {
        let status = checkStatus(args.status);
        const postData = await postCollection();
        let posts = await postData
          .find({ status: status })
          .sort({ date: -1 })
          .toArray();
        // for (let i = 0; i < posts.length; i++) {
        //   posts[i].date = dateObjectToHTMLDate(posts[i].date);
        // }
        return posts;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    getUserById: async (_, args) => {
      try {
        let id = checkString(args._id);
        const usersData = await userCollection();
        let user = await usersData.findOne({ _id: id });
        if (!user) {
          throw new GraphQLError("User not found", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        // let comment_string = user.comments.map((comment) => {
        //   comment.date = dateObjectToHTMLDate(comment.date);
        //   return comment;
        // });
        // user.comment = comment_string;
        return user;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    getUsersByIds: async (_, args) => {
      try {
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

    getChatByParticipants: async (_, args) => {
      try {
        const chatData = await chatCollection();
        const chat = await chatData.findOne({
          participants_id: { $all: args.participants },
        });
        // if (!chat) {
        //   throw new GraphQLError("Chat not found", {
        //     extensions: { code: "NOT_FOUND" },
        //   });
        // }
        return chat;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    getPostBySeller: async (_, args) => {
      try {
        let seller_id = checkString(args._id);
        const posts = await postCollection();
        let sellerPosts = await posts
          .find({ seller_id: seller_id })
          .sort({ date: -1 })
          .toArray();
        // for (let i = 0; i < sellerPosts.length; i++) {
        //   sellerPosts[i].date = dateObjectToHTMLDate(sellerPosts[i].date);
        // }
        return sellerPosts;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    getPostByBuyer: async (_, args) => {
      try {
        let buyer_id = checkString(args._id);
        const posts = await postCollection();
        let buyerPosts = await posts
          .find({ buyer_id: buyer_id })
          .sort({ date: -1 })
          .toArray();
        // for (let i = 0; i < buyerPosts.length; i++) {
        //   buyerPosts[i].date = dateObjectToHTMLDate(buyerPosts[i].date);
        // }
        return buyerPosts;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    getProductBySeller: async (_, args) => {
      try {
        const products = await productCollection();
        let seller_id = checkString(args._id);

        let sellerProducts = await products
          .find({ seller_id: seller_id })
          .sort({ date: -1 })
          .toArray();
        // for (let i = 0; i < sellerProducts.length; i++) {
        //   sellerProducts[i].date = dateObjectToHTMLDate(sellerProducts[i].date);
        // }
        return sellerProducts;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    getProductByBuyer: async (_, args) => {
      try {
        let buyer_id = checkString(args._id);

        const products = await productCollection();
        let buyerProducts = await products
          .find({ buyer_id: buyer_id })
          .sort({ date: -1 })
          .toArray();
        // for (let i = 0; i < buyerProducts.length; i++) {
        //   buyerProducts[i].date = dateObjectToHTMLDate(buyerProducts[i].date);
        // }
        return buyerProducts;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    getComment: async (_, args) => {
      try {
        const users = await userCollection();
        const user_id = checkString(args.user_id);
        const userA = await users.findOne({ _id: user_id });
        if (!userA) {
          throw new GraphQLError("User not found", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        const comment_id = checkString(args.comment_id);
        const userB = await users.findOne({ _id: comment_id });
        if (!userB) {
          throw new GraphQLError("User not found", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        const commentExist = await users.findOne(
          {
            _id: user_id,
            "comments.comment_id": comment_id,
          },
          {
            projection: {
              email: 1,
              firstname: 1,
              lastname: 1,
              rating: 1,
              "comments.$": 1,
            },
          }
        );
        if (commentExist) {
          // commentExist.date = dateObjectToHTMLDate(
          //   commentExist.comments[0].date
          // );
          // return commentExist;
        } else return null;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
  },

  Mutation: {
    addProduct: async (_, args) => {
      try {
        if (Object.keys(args).length !== 7) {
          throw new GraphQLError("All fields are required", {
            extensions: { code: "BAD_INPUT" },
          });
        }
        let seller_id = checkString(args.seller_id);
        const usersData = await userCollection();
        const user = await usersData.findOne({ _id: seller_id });
        if (!user) {
          throw new GraphQLError(`USER NOT FOUND`, {
            extensions: { code: "NOT_FOUND" },
          });
        }
        let name = checkName(args.name);
        let price = checkPrice(args.price);
        let description = checkDescription(args.description);
        let condition = checkCondition(args.condition);
        let image = checkUrl(args.image);
        let category = checkCategory(args.category);
        const products = await productCollection();
        const newProduct = {
          _id: new ObjectId(),
          name: name,
          price: price,
          date: new Date(),
          description: description,
          condition: condition,
          seller_id: seller_id,
          buyer_id: null,
          image: image,
          category: category,
          status: "active",
          possible_buyers: [],
        };
        let insertedProduct = await products.insertOne(newProduct);
        if (!insertedProduct) {
          throw new GraphQLError(`Could not Add Product`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
        client.json.del(`allProducts`);
        client.json.set(
          `getProductById-${newProduct._id.toString()}`,
          "$",
          newProduct
        );
        client.expire(`getProductById-${newProduct._id.toString()}`, 3600);
        // newProduct.date = dateObjectToHTMLDate(newProduct.date);
        return newProduct;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    addPost: async (_, args) => {
      try {
        if (Object.keys(args).length !== 6) {
          throw new GraphQLError("All fields are required", {
            extensions: { code: "BAD_INPUT" },
          });
        }
        let buyer_id = checkString(args.buyer_id);
        const usersData = await userCollection();
        const user = await usersData.findOne({ _id: buyer_id });
        if (!user) {
          throw new GraphQLError(`USER NOT FOUND`, {
            extensions: { code: "NOT_FOUND" },
          });
        }
        let name = checkName(args.name);
        let category = checkCategory(args.category);
        let price = checkPrice(args.price);
        let condition = checkCondition(args.condition);
        let description = checkDescription(args.description);
        const posts = await postCollection();
        const newPost = {
          _id: new ObjectId(),
          buyer_id: buyer_id,
          seller_id: null,
          name: name,
          category: category,
          price: price,
          condition: condition,
          date: new Date(),
          description: description,
          status: "active",
          possible_sellers: [],
          completion_date: null,
        };
        let insertedPost = await posts.insertOne(newPost);
        if (!insertedPost) {
          throw new GraphQLError(`Could not Add Post`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
        client.json.del(`allPosts`);
        client.json.set(`getPostById-${newPost._id.toString()}`, "$", newPost);
        client.expire(`getPostById-${newPost._id.toString()}`, 3600);

        // newPost.date = dateObjectToHTMLDate(newPost.date);
        return newPost;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    editPost: async (_, args) => {
      try {
        let _id = checkId(args._id);
        const posts = await postCollection();
        const post = await posts.findOne({ _id: new ObjectId(_id) });
        if (!post) {
          throw new GraphQLError("Post Not Found", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        let buyer_id = checkString(args.buyer_id);
        if (post.buyer_id != buyer_id) {
          throw new GraphQLError("Not authorized to edit", {
            extensions: { code: "NOT_AUTHORIZED" },
          });
        }
        let name = checkName(args.name);
        let category = checkCategory(args.category);
        let price = checkPrice(args.price);
        let condition = checkCondition(args.condition);
        let description = checkDescription(args.description);
        let status = checkStatus(args.status);
        if (
          name == post.name &&
          category == post.category &&
          price == post.price &&
          condition == post.condition &&
          description == post.description &&
          status == post.status
        ) {
          throw new GraphQLError(`No Change made`, {
            extensions: { code: "BAD_INPUT" },
          });
        }
        let seller_id = null;
        let completion_date = null;
        if (status == "pending") {
          seller_id = checkString(args.seller_id);
          if (!post.possible_sellers.includes(seller_id)) {
            throw new GraphQLError(`Not valid seller`, {
              extensions: { code: "BAD_INPUT" },
            });
          }
          // const users = await userCollection();
          // const updateUser = await users.findOneAndUpdate(
          //   { _id: seller_id },
          //   { $pull: { possible_seller_id: _id } },
          //   { returnDocument: "after" }
          // );
          // if (!updateUser) {
          //   throw new GraphQLError(`Could not update User`, {
          //     extensions: { code: "INTERNAL_SERVER_ERROR" },
          //   });
          // }
        }
        const updatedPost = {
          name: name,
          seller_id: seller_id,
          category: category,
          price: price,
          condition: condition,
          description: description,
          status: status,
          completion_date: completion_date,
        };
        let updated = await posts.findOneAndUpdate(
          { _id: new ObjectId(_id) },
          { $set: updatedPost },
          { returnDocument: "after" }
        );
        if (!updated) {
          throw new GraphQLError(`Could not Edit Post`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
        client.json.del(`allPosts`);
        client.json.set(`getPostById-${_id}`, "$", updated);
        client.expire(`getPostById-${_id}`, 3600);
        // updated.date = dateObjectToHTMLDate(updated.date);
        return updated;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    editProduct: async (_, args) => {
      try {
        let _id = checkId(args._id);
        const products = await productCollection();
        const product = await products.findOne({ _id: new ObjectId(_id) });
        if (!product) {
          throw new GraphQLError("Product Not Found", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        let seller_id = checkString(args.seller_id);
        if (product.seller_id != seller_id) {
          throw new GraphQLError("Not authorized to edit", {
            extensions: { code: "NOT_AUTHORIZED" },
          });
        }
        let name = checkName(args.name);
        let category = checkCategory(args.category);
        let image = checkUrl(args.image);
        let price = checkPrice(args.price);
        let condition = checkCondition(args.condition);
        let description = checkDescription(args.description);
        let status = checkStatus(args.status);
        if (
          name == product.name &&
          category == product.category &&
          image == product.image &&
          price == product.price &&
          condition == product.condition &&
          description == product.description &&
          status == product.status
        ) {
          throw new GraphQLError(`No Change made`, {
            extensions: { code: "BAD_INPUT" },
          });
        }
        let buyer_id = null;
        let completion_date = null;
        if (status == "pending") {
          buyer_id = checkString(args.buyer_id);
          if (!product.possible_buyers.includes(buyer_id)) {
            throw new GraphQLError(`Not valid buyer`, {
              extensions: { code: "BAD_INPUT" },
            });
          }
          //   const users = await userCollection();
          //   const updateUser = await users.findOneAndUpdate(
          //     { _id: buyer_id },
          //     { returnDocument: "after" }
          //   );
          //   if (!updateUser) {
          //     throw new GraphQLError(`Could not update User`, {
          //       extensions: { code: "INTERNAL_SERVER_ERROR" },
          //     });
          //   }
        }

        const updatedProduct = {
          name: name,
          buyer_id: buyer_id,
          category: category,
          image: image,
          price: price,
          condition: condition,
          description: description,
          status: status,
          completion_date: completion_date,
        };

        let updated = await products.findOneAndUpdate(
          { _id: new ObjectId(_id) },
          { $set: updatedProduct },
          { returnDocument: "after" }
        );
        client.json.del(`allProducts`);
        client.json.set(`getProductById-${_id}`, "$", updated);
        client.expire(`getProductById-${_id}`, 3600);
        if (!updated) {
          throw new GraphQLError(`Could not Edit Product`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
        // updated.date = dateObjectToHTMLDate(updated.date);
        console.log(updated);
        return updated;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    addUser: async (_, args) => {
      try {
        let { _id, email, firstname, lastname, favorite } = args;
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
          favorite: [],
          favorite_post: [],
          comments: [],
          possible_buyer_id: [],
          possible_seller_id: [],
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
        let { _id, email, firstname, lastname } = args;
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
          { _id: _id },
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
        let { participants_id } = args;
        const chatData = await chatCollection();

        const chat = await chatData.findOne({
          participants_id: { $all: participants_id },
        });

        if (!chat) {
          const newChat = {
            _id: new ObjectId(),
            participants_id: participants_id,
            messages: [],
          };
          let insertedChat = await chatData.insertOne(newChat);
          if (!insertedChat) {
            throw new GraphQLError(`Could not Add chat`, {
              extensions: { code: "INTERNAL_SERVER_ERROR" },
            });
          }
          return newChat;
        } else {
          throw new GraphQLError("Chat alread exists", {
            extensions: { code: "BAD_INPUT" },
          });
        }
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    addMessage: async (_, args) => {
      try {
        let { _id, sender_id, time, message } = args;
        const chatData = await chatCollection();
        const chat = await chatData.find({ id: new ObjectId(_id) });

        if (chat) {
          const newMessage = {
            sender_id,
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
          newMessage.time = dateObjectToHTMLDate(newMessage.time);
          return newMessage;
        }
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    addProductToUserFavorite: async (_, args) => {
      let { _id, productId } = args;
      try {
        const usersData = await userCollection();
        let userToUpdate = await usersData.findOne({ _id: _id });
        if (!userToUpdate) {
          throw new GraphQLError(`USER NOT FOUND`, {
            extensions: { code: "NOT_FOUND" },
          });
        }
        const productData = await productCollection();
        let productToUpdate = await productData.findOne({
          _id: new ObjectId(productId),
        });
        if (!productToUpdate) {
          throw new GraphQLError(`Product NOT FOUND`, {
            extensions: { code: "NOT_FOUND" },
          });
        }
        let favorite = userToUpdate.favorite;
        if (favorite.includes(productId)) {
          return userToUpdate;
        }
        favorite = [...favorite, productId];
        const updatedUser = await usersData.findOneAndUpdate(
          { _id: _id },
          { $set: { favorite: favorite } },
          { new: true }
        );

        if (!updatedUser) {
          throw new GraphQLError(`Could not add product to favorite`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
        const updatedData = await usersData.findOne({ _id: _id });
        return updatedData;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    addPostToUserFavorite: async (_, args) => {
      let { _id, postId } = args;
      try {
        const usersData = await userCollection();
        let userToUpdate = await usersData.findOne({ _id: _id });
        if (!userToUpdate) {
          throw new GraphQLError(`USER NOT FOUND`, {
            extensions: { code: "NOT_FOUND" },
          });
        }
        const postData = await postCollection();
        let postToUpdate = await postData.findOne({
          _id: new ObjectId(postId),
        });
        if (!postToUpdate) {
          throw new GraphQLError(`Post NOT FOUND`, {
            extensions: { code: "NOT_FOUND" },
          });
        }

        let favorite_post = userToUpdate.favorite_post;
        if (favorite_post.includes(postId)) {
          throw new GraphQLError(`Areadly favorite this post`, {
            extensions: { code: "BAD_INPUT" },
          });
        }
        favorite_post = [...favorite_post, postId];
        const updatedUser = await usersData.findOneAndUpdate(
          { _id: _id },
          { $set: { favorite_post: favorite_post } },
          { new: true }
        );

        if (!updatedUser) {
          throw new GraphQLError(`Could not Edit User`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
        const updatedData = await usersData.findOne({ _id: _id });
        return updatedData;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    removeProductFromUserFavorite: async (_, args) => {
      let { _id, productId } = args;
      try {
        const usersData = await userCollection();
        const userToUpdate = await usersData.findOne({ _id: _id });
        if (!userToUpdate) {
          throw new GraphQLError(`USER NOT FOUND`, {
            extensions: { code: "NOT_FOUND" },
          });
        }
        const productData = await productCollection();
        let productToUpdate = await productData.findOne({
          _id: new ObjectId(productId),
        });
        if (!productToUpdate) {
          throw new GraphQLError(`Product NOT FOUND`, {
            extensions: { code: "NOT_FOUND" },
          });
        }
        let favorite = userToUpdate.favorite;
        if (!favorite.includes(productId)) {
          throw new GraphQLError(`Cannot found this product in favorite`, {
            extensions: { code: "BAD_INPUT" },
          });
        }
        favorite = favorite.filter((id) => id !== productId);
        const updatedUser = await usersData.findOneAndUpdate(
          { _id: _id },
          { $set: { favorite: favorite } },
          { returnDocument: "after" }
        );
        if (!updatedUser) {
          throw new GraphQLError(`Could not remove product from favorite`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
        const updatedData = await usersData.findOne({ _id: _id });
        return updatedData;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    removePostFromUserFavorite: async (_, args) => {
      let { _id, postId } = args;
      try {
        const usersData = await userCollection();
        const userToUpdate = await usersData.findOne({ _id: _id });
        if (!userToUpdate) {
          throw new GraphQLError(`USER NOT FOUND`, {
            extensions: { code: "NOT_FOUND" },
          });
        }
        const postData = await postCollection();
        let postToUpdate = await postData.findOne({
          _id: new ObjectId(postId),
        });
        if (!postToUpdate) {
          throw new GraphQLError(`Post NOT FOUND`, {
            extensions: { code: "NOT_FOUND" },
          });
        }

        let favorite_post = userToUpdate.favorite_post;
        if (!favorite_post.includes(postId)) {
          throw new GraphQLError(`Cannot found this post in favorite`, {
            extensions: { code: "BAD_INPUT" },
          });
        }

        favorite_post = favorite_post.filter((id) => id !== postId);
        const updatedUser = await usersData.findOneAndUpdate(
          { _id: _id },
          { $set: { favorite_post: favorite_post } },
          { returnDocument: "after" }
        );

        if (!updatedUser) {
          throw new GraphQLError(`Could not Edit User`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
        const updatedData = await usersData.findOne({ _id: _id });
        return updatedData;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    addComment: async (_, args) => {
      try {
        const users = await userCollection();
        const user_id = checkString(args.user_id);
        const userA = await users.findOne({ _id: user_id });
        if (!userA) {
          throw new GraphQLError("User not found", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        const comment_id = checkString(args.comment_id);
        const userB = await users.findOne({ _id: comment_id });
        if (!userB) {
          throw new GraphQLError("User not found", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        const commentExist = await users.findOne({
          _id: user_id,
          "comment.user_id": comment_id,
        });
        if (commentExist) {
          throw new GraphQLError("Comment already exist", {
            extensions: { code: "BAD_INPUT" },
          });
        }
        const rating = checkRating(args.rating);
        let commentText = "";
        if (args.comment && args.comment.trim() !== "") {
          commentText = checkString(args.comment);
        }

        const comments = {
          _id: new ObjectId(),
          comment_id: comment_id,
          rating: rating,
          comment: commentText,
          date: new Date(),
        };

        const insert = await users.updateOne(
          { _id: user_id },
          { $push: { comments } }
        );
        if (insert.acknowledged != true) {
          throw new GraphQLError("Cannot add comment", {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
        const user = await users.findOne({ _id: user_id });
        return user;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    editComment: async (_, args) => {
      try {
        const users = await userCollection();
        const user_id = checkString(args.user_id);
        const userA = await users.findOne({ _id: user_id });
        if (!userA) {
          throw new GraphQLError(`USER NOT FOUND`, {
            extensions: { code: "NOT_FOUND" },
          });
        }
        const comment_id = checkString(args.comment_id);
        const userB = await users.findOne({ _id: comment_id });
        if (!userB) {
          throw new GraphQLError(`USER NOT FOUND`, {
            extensions: { code: "NOT_FOUND" },
          });
        }
        const commentExist = await users.findOne(
          {
            _id: user_id,
            "comments.comment_id": comment_id,
          },
          {
            projection: {
              "comments.$": 1,
            },
          }
        );

        if (!commentExist) {
          throw new GraphQLError(`Comment NOT FOUND`, {
            extensions: { code: "NOT_FOUND" },
          });
        }
        const rating = checkRating(args.rating);
        let commentText = "";
        if (args.comment && args.comment.trim() !== "") {
          commentText = checkString(args.comment);
        }
        if (
          commentExist.rating === args.rating &&
          commentExist.commentText === args.commentText
        ) {
          throw new GraphQLError(`NO CHANGE MADE`, {
            extensions: { code: "BAD_INPUT" },
          });
        }
        const comments = {
          _id: commentExist._id,
          rating: rating,
          comment: commentText,
          date: new Date(),
          comment_id: comment_id,
        };
        const update = await users.updateOne(
          { _id: user_id, "comments.comment_id": comment_id },
          { $set: { "comments.$": comments } }
        );
        if (update.acknowledged != true) {
          throw new GraphQLError(`Cannot update comment`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
        const user = await users.findOne({ _id: user_id });
        return user;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    addPossibleBuyer: async (_, args) => {
      try {
        let { _id, buyer_id } = args;
        const products = await productCollection();
        const product = await products.findOne({ _id: new ObjectId(_id) });
        if (!product) {
          throw new GraphQLError("product not found", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        if (product.possible_buyers.includes(buyer_id)) {
          return product;
        }
        const users = await userCollection();
        const buyer = await users.findOne({ _id: buyer_id });
        if (!buyer) {
          throw new GraphQLError("buyer not found", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        const updateProduct = await products.findOneAndUpdate(
          { _id: new ObjectId(_id) },
          { $addToSet: { possible_buyers: buyer_id } },
          { returnDocument: "after" }
        );
        if (!updateProduct) {
          throw new GraphQLError(`Could not Edit Product`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
        const updateUser = await users.findOneAndUpdate(
          { _id: buyer_id },
          { $addToSet: { possible_buyer_id: _id } },
          { returnDocument: "after" }
        );
        if (!updateUser) {
          throw new GraphQLError(`Could not update User`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
        client.json.del(`allProducts`);
        client.json.del(`getProductById-${_id}`);
        const updatedData = await products.findOne({ _id: new ObjectId(_id) });
        // updatedData.date = dateObjectToHTMLDate(updatedData.date);
        return updatedData;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    removePossibleBuyer: async (_, args) => {
      try {
        let { _id, buyer_id } = args;
        const products = await productCollection();
        const product = await products.findOne({ _id: new ObjectId(_id) });
        if (!product) {
          throw new GraphQLError("product not found", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        if (!product.possible_buyers.includes(buyer_id)) {
          return product;
        }
        const updateProduct = await products.findOneAndUpdate(
          { _id: new ObjectId(_id) },
          { $pull: { possible_buyers: buyer_id } },
          { returnDocument: "after" }
        );
        if (!updateProduct) {
          throw new GraphQLError(`Could not Update Product`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
        const users = await userCollection();
        const updateUser = await users.findOneAndUpdate(
          { _id: buyer_id },
          { $pull: { possible_buyer_id: _id } },
          { returnDocument: "after" }
        );
        if (!updateUser) {
          throw new GraphQLError(`Could not update User`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
        client.json.del(`allProducts`);
        client.json.del(`getProductById-${_id}`);
        const updatedData = await products.findOne({ _id: new ObjectId(_id) });
        // updatedData.date = dateObjectToHTMLDate(updatedData.date);
        return updatedData;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    addPossibleSeller: async (_, args) => {
      try {
        let { _id, seller_id } = args;
        const posts = await postCollection();
        const post = await posts.findOne({ _id: new ObjectId(_id) });
        if (!post) {
          throw new GraphQLError("post not found", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        if (post.possible_sellers.includes(seller_id)) {
          return post;
        }
        const users = await userCollection();
        const seller = await users.findOne({ _id: seller_id });
        if (!seller) {
          throw new GraphQLError("seller not found", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        const updatePost = await posts.findOneAndUpdate(
          { _id: new ObjectId(_id) },
          { $addToSet: { possible_sellers: seller_id } },
          { returnDocument: "after" }
        );
        if (!updatePost) {
          throw new GraphQLError(`Could not Edit Post`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
        const updateUser = await users.findOneAndUpdate(
          { _id: seller_id },
          { $addToSet: { possible_seller_id: _id } },
          { returnDocument: "after" }
        );
        if (!updateUser) {
          throw new GraphQLError(`Could not update User`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
        client.json.del(`allPosts`);
        client.json.del(`getPostById-${_id}`);
        const updatedData = await posts.findOne({ _id: new ObjectId(_id) });
        // updatedData.date = dateObjectToHTMLDate(updatedData.date);
        return updatedData;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    removePossibleSeller: async (_, args) => {
      try {
        let { _id, seller_id } = args;
        const posts = await postCollection();
        const post = await posts.findOne({ _id: new ObjectId(_id) });
        if (!post) {
          throw new GraphQLError("post not found", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        if (!post.possible_sellers.includes(seller_id)) {
          return post;
        }
        const updatePost = await posts.findOneAndUpdate(
          { _id: new ObjectId(_id) },
          { $pull: { possible_sellers: seller_id } },
          { returnDocument: "after" }
        );
        if (!updatePost) {
          throw new GraphQLError(`Could not Edit Post`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
        const users = await userCollection();
        const updateUser = await users.findOneAndUpdate(
          { _id: seller_id },
          { $pull: { possible_seller_id: _id } },
          { returnDocument: "after" }
        );
        if (!updateUser) {
          throw new GraphQLError(`Could not update User`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
        client.json.del(`allPosts`);
        client.json.del(`getPostById-${_id}`);
        const updatedData = await posts.findOne({ _id: new ObjectId(_id) });
        // updatedData.date = dateObjectToHTMLDate(updatedData.date);
        return updatedData;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    clearProductBuy: async (_, args) => {
      try {
        let id = checkString(args._id);
        const users = await userCollection();
        const userToUpdate = await users.findOne({ _id: id });
        if (!userToUpdate) {
          throw new GraphQLError(`User not found`, {
            extensions: { code: "NOT_FOUND" },
          });
        }
        let wantBuy = userToUpdate.possible_buyer_id;
        const products = await productCollection();
        for (let i = 0; i < wantBuy.length; i++) {
          let product = await products.findOne({
            _id: new ObjectId(wantBuy[i]),
          });
          if (
            product.status == "inactive" ||
            (product.status == "pending" && product.buyer_id != id)
          ) {
            let updateUser = await users.findOneAndUpdate(
              { _id: id },
              { $pull: { possible_buyer_id: wantBuy[i] } }
            );
            let updateProduct = await products.findOneAndUpdate(
              { _id: new ObjectId(wantBuy[i]) },
              { $pull: { possible_buyers: id } }
            );
            if (!updateUser || !updateProduct) {
              throw new GraphQLError(`Could not update data`, {
                extensions: { code: "INTERNAL_SERVER_ERROR" },
              });
            }
          }
        }
        client.json.del(`allProducts`);
        const user = await users.findOne({ _id: id });
        return user;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    clearProductSell: async (_, args) => {
      try {
        console.log(args);
        let id = checkString(args._id);
        const users = await userCollection();
        const userToUpdate = await users.findOne({ _id: id });
        if (!userToUpdate) {
          throw new GraphQLError(`User not found`, {
            extensions: { code: "NOT_FOUND" },
          });
        }
        const products = await productCollection();
        let product = await products.deleteMany({
          seller_id: id,
          status: "inactive",
        });
        if (product.acknowledged != true) {
          throw new GraphQLError(`Could not clear inactive products`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
        client.json.del(`allProducts`);
        let productData = await products.find({ buyer_id: id }).toArray();
        return productData;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
    clearPostBuy: async (_, args) => {
      try {
        let id = checkString(args._id);
        const users = await userCollection();
        const userToUpdate = await users.findOne({ _id: id });
        if (!userToUpdate) {
          throw new GraphQLError(`User not found`, {
            extensions: { code: "NOT_FOUND" },
          });
        }
        const posts = await postCollection();
        let post = await posts.deleteMany({ buyer_id: id, status: "inactive" });
        console.log(post);
        if (!post) {
          throw new GraphQLError(`Could not clear inactive posts`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
        client.json.del(`allPosts`);
        let postData = await posts.find({ buyer_id: id }).toArray();
        return postData;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
    clearPostSell: async (_, args) => {
      try {
        let id = checkString(args._id);
        const users = await userCollection();
        const userToUpdate = await users.findOne({ _id: id });
        if (!userToUpdate) {
          throw new GraphQLError(`User not found`, {
            extensions: { code: "NOT_FOUND" },
          });
        }
        let wantSell = userToUpdate.possible_seller_id;
        const posts = await postCollection();
        for (let i = 0; i < wantSell.length; i++) {
          let post = await posts.findOne({ _id: ObjectId(wantSell[i]) });
          if (
            post.status == "inactive" ||
            (post.status == "pending" && post.seller_id != id)
          ) {
            let updateUser = await users.findOneAndUpdate(
              { _id: id },
              { $pull: { possible_seller_id: wantSell[i] } }
            );
            let updatePost = await posts.findOneAndUpdate(
              { _id: ObjectId(wantSell[i]) },
              { $pull: { possible_sellers: id } }
            );
            console.log(updateUser, updatePost);
            if (!updateUser || !updatePost) {
              throw new GraphQLError(`Could not update data`, {
                extensions: { code: "INTERNAL_SERVER_ERROR" },
              });
            }
          }
        }
        client.json.del(`allPosts`);
        const user = await users.findOne({ _id: id });
        return user;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
    // clearInactiveProductFav: async (_, args) => {
    //   let id = checkString(args._id);
    //   const users = await userCollection();
    //   const userToUpdate = await users.findOne({ _id: id });
    //   if (!userToUpdate) {
    //     throw new GraphQLError(`User not found`, {
    //       extensions: { code: "NOT_FOUND" },
    //     });
    //   }
    //   let favProduct = userToUpdate.favorite;
    //   const products = await productCollection();
    //   for (let i = 0; i < favProduct.length; i++) {
    //     let product = products.findOne({ _id: new ObjectId(favProduct[i]) });
    //     if (product.status == "inactive") ||
    //   }
    // },
    // clearCompletedProductFav: async (_, args) => {
    //   let id = checkString(args._id);
    //   const users = await userCollection();
    //   const userToUpdate = await users.findOne({ _id: id });
    //   if (!userToUpdate) {
    //     throw new GraphQLError(`User not found`, {
    //       extensions: { code: "NOT_FOUND" },
    //     });
    //   }
    //   let favProduct = userToUpdate.favorite;
    //   const products = await productCollection();
    // },
    // clearInactivePostFav: async (_, args) => {
    //   let id = checkString(args._id);
    //   const users = await userCollection();
    //   const userToUpdate = await users.findOne({ _id: id });
    //   if (!userToUpdate) {
    //     throw new GraphQLError(`User not found`, {
    //       extensions: { code: "NOT_FOUND" },
    //     });
    //   }
    // },
    // clearCompletedPostFav: async (_, args) => {
    //   let id = checkString(args._id);
    //   const users = await userCollection();
    //   const userToUpdate = await users.findOne({ _id: id });
    //   if (!userToUpdate) {
    //     throw new GraphQLError(`User not found`, {
    //       extensions: { code: "NOT_FOUND" },
    //     });
    //   }
    // },
    // },

    confirmProduct: async (_, args) => {
      let id = checkId(args._id);
      let buyer_id = checkString(args.buyer_id);
      const products = await productCollection();
      const product = await products.findOne({ _id: new ObjectId(id) });
      if (product.status == "pending" || product.buyer_id == buyer_id) {
        const update = await products.findOneAndUpdate(
          { _id: new ObjectId(id) },
          { $set: { status: "completed", completion_date: new Date() } },
          { returnDocument: "after" }
        );
        if (!update) {
          throw new GraphQLError(`Cannot confirm this transaction`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
        client.json.set(`getProductById-${id}`, "$", update);
        client.expire(`getProductById-${id}`, 3600);

        return update;
      } else {
        throw new GraphQLError(`Cannot confirm this transaction`, {
          extensions: { code: "BAD_INPUT" },
        });
      }
    },
    confirmPost: async (_, args) => {
      let id = checkId(args._id);
      let seller_id = checkString(args.seller_id);
      const posts = await postCollection();
      const post = await posts.findOne({ _id: new ObjectId(id) });
      if (post.status == "pending" || post.seller_id == seller_id) {
        const update = await posts.findOneAndUpdate(
          { _id: new ObjectId(id) },
          { $set: { status: "completed", completion_date: new Date() } },
          { returnDocument: "after" }
        );
        if (!update) {
          throw new GraphQLError(`Cannot confirm this transaction`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
        client.json.set(`getPostById-${id}`, "$", update);
        client.expire(`getPostById-${id}`, 3600);
        return update;
      } else {
        throw new GraphQLError(`Cannot confirm this transaction`, {
          extensions: { code: "BAD_INPUT" },
        });
      }
    },
    rejectProduct: async (_, args) => {
      let id = checkId(args._id);
      let buyer_id = checkString(args.buyer_id);
      const products = await productCollection();
      const product = await products.findOne({ _id: new ObjectId(id) });
      if (product.status == "pending" || product.buyer_id == buyer_id) {
        const update = await products.findOneAndUpdate(
          { _id: new ObjectId(id) },
          { $set: { status: "rejected" } },
          { returnDocument: "after" }
        );
        if (!update) {
          throw new GraphQLError(`Cannot reject this transaction`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
        client.json.set(`getProductById-${id}`, "$", update);
        client.expire(`getProductById-${id}`, 3600);
        return update;
      } else {
        throw new GraphQLError(`Cannot confirm this transaction`, {
          extensions: { code: "BAD_INPUT" },
        });
      }
    },
    rejectPost: async (_, args) => {
      let id = checkId(args._id);
      let seller_id = checkString(args.seller_id);
      const posts = await postCollection();
      const post = await posts.findOne({ _id: new ObjectId(id) });
      if (post.status == "pending" || post.seller_id == seller_id) {
        const update = await posts.findOneAndUpdate(
          { _id: new ObjectId(id) },
          { $set: { status: "rejected" } },
          { returnDocument: "after" }
        );
        if (!update) {
          throw new GraphQLError(`Cannot reject this transaction`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
        client.json.set(`getPostById-${id}`, "$", update);
        client.expire(`getPostById-${id}`, 3600);
        return update;
      } else {
        throw new GraphQLError(`Cannot confirm this transaction`, {
          extensions: { code: "BAD_INPUT" },
        });
      }
    },
  },
};
