import { dbConnection, closeConnection } from "./config/mongoConnection.js";
import { users, products, posts } from "./config/mongoCollections.js";
import { ObjectId } from "mongodb";
const userList = [
  {
    _id: "mRdeR8wDRzLVEbeer5PpbJY6TDE3",
    email: "lfu7@stevens.edu",
    firstname: "Luoyi",
    lastname: "Fu",
    favorite: [],
    comments: [],
    rating: 0,
  },
  {
    _id: "8C5bGSz1FRVbAQ47EDnDSvmKsqg2",
    email: "cwu34@stevens.edu",
    firstname: "Jason",
    lastname: "Wu",
    favorite: [],
    comments: [],
    rating: 0,
  },
  {
    _id: "7SKDog0fjKOeS1jeuq32a9vYPue2",
    email: "dchen30@stevens.edu",
    firstname: "Karol",
    lastname: "Chen",
    favorite: [],
    comments: [],
    rating: 0,
  },
];

// products
const conditions = ["brand new", "like new", "gently used", "functional"];
const sellers = [
  "mRdeR8wDRzLVEbeer5PpbJY6TDE3",
  "8C5bGSz1FRVbAQ47EDnDSvmKsqg2",
  "7SKDog0fjKOeS1jeuq32a9vYPue2",
  "S3OyV8HdgkZk0yxKB3OHeqJoz2K3",
];
const productDetails = {
  Pencils: {
    d: "5 pencils",
    c: "stationary",
    p: 2,
    url: "https://pyxis.nymag.com/v1/imgs/f70/b36/dafb7c55f8d7ea922ec70f6a02704b01e5-23-pencils-lede.rsocial.w1200.jpg",
  },
  "Python Book": {
    d: "python crash course",
    c: "book",
    p: 10,
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwRcdBg-GCBqPwOLjD78QGItWTAtW_sLH9UmRZwbYo0aPZTF--CP4d1mLL-rCd62baU4k&usqp=CAU",
  },
  "Java Book": {
    d: "O'REILLY' - Java A Learner's Guide ...",
    c: "book",
    p: 10,
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJrliVoUmqzPfOU1cfkILh3KK_BmxbFaTiozAhhz9tOWc6N185p7ruvS2XSRKQh0tRxlM&usqp=CAU",
  },
  Clothes: {
    d: "old clothes",
    c: "clothing",
    p: 20,
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBcoBPjwy_iEjEcOfo60pFHgpYzBr9Ka-fSMGKBDbjfdTQt-06mPLLSYnbN0NRgmZwR0U&usqp=CAU",
  },
  "C++ Book": {
    d: "C++ for beginners",
    c: "book",
    p: 13,
    url: "https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/41FQ-HlNyRL.jpg",
  },
  "Management Book": {
    d: "the making of a manager",
    c: "book",
    p: 20,
    url: "https://www.monday.com/blog/wp-content/uploads/2018/02/The-Making-of-a-Manager-bookcover-min.jpg",
  },
  "Ruby Book": {
    d: "ruby programming for beginners",
    c: "book",
    p: 8,
    url: "https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/61Ku7Vdu5oL._AC_UF1000,1000_QL80_.jpg",
  },
  "OS Book": {
    d: "OS principle",
    c: "book",
    p: 13,
    url: "https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/81eF-RxjuaL._AC_UF1000,1000_QL80_.jpg",
  },
  "C# Book": {
    d: "3 in 1 C# books",
    c: "book",
    p: 13,
    url: "https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/41AaTO7oW8L.jpg",
  },
  desk: {
    d: "used desk",
    c: "furniture",
    p: 20,
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRuEyiK-ric-yatz27VQS1Vhrah_4HdI0YY1TFiYyRzQx3p38RrzHKjyqM0b43mZ2KVoU&usqp=CAU",
  },
  "MacBook Air": {
    d: "2016 model",
    c: "electronics",
    p: 250,
    url: "https://www.stuff.tv/wp-content/uploads/sites/2/2021/08/macbook-aie-13-5.jpg",
  },
  Phone: {
    d: "iphone 6",
    c: "electronics",
    p: 150,
    url: "https://images.squarespace-cdn.com/content/v1/52f810fee4b056ca2bfd83e4/1565900582647-3SKF8IIUJOTV80SICFA9/IMG_3270.jpeg?format=1000w",
  },
  "CSS Book": {
    d: "CSS book for beginners",
    c: "book",
    p: 3,
    url: "https://m.media-amazon.com/images/I/51Gh1bFIMlL.jpg",
  },
  "TCP/IP Book": {
    d: "TCP/IP protocol suit",
    c: "book",
    p: 15,
    url: "https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/71qjvHSamPL._AC_UF1000,1000_QL80_.jpg",
  },
  "AWS Book": {
    d: "AWS for Sys Admin",
    c: "book",
    p: 30,
    url: "https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/61D+aXM2IzL._AC_UF1000,1000_QL80_.jpg",
  },
  "Algorithm Book": {
    d: "Intro to Algorithm",
    c: "book",
    p: 10,
    url: "https://miro.medium.com/v2/resize:fit:1400/1*lY4N4t53Su3Yno74f3ERww.jpeg",
  },
  "Cloud Computing Book": {
    d: "Cloud Computing Principles",
    c: "book",
    p: 10,
    url: "https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/614pDdD9RZL._AC_UF1000,1000_QL80_.jpg",
  },
  "AI Book": {
    d: "AI 3 in 1",
    c: "book",
    p: 16,
    url: "https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/71hVs7-LyAL._AC_UF1000,1000_QL80_.jpg",
  },
  "Finance Book": {
    d: "deep finance",
    c: "book",
    p: 25,
    url: "https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9781637350270/deep-finance-9781637350270_hr.jpg",
  },
};

let productList = [];

for (let key in productDetails) {
  const details = productDetails[key];
  const randomSeller = Math.floor(Math.random() * sellers.length);
  const randomCondition = Math.floor(Math.random() * conditions.length);

  const product = {
    _id: new ObjectId(),
    name: key,
    price: details.p,
    date: new Date(
      `2023-${Math.floor(Math.random() * 11) + 1}-${
        Math.floor(Math.random() * 27) + 1
      }`
    ),
    description: details.d,
    condition: conditions[randomCondition],
    seller_id: sellers[randomSeller],
    buyer_id: null,
    image: details.url,
    category: details.c,
    status: "active",
    possible_buyers: [],
    completion_date: null,
  };
  // console.log(product);

  productList.push(product);
}

//   {
//     _id: new ObjectId(),
//     name: "pencils",
//     price: 3,
//     date: new Date("2023-12-01"),
//     description: "5 pencils",
//     condition: "Functional",
//     seller_id: "mRdeR8wDRzLVEbeer5PpbJY6TDE3",
//     buyer_id: null,
//     image:
//       "https://pyxis.nymag.com/v1/imgs/f70/b36/dafb7c55f8d7ea922ec70f6a02704b01e5-23-pencils-lede.rsocial.w1200.jpg",
//     category: "Other",
//     status: "active",
//     possible_buyers: [],
//     completion_date: null,
//   },
//   {
//     _id: new ObjectId(),
//     name: "phone",
//     price: 500,
//     date: new Date("2023-12-01"),
//     description: "test",
//     condition: "Gently Used",
//     seller_id: "7SKDog0fjKOeS1jeuq32a9vYPue2",
//     buyer_id: null,
//     image:
//       "https://vviv-images.s3.us-west-1.amazonaws.com/phone1702950060654deeppurple1.webp",
//     category: "Electronics",
//     status: "active",
//     possible_buyers: [],
//     completion_date: null,
//   },
//   {
//     // _id: {
//     //   $oid: "6580f7bb26a29e6992110a1f",
//     // },
//     _id: new ObjectId(),
//     name: "desk",
//     price: 12,
//     date: new Date("2023-12-01"),
//     description: "test",
//     condition: "Brand New",
//     seller_id: "7SKDog0fjKOeS1jeuq32a9vYPue2",
//     buyer_id: null,
//     image:
//       "https://vviv-images.s3.us-west-1.amazonaws.com/desk1702950840957download.png",
//     category: "Furniture",
//     status: "active",
//     possible_buyers: [],
//     completion_date: null,
//   },
//   {
//     _id: new ObjectId(),
//     name: "python 101",
//     price: 10,
//     date: new Date("2023-12-11"),
//     description: "python book",
//     condition: "Brand New",
//     seller_id: "8C5bGSz1FRVbAQ47EDnDSvmKsqg2",
//     buyer_id: null,
//     image: "7ENPNeTB3qkgvrS+W9aXTg==",
//     category: "Book",
//     status: "active",
//     possible_buyers: [],
//     completion_date: null,
//   },
//   {
//     _id: new ObjectId(),
//     name: "java 101",
//     price: 10,
//     date: new Date("2023-12-12"),
//     description: "java book",
//     condition: "Brand New",
//     seller_id: "mRdeR8wDRzLVEbeer5PpbJY6TDE3",
//     buyer_id: null,
//     image: "7ENPNeTB3qkgvrS+W9aXTg==",
//     category: "Book",
//     status: "active",
//     possible_buyers: [],
//     completion_date: null,
//   },
//   {
//     _id: new ObjectId(),
//     name: "javascript 101",
//     price: 10,
//     date: new Date("2023-12-13"),
//     description: "javascript book",
//     condition: "Brand New",
//     seller_id: "8C5bGSz1FRVbAQ47EDnDSvmKsqg2",
//     buyer_id: null,
//     image: "7ENPNeTB3qkgvrS+W9aXTg==",
//     category: "Book",
//     status: "active",
//     possible_buyers: [],
//     completion_date: null,
//   },
//   {
//     _id: new ObjectId(),
//     name: "C# 101",
//     price: 10,
//     date: new Date("2023-12-14"),
//     description: "C# book",
//     condition: "Brand New",
//     seller_id: "mRdeR8wDRzLVEbeer5PpbJY6TDE3",
//     buyer_id: null,
//     image: "7ENPNeTB3qkgvrS+W9aXTg==",
//     category: "Book",
//     status: "active",
//     possible_buyers: [],
//     completion_date: null,
//   },
//   {
//     _id: new ObjectId(),
//     name: "C++ 101",
//     price: 10,
//     date: new Date("2023-12-15"),
//     description: "C++ book",
//     condition: "Brand New",
//     seller_id: "mRdeR8wDRzLVEbeer5PpbJY6TDE3",
//     buyer_id: null,
//     image: "7ENPNeTB3qkgvrS+W9aXTg==",
//     category: "Book",
//     status: "active",
//     possible_buyers: [],
//     completion_date: null,
//   },
//   {
//     _id: new ObjectId(),
//     name: "Kotlin 101",
//     price: 10,
//     date: new Date("2023-12-16"),
//     description: "Kotlin book",
//     condition: "Brand New",
//     seller_id: "mRdeR8wDRzLVEbeer5PpbJY6TDE3",
//     buyer_id: null,
//     image: "7ENPNeTB3qkgvrS+W9aXTg==",
//     category: "Book",
//     status: "active",
//     possible_buyers: [],
//     completion_date: null,
//   },
//   {
//     _id: new ObjectId(),
//     name: "css",
//     price: 1,
//     date: new Date(),
//     description: "css",
//     condition: "Brand New",
//     seller_id: "mRdeR8wDRzLVEbeer5PpbJY6TDE3",
//     buyer_id: null,
//     image:
//       "https://vviv-images.s3.us-west-1.amazonaws.com/css1702976481029home.jpeg",
//     category: "Book",
//     status: "active",
//     possible_buyers: [],
//     completion_date: null,
//   },
// ];

const postList = [
  {
    _id: new ObjectId(),
    buyer_id: "mRdeR8wDRzLVEbeer5PpbJY6TDE3",
    seller_id: null,
    item: "Textbook",
    category: "Book",
    price: 15,
    condition: "Like New",
    date: new Date("2023-12-19"),
    description:
      "Hi, anyone has the textbook for course 554 Web Programming II?",
    status: "active",
    possible_sellers: [],
    completion_date: null,
  },
  {
    _id: new ObjectId(),
    buyer_id: "mRdeR8wDRzLVEbeer5PpbJY6TDE3",
    seller_id: null,
    item: "Calculator",
    category: "Stationary",
    price: 15,
    condition: "Functional",
    date: new Date("2023-12-09"),
    description: "Need a calculator for my math exam! Thank you!",
    status: "active",
    possible_sellers: [],
    completion_date: null,
  },
  {
    _id: new ObjectId(),
    buyer_id: "mRdeR8wDRzLVEbeer5PpbJY6TDE3",
    seller_id: null,
    item: "Pen",
    category: "Stationary",
    price: 10,
    condition: "Brand New",
    date: new Date("2023-12-01"),
    description:
      "EMERGENCY!!!! I have a test this afternoon and really need a black pen!!!!",
    status: "inactive",
    possible_sellers: [],
    completion_date: null,
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
    possible_sellers: ["8C5bGSz1FRVbAQ47EDnDSvmKsqg2"],
    completion_date: new Date("2023-12-08"),
  },
  {
    _id: new ObjectId(),
    buyer_id: "8C5bGSz1FRVbAQ47EDnDSvmKsqg2",
    seller_id: "mRdeR8wDRzLVEbeer5PpbJY6TDE3",
    item: "Phone",
    category: "Electronics",
    price: 10,
    condition: "Brand New",
    date: new Date("2023-12-01"),
    description: "",
    status: "completed",
    possible_sellers: ["mRdeR8wDRzLVEbeer5PpbJY6TDE3"],
    completion_date: new Date("2023-12-08"),
  },
  {
    _id: new ObjectId(),
    buyer_id: "7SKDog0fjKOeS1jeuq32a9vYPue2",
    seller_id: null,
    item: "chair",
    category: "Furniture",
    price: 10,
    condition: "Like New",
    date: new Date(),
    description: "",
    status: "active",
    possible_sellers: [],
    completion_date: null,
  },
];

const main = async () => {
  const db = await dbConnection();
  await db.dropDatabase();
  const userCollection = await users();
  const productCollection = await products();
  const postCollection = await posts();

  await userCollection.insertMany(userList);
  // await productCollection.insertMany(productList);
  // await postCollection.insertMany(postList);

  console.log("Done seeding database");
  await closeConnection();
};

main().catch(console.log);
