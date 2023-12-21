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
  checkPriceMinMax,
  checkCondition,
  // checkDate,
  checkDescription,
  checkEmail,
  // checkString,
  checkFirstNameAndLastName,
  capitalizeName,
  checkUrl,
  dateObjectToHTMLDate,
  // HTMLDateToDateObject,
  checkRating,
  checkStatus,
} from "./helper.js";

export const resolvers = {
  // ObjectID: ObjectID,
  DateTime: DateTime,
  // base64: Base64,

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
        comments?.map((comment) => {
          total += comment.rating;
          count += 1;
        });
        return isNaN(total / count) ? 0 : Number((total / count).toFixed(2));
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
  },

  Product: {
    possible_buyers: async (parentValue) => {
      try {
        const users = await userCollection();
        const usersData = await users.find({}).toArray();
        const possible_buyers = parentValue.possible_buyers;
        let possible_buyers_info = [];
        possible_buyers?.map((id) => {
          let user = usersData.find((user) => user._id === id);
          possible_buyers_info.push(user);
        });
        return possible_buyers_info;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
  },

  Post: {
    possible_sellers: async (parentValue) => {
      try {
        const users = await userCollection();
        const usersData = await users.find({}).toArray();
        const possible_sellers = parentValue.possible_sellers;
        let possible_sellers_info = [];
        possible_sellers?.map((id) => {
          let user = usersData.find((user) => user._id === id);
          possible_sellers_info.push(user);
        });
        return possible_sellers_info;
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
          // if (!allProducts) {
          //   throw new GraphQLError("Product not found", {
          //     extensions: { code: "NOT_FOUND" },
          //   });
          // }
          for (let i = 0; i < allProducts.length; i++) {
            allProducts[i].date = dateObjectToHTMLDate(allProducts[i].date);
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
          allPosts = await posts.find({}).sort({ date: -1 }).toArray();
          // if (!allPosts) {
          //   throw new GraphQLError("Post not found", {
          //     extensions: { code: "NOT_FOUND" },
          //   });
          // }
          for (let i = 0; i < allPosts.length; i++) {
            allPosts[i].date = dateObjectToHTMLDate(allPosts[i].date);
          }
          client.json.set(`allPosts`, "$", allPosts);
          client.expire(`allPosts`, 3600);
        }
        return allPosts;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    // searchProducts: async (_, args) => {
    //   try {
    //     const products = await productCollection();
    //     products.createIndex({
    //       name: "text",
    //       // description: "text",
    //       // category: "text",
    //     });
    //     var productList = await client.json.get(
    //       `searchProducts-${args.searchTerm}`,
    //       "$"
    //     );
    //     if (!productList) {
    //       productList = await products
    //         .find({ $text: { $search: args.searchTerm } })
    //         .toArray();
    //       if (!productList) {
    //         throw new GraphQLError("product not found", {
    //           extensions: { code: "NOT_FOUND" },
    //         });
    //       }
    //       for (let i = 0; i < productList.length; i++) {
    //         productList[i].date = dateObjectToHTMLDate(productList[i].date);
    //       }
    //       client.json.set(
    //         `searchProducts-${args.searchTerm}`,
    //         "$",
    //         productList
    //       );
    //       client.expire(`searchProducts-${args.searchTerm}`, 60);
    //     }
    //     return productList;
    //   } catch (error) {
    //     throw new GraphQLError(error.message);
    //   }
    // },

    searchPosts: async (_, args) => {
      try {
        let postItem = checkName(args.searchTerm);

        if (args.category) {
          args.category = checkCategory(args.category);
        }

        const posts = await postCollection();
        // var postsByItem = await client.json.get(
        //   `searchPostsByItem-${postItem}`,
        //   "$"
        // );
        // if (!postsByItem) {

        let postsByItem = [];

        if (args.category) {
          postsByItem = await posts
            .find({
              item: { $regex: postItem, $options: "i" },
              category: args.category,
            })
            .sort({ date: -1 })
            .toArray();
        } else {
          postsByItem = await posts
            .find({
              item: { $regex: postItem, $options: "i" },
            })
            .sort({ date: -1 })
            .toArray();
        }

        // if (!postsByItem) {
        //   throw new GraphQLError("post not found", {
        //     extensions: { code: "NOT_FOUND" },
        //   });
        // }

        for (let i = 0; i < postsByItem.length; i++) {
          postsByItem[i].date = dateObjectToHTMLDate(postsByItem[i].date);
        }
        // client.json.set(`searchPostsByItem-${postItem}`, "$", postsByItem);
        // }
        return postsByItem;
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
        // var productsByName = await client.json.get(
        //   `searchProductsByName-${productName}`,
        //   "$"
        // );
        // if (!productsByName) {
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

        // if (!productsByName) {
        //   throw new GraphQLError("product not found", {
        //     extensions: { code: "NOT_FOUND" },
        //   });
        // }
        for (let i = 0; i < productsByName.length; i++) {
          productsByName[i].date = dateObjectToHTMLDate(productsByName[i].date);
        }
        // client.json.set(
        //   `searchProductsByName-${productName}`,
        //   "$",
        //   productsByName
        // );
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
            throw new GraphQLError("product not found", {
              extensions: { code: "NOT_FOUND" },
            });
          }
          product.date = dateObjectToHTMLDate(product.date);
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
        let productList = await client.json.get(
          `getProductsByStatus-${status}`,
          "$"
        );
        if (!productList) {
          const products = await productCollection();
          productList = await products
            .find({ status: status })
            .sort({ date: -1 })
            .toArray();
          if (!productList) {
            throw new GraphQLError("product not found", {
              extensions: { code: "NOT_FOUND" },
            });
          }
          for (let i = 0; i < productList.length; i++) {
            productList[i].date = dateObjectToHTMLDate(productList[i].date);
          }
          client.json.set(`getProductsByStatus-${status}`, "$", productList);
          client.expire(`getProductsByStatus-${status}`, 3600);
        }
        return productList;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    // getProductsByIds: async (_, args) => {
    //   try {
    //     const productData = await productCollection();
    //     const objectIds = args.ids.map((id) => new ObjectId(id));
    //     const products = await productData
    //       .find({ _id: { $in: objectIds } })
    //       .toArray();
    //     // if (!products) {
    //     //   throw new GraphQLError("product not found", {
    //     //     extensions: { code: "NOT_FOUND" },
    //     //   });
    //     // }
    //     for (let i = 0; i < products.length; i++) {
    //       products[i].date = dateObjectToHTMLDate(products[i].date);
    //     }
    //     return products;
    //   } catch (error) {
    //     throw new GraphQLError(error.message);
    //   }
    // },

    getProductsByCategory: async (_, args) => {
      try {
        let category = checkCategory(args.category);
        const productData = await productCollection();
        const products = await productData
          .find({ category: category })
          .sort({ date: -1 })
          .toArray();
        // if (!products) {
        //   throw new GraphQLError("product not found", {
        //     extensions: { code: "NOT_FOUND" },
        //   });
        // }
        for (let i = 0; i < products.length; i++) {
          products[i].date = dateObjectToHTMLDate(products[i].date);
        }

        return products;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    getProductsByPriceRange: async (_, args) => {
      try {
        let { low, high } = args;
        if (!low) {
          low = 0;
        }
        checkPriceMinMax(low, high);

        const productData = await productCollection();
        const products = await productData
          .find({ price: { $lte: high, $gte: low } })
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
        let post = await client.json.get(`getPostById-${id}`, "$");
        if (!post) {
          const posts = await postCollection();
          post = await posts.findOne({ _id: new ObjectId(id) });
          if (!post) {
            throw new GraphQLError("post not found", {
              extensions: { code: "NOT_FOUND" },
            });
          }
          post.date = dateObjectToHTMLDate(post.date);
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
        if (!postsByCategory) {
          throw new GraphQLError("Post not found", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        for (let i = 0; i < postsByCategory.length; i++) {
          postsByCategory[i].date = dateObjectToHTMLDate(
            postsByCategory[i].date
          );
        }
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
        if (!posts) {
          throw new GraphQLError("Post not found", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        for (let i = 0; i < posts.length; i++) {
          posts[i].date = dateObjectToHTMLDate(posts[i].date);
        }
        return posts;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    getUserById: async (_, args) => {
      try {
        let id = checkString(args._id);
        const usersData = await userCollection();
        // var user = await client.json.get(`getUserById-${id}`, "$");
        // if (!user) {
        let user = await usersData.findOne({ _id: id });
        if (!user) {
          throw new GraphQLError("User not found", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        // }
        // await client.json.set(`getUserById-${id}`, "$", user);
        // client.expire(`getUserById-${id}`, 60);
        let comment_string = user.comments.map((comment) => {
          comment.date = dateObjectToHTMLDate(comment.date);
          return comment;
        });
        user.comment = comment_string;
        return user;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    getUsersByIds: async (_, args) => {
      try {
        // console.log(args);
        // let ids = checkString();
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
        // console.log(args);
        let id = checkId(args._id);
        const chatData = await chatCollection();
        const chat = await chatData.findOne({ _id: new ObjectId(id) });
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
        let seller_id = checkString(args._id);
        const posts = await postCollection();
        // var sellerPosts = await client.json.get(
        //   `getPostBySeller-${args._id}`,
        //   "$"
        // );
        // if (!sellerPosts) {
        let sellerPosts = await posts
          .find({ seller_id: seller_id })
          .sort({ date: -1 })
          .toArray();
        if (!sellerPosts) {
          throw new GraphQLError("Post not found", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        for (let i = 0; i < sellerPosts.length; i++) {
          sellerPosts[i].date = dateObjectToHTMLDate(sellerPosts[i].date);
        }
        //   client.json.set(`getPostBySeller-${args._id}`, "$", sellerPosts);
        //   client.expire(`getPostBySeller-${args._id}`, 60);
        // }
        return sellerPosts;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    getPostByBuyer: async (_, args) => {
      try {
        // var buyerPosts = await client.json.get(
        //   `getPostByBuyer-${args._id}`,
        //   "$"
        // );
        // if (!buyerPosts) {
        let buyer_id = checkString(args._id);

        const posts = await postCollection();
        let buyerPosts = await posts
          .find({ buyer_id: buyer_id })
          .sort({ date: -1 })
          .toArray();
        if (!buyerPosts) {
          throw new GraphQLError("Post not found", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        for (let i = 0; i < buyerPosts.length; i++) {
          buyerPosts[i].date = dateObjectToHTMLDate(buyerPosts[i].date);
        }
        // client.json.set(`getPostByBuyer-${args._id}`, "$", buyerPosts);
        //   client.expire(`getPostByBuyer-${args._id}`, 60);
        // }
        return buyerPosts;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
    getProductBySeller: async (_, args) => {
      try {
        const products = await productCollection();
        // var sellerProducts = await client.json.get(
        //   `getProductBySeller-${args._id}`,
        //   "$"
        // );
        // if (!sellerProducts) {
        let seller_id = checkString(args._id);

        let sellerProducts = await products
          .find({ seller_id: seller_id })
          .sort({ date: -1 })
          .toArray();
        if (!sellerProducts) {
          throw new GraphQLError("Product not found", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        for (let i = 0; i < sellerProducts.length; i++) {
          sellerProducts[i].date = dateObjectToHTMLDate(sellerProducts[i].date);
          // }
          // client.json.set(
          //   `getProductBySeller-${args._id}`,
          //   "$",
          //   sellerProducts
          // );
          // client.expire(`getProductBySeller-${args._id}`, 60);
        }
        return sellerProducts;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
    getProductByBuyer: async (_, args) => {
      try {
        // var buyerProducts = await client.json.get(
        //   `getProductByBuyer-${args._id}`,
        //   "$"
        // );
        // if (!buyerProducts) {
        let buyer_id = checkString(args._id);

        const products = await productCollection();
        let buyerProducts = await products
          .find({ buyer_id: buyer_id })
          .sort({ date: -1 })
          .toArray();
        if (!buyerProducts) {
          throw new GraphQLError("Product not found", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        for (let i = 0; i < buyerProducts.length; i++) {
          buyerProducts[i].date = dateObjectToHTMLDate(buyerProducts[i].date);
        }
        //   client.json.set(`getProductByBuyer-${args._id}`, "$", buyerProducts);
        //   client.expire(`getProductByBuyer-${args._id}`, 60);
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
        const commentExist = await users
          .find({
            _id: user_id,
            "comments.comment_id": comment_id,
          })
          .toArray();
        console.log(commentExist[0]);
        return commentExist[0];
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
        newProduct.date = dateObjectToHTMLDate(newProduct.date);
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
        let item = checkName(args.item);
        let category = checkCategory(args.category);
        let price = checkPrice(args.price);
        let condition = checkCondition(args.condition);
        let description = checkDescription(args.description);
        const posts = await postCollection();
        const newPost = {
          _id: new ObjectId(),
          buyer_id: buyer_id,
          seller_id: null,
          item: item,
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

        newPost.date = dateObjectToHTMLDate(newPost.date);
        return newPost;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    editPost: async (_, args) => {
      try {
        // if (Object.keys(args).length < 7 || Object.keys(args).length > 9) {
        //   throw new GraphQLError("All fields are required", {
        //     extensions: { code: "BAD_INPUT" },
        //   });
        // }
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
        let item = checkName(args.item);
        let category = checkCategory(args.category);
        let price = checkPrice(args.price);
        let condition = checkCondition(args.condition);
        let description = checkDescription(args.description);
        let status = checkStatus(args.status);
        if (
          item == post.item &&
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
        if (status == "completed") {
          seller_id = checkString(args.seller_id);
          if (!post.possible_sellers.includes(seller_id)) {
            throw new GraphQLError(`Not valid seller`, {
              extensions: { code: "BAD_INPUT" },
            });
          }
          completion_date = new Date();
        }
        const updatedPost = {
          item: item,
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
        updated.date = dateObjectToHTMLDate(updated.date);
        if (completion_date) {
          updated.completion_date = dateObjectToHTMLDate(
            updated.completion_date
          );
        }
        return updated;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    editProduct: async (_, args) => {
      try {
        // if (Object.keys(args).length != 9) {
        //   throw new GraphQLError("All fields are required", {
        //     extensions: { code: "BAD_INPUT" },
        //   });
        // }
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
        if (status == "completed") {
          buyer_id = checkString(args.buyer_id);
          if (!product.possible_buyers.includes(buyer_id)) {
            throw new GraphQLError(`Not valid buyer`, {
              extensions: { code: "BAD_INPUT" },
            });
          }
          completion_date = new Date();
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
        updated.date = dateObjectToHTMLDate(updated.date);
        if (completion_date) {
          updated.completion_date = dateObjectToHTMLDate(
            updated.completion_date
          );
        }
        return updated;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    addUser: async (_, args) => {
      try {
        let { _id, email, firstname, lastname, favorite } = args;
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
          favorite: favorite ? [favorite] : [],
          favorite_post: [],
          comments: [],
          rating: 0,
        };
        const insertedUser = await usersData.insertOne(newUser);
        if (!insertedUser) {
          throw new GraphQLError(`Could not Add User`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
        // client.json.set(`getUserById-${_id}`, "$", newUser);
        // client.expire(`getUserById-${_id}`, 3600);
        // client.json.del(`allUsers`);
        return newUser;
      } catch (error) {
        throw new GraphQLError(error);
      }
    },

    editUser: async (_, args) => {
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
        console.log(typeof updatedUser.rating);

        if (!updatedUser) {
          throw new GraphQLError(`Could not Edit User`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
        // client.json.set(`getUserById-${_id}`, "$", updatedUser);
        // client.expire(`getUserById-${_id}`, 3600);
        // client.json.del(`allUsers`);
        return updatedUser;
      } catch (error) {
        throw new GraphQLError(error);
      }
    },

    addChat: async (_, args) => {
      try {
        let { participants } = args;
        const chatData = await chatCollection();

        const chat = await chatData.findOne({
          participants: { $all: participants },
        });

        if (!chat) {
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
        }
        for (let i = 0; i < chat.messages.length; i++) {
          chat.messages[i].time = dateObjectToHTMLDate(
            chat.messages[i].time
          ).toString();
        }
        return chat;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    addMessage: async (_, args) => {
      try {
        let { _id, sender, time, message } = args;
        const chatData = await chatCollection();
        const chat = await chatData.find({ id: new ObjectId(_id) });

        if (chat) {
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
          newMessage.time = dateObjectToHTMLDate(newMessage.time).toString();
          return newMessage;
        }
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    // retrievePost: async (_, args) => {
    //   try {
    //     const id = checkId(args._id);
    //     const user_id = checkString(args.user_id);
    //     const posts = await postCollection();
    //     let post = await posts.findOne({ _id: new ObjectId(id) });
    //     if (!post) {
    //       throw new GraphQLError("post not found", {
    //         extensions: { code: "NOT_FOUND" },
    //       });
    //     }
    //     if (post.buyer_id != user_id) {
    //       throw new GraphQLError("User not found", {
    //         extensions: { code: "NOT_FOUND" },
    //       });
    //     }
    //     if (post.status !== "active") {
    //       throw new GraphQLError("Cannot retrieve post", {
    //         extensions: { code: "BAD_INPUT" },
    //       });
    //     }
    //     const retrieve = await posts.updateOne(
    //       { _id: new ObjectId(id) },
    //       { $set: { status: "inactive" } }
    //     );

    //     if (retrieve.acknowledged != true) {
    //       throw new GraphQLError("Cannot retrieve post", {
    //         extensions: { code: "INTERNAL_SERVER_ERROR" },
    //       });
    //     }
    //     client.json.set(`getPostById-${id}`, "$", post);
    //     client.expire(`getPostById-${id}`, 3600);
    //     post = await posts.findOne({ _id: new ObjectId(id) });
    //     post.date = dateObjectToHTMLDate(post.date);
    //     return post;
    //   } catch (error) {
    //     throw new GraphQLError(error.message);
    //   }
    // },

    // repostPost: async (_, args) => {
    //   try {
    //     const id = checkId(args._id);
    //     const user_id = checkString(args.user_id);
    //     const posts = await postCollection();
    //     let post = await posts.findOne({ _id: new ObjectId(id) });
    //     if (!post) {
    //       throw new GraphQLError("post not found", {
    //         extensions: { code: "NOT_FOUND" },
    //       });
    //     }
    //     if (post.buyer_id != user_id) {
    //       throw new GraphQLError("User not found", {
    //         extensions: { code: "NOT_FOUND" },
    //       });
    //     }
    //     if (post.status !== "inactive") {
    //       throw new GraphQLError("Cannot repost", {
    //         extensions: { code: "BAD_INPUT" },
    //       });
    //     }
    //     const repost = await posts.updateOne(
    //       { _id: new ObjectId(id) },
    //       { $set: { status: "active", date: new Date() } }
    //     );
    //     if (repost.acknowledged != true) {
    //       throw new GraphQLError("Cannot repost", {
    //         extensions: { code: "INTERNAL_SERVER_ERROR" },
    //       });
    //     }
    //     client.json.set(`getPostById-${id}`, "$", post);
    //     client.expire(`getPostById-${id}`, 3600);
    //     post = await posts.findOne({ _id: new ObjectId(id) });
    //     post.date = dateObjectToHTMLDate(post.date);
    //     return post;
    //   } catch (error) {
    //     throw new GraphQLError(error.message);
    //   }
    // },

    addProductToUserFavorite: async (_, args) => {
      console.log("addProductToUserFavorite");
      let { _id, productId } = args;
      try {
        //find current user by id
        const usersData = await userCollection();
        let userToUpdate = await usersData.findOne({ _id: _id.toString() });
        if (!userToUpdate) {
          throw new GraphQLError(`USER NOT FOUND`, {
            extensions: { code: "NOT_FOUND" },
          });
        }
        //check if the productId already exists
        let favorite = userToUpdate.favorite || [];
        if (favorite && favorite.includes(productId)) {
          throw new GraphQLError(`Areadly favorite this product`, {
            extensions: { code: "BAD_INPUT" },
          });
        }

        //add new product into favorite array and update
        favorite = [...favorite, productId];
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
        client.json.del(`allProducts`);
        client.json.del(`getProductById-${productId._id.toString()}`);

        return updatedUser.favorite;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    addPostToUserFavorite: async (_, args) => {
      let { _id, postId } = args;
      try {
        //find current user by id
        const usersData = await userCollection();
        let userToUpdate = await usersData.findOne({ _id: _id.toString() });
        if (!userToUpdate) {
          throw new GraphQLError(`USER NOT FOUND`, {
            extensions: { code: "NOT_FOUND" },
          });
        }
        //check if the postId already exists
        let favorite_post = userToUpdate.favorite_post || [];
        if (favorite_post && favorite_post.includes(postId)) {
          throw new GraphQLError(`Areadly favorite this post`, {
            extensions: { code: "BAD_INPUT" },
          });
        }

        //add new post into favorite array and update
        favorite_post = [...favorite_post, postId];
        userToUpdate.favorite_post = favorite_post;
        const updatedUser = await usersData.findOneAndUpdate(
          { _id: _id.toString() },
          { $set: { favorite_post: favorite_post } },
          { new: true }
        );

        if (!updatedUser) {
          throw new GraphQLError(`Could not Edit User`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
        client.json.del(`getPostById-${postId._id.toString()}`);
        client.json.del(`allPosts`);
        return updatedUser.favorite_post;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    addComment: async (_, args) => {
      try {
        const users = await userCollection();
        const user_id = checkString(args.user_id);
        const firstname = checkString(args.firstname);
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
          firstname: firstname,
          comment: commentText,
          date: new Date(),
        };

        const insert = await users.updateOne(
          { _id: user_id },
          { $push: { comments } }
        );
        if (insert.acknowledged != true) {
          throw new GraphQLError("Cannot update comment", {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
        const user = await users.findOne({ _id: user_id });
        return user;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    removeProductFromUserFavorite: async (_, args) => {
      console.log("removeProductFromUserFavorite");
      let { _id, productId } = args;
      try {
        //find current user by id
        const usersData = await userCollection();
        const userToUpdate = await usersData.findOne({ _id: _id.toString() });
        if (!userToUpdate) {
          throw new GraphQLError(`USER NOT FOUND`, {
            extensions: { code: "NOT_FOUND" },
          });
        }
        //check if the productIdexists
        let favorite = userToUpdate.favorite || [];
        if (favorite && !favorite.includes(productId)) {
          throw new GraphQLError(`Cannot found this product in favorite`, {
            extensions: { code: "BAD_INPUT" },
          });
        }

        //add new product into favorite array and update
        favorite = favorite.filter((id) => id !== productId);
        const updatedUser = await usersData.findOneAndUpdate(
          { _id: _id.toString() },
          { $set: { favorite: favorite } },
          { returnDocument: "after" }
        );

        if (!updatedUser) {
          throw new GraphQLError(`Could not Edit User`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
        client.json.del(`allProducts`);
        client.json.del(`getProductById-${productId._id.toString()}`);

        return updatedUser.favorite;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    removePostFromUserFavorite: async (_, args) => {
      let { _id, postId } = args;
      try {
        //find current user by id
        const usersData = await userCollection();
        const userToUpdate = await usersData.findOne({ _id: _id.toString() });
        if (!userToUpdate) {
          throw new GraphQLError(`USER NOT FOUND`, {
            extensions: { code: "NOT_FOUND" },
          });
        }
        //check if the postId exists
        let favorite_post = userToUpdate.favorite_post || [];
        if (favorite_post && !favorite_post.includes(postId)) {
          throw new GraphQLError(`Cannot found this post in favorite`, {
            extensions: { code: "BAD_INPUT" },
          });
        }

        //add new post into favorite array and update
        favorite_post = favorite_post.filter((id) => id !== postId);
        const updatedUser = await usersData.findOneAndUpdate(
          { _id: _id.toString() },
          { $set: { favorite_post: favorite_post } },
          { returnDocument: "after" }
        );

        if (!updatedUser) {
          throw new GraphQLError(`Could not Edit User`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
        client.json.del(`allPosts`);
        client.json.del(`getPostById-${postId._id.toString()}`);

        return updatedUser.favorite_post;
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

        // const commentExist = await users.findOne(
        //   {
        //     _id: user_id,
        //     "comments.comment_id": comment_id,
        //   },
        //   { "comments.$": 1 }
        // );
        const commentExist = await users.findOne(
          {
            _id: user_id,
          },
          {
            projection: {
              comments: { $elemMatch: { comment_id: comment_id } },
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
        const prevComment = commentExist.comments[0];
        const comments = {
          _id: new ObjectId(),
          comment_id: comment_id,
          rating: rating,
          comment: commentText,
          firstname: commentExist.comments[0].firstname,
          date: new Date(),
        };

        if (
          prevComment.rating === args.rating &&
          prevComment.commentText === args.commentText
        ) {
          throw new GraphQLError(`NO CHANGE MADE`, {
            extensions: { code: "BAD_INPUT" },
          });
        }

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
          return;
        }
        const users = await userCollection();
        const buyer = await users.findOne({ _id: buyer_id });
        if (!buyer) {
          throw new GraphQLError("buyer not found", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        const update = await products.findOneAndUpdate(
          { _id: new ObjectId(_id) },
          { $push: { possible_buyers: buyer_id } },
          { returnDocument: "after" }
        );
        if (!update) {
          throw new GraphQLError(`Could not Edit Product`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }

        client.json.del(`allProducts`);
        client.json.del(`getProductsByStatus-active`);
        client.json.del(`getProductById-${_id}`);

        return update;
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
          throw new GraphQLError("You are not a possible buyer", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        const users = await userCollection();
        const buyer = await users.findOne({ _id: buyer_id });
        if (!buyer) {
          throw new GraphQLError("buyer not found", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        const update = await products.findOneAndUpdate(
          { _id: new ObjectId(_id) },
          { $pull: { possible_buyers: buyer_id } },
          { returnDocument: "after" }
        );
        if (!update) {
          throw new GraphQLError(`Could not Edit Product`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }

        client.json.del(`allProducts`);
        client.json.del(`getProductsByStatus-active`);
        client.json.del(`getProductById-${_id}`);

        return update;
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
        const update = await posts.findOneAndUpdate(
          { _id: new ObjectId(_id) },
          { $push: { possible_sellers: seller_id } }
        );
        if (!update) {
          throw new GraphQLError(`Could not Edit Post`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }

        client.json.del(`allPosts`);
        client.json.del(`getPostById-${_id}`);

        return update;
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
        const users = await userCollection();
        const seller = await users.findOne({ _id: seller_id });
        if (!seller) {
          throw new GraphQLError("seller not found", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        const update = await posts.findOneAndUpdate(
          { _id: new ObjectId(_id) },
          { $pull: { possible_sellers: seller_id } }
        );
        if (!update) {
          throw new GraphQLError(`Could not Edit Post`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }

        client.json.del(`allPosts`);
        client.json.del(`getPostById-${_id}`);

        return update;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
  },
};
