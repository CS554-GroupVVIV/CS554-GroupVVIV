import { dbConnection, closeConnection } from "./config/mongoConnection.js";
import { users, products, posts } from "./config/mongoCollections.js";
import { ObjectId } from "mongodb";

const userList = [
  {
    _id: "mRdeR8wDRzLVEbeer5PpbJY6TDE3",
    email: "lfu7@stevens.edu",
    firstname: "Luoyi",
    lastname: "Fu",
  },
  {
    _id: "8C5bGSz1FRVbAQ47EDnDSvmKsqg2",
    email: "cwu34@stevens.edu",
    firstname: "Jason",
    lastname: "Wu",
  },
];
const productList = [
  {
    _id: new ObjectId(),
    name: "pencils",
    price: 3,
    date: new Date("2023-12-01"),
    description: "5 pencils",
    condition: "functional",
    seller_id: "mRdeR8wDRzLVEbeer5PpbJY6TDE3",
    buyer_id: null,
    image: "7ENPNeTB3qkgvrS+W9aXTg==",
    category: "other",
    status: "active",
  },
  {
    _id: new ObjectId(),
    name: "python 101",
    price: 10,
    date: new Date("2023-12-11"),
    description: "python book",
    condition: "Brand New",
    seller_id: "8C5bGSz1FRVbAQ47EDnDSvmKsqg2",
    buyer_id: null,
    image: "7ENPNeTB3qkgvrS+W9aXTg==",
    category: "Book",
    status: "active",
  },
  {
    _id: new ObjectId(),
    name: "java 101",
    price: 10,
    date: new Date("2023-12-12"),
    description: "java book",
    condition: "Brand New",
    seller_id: "mRdeR8wDRzLVEbeer5PpbJY6TDE3",
    buyer_id: null,
    image: "7ENPNeTB3qkgvrS+W9aXTg==",
    category: "Book",
    status: "active",
  },
  {
    _id: new ObjectId(),
    name: "javascript 101",
    price: 10,
    date: new Date("2023-12-13"),
    description: "javascript book",
    condition: "Brand New",
    seller_id: "8C5bGSz1FRVbAQ47EDnDSvmKsqg2",
    buyer_id: null,
    image: "7ENPNeTB3qkgvrS+W9aXTg==",
    category: "Book",
    status: "active",
  },
  {
    _id: new ObjectId(),
    name: "C# 101",
    price: 10,
    date: new Date("2023-12-14"),
    description: "C# book",
    condition: "Brand New",
    seller_id: "mRdeR8wDRzLVEbeer5PpbJY6TDE3",
    buyer_id: null,
    image: "7ENPNeTB3qkgvrS+W9aXTg==",
    category: "Book",
    status: "active",
  },
  {
    _id: new ObjectId(),
    name: "C++ 101",
    price: 10,
    date: new Date("2023-12-15"),
    description: "C++ book",
    condition: "Brand New",
    seller_id: "mRdeR8wDRzLVEbeer5PpbJY6TDE3",
    buyer_id: null,
    image: "7ENPNeTB3qkgvrS+W9aXTg==",
    category: "Book",
    status: "active",
  },
  {
    _id: new ObjectId(),
    name: "Kotlin 101",
    price: 10,
    date: new Date("2023-12-16"),
    description: "Kotlin book",
    condition: "Brand New",
    seller_id: "mRdeR8wDRzLVEbeer5PpbJY6TDE3",
    buyer_id: null,
    image: "7ENPNeTB3qkgvrS+W9aXTg==",
    category: "Book",
    status: "active",
  },
];
const postList = [
  {
    _id: new ObjectId(),
    buyer_id: "mRdeR8wDRzLVEbeer5PpbJY6TDE3",
    seller_id: "",
    item: "Book",
    category: "Book",
    price: 10,
    condition: "Brand New",
    date: new Date(),
    description: "textbook",
    status: "active",
  },
  {
    _id: new ObjectId(),
    buyer_id: "mRdeR8wDRzLVEbeer5PpbJY6TDE3",
    seller_id: "",
    item: "Pen",
    category: "Book",
    price: 10,
    condition: "Brand New",
    date: new Date(),
    description: "black pen",
    status: "inactive",
  },
  {
    _id: new ObjectId(),
    buyer_id: "mRdeR8wDRzLVEbeer5PpbJY6TDE3",
    seller_id: "8C5bGSz1FRVbAQ47EDnDSvmKsqg2",
    item: "Book",
    category: "Book",
    price: 10,
    condition: "Brand New",
    date: new Date("2023-12-07"),
    description: "textbook",
    status: "completed",
  },
  {
    _id: new ObjectId(),
    buyer_id: "8C5bGSz1FRVbAQ47EDnDSvmKsqg2",
    seller_id: "mRdeR8wDRzLVEbeer5PpbJY6TDE3",
    item: "Phone",
    category: "Electronic device",
    price: 10,
    condition: "Brand New",
    date: new Date("2023-12-01"),
    description: "",
    status: "completed",
  },
];

const main = async () => {
  const db = await dbConnection();
  await db.dropDatabase();
  const userCollection = await users();
  const productCollection = await products();
  const postCollection = await posts();

  await userCollection.insertMany(userList);
  await productCollection.insertMany(productList);
  await postCollection.insertMany(postList);

  console.log("Done seeding database");
  await closeConnection();
};

main().catch(console.log);
