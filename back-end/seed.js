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
const userIds = [
  "mRdeR8wDRzLVEbeer5PpbJY6TDE3",
  "8C5bGSz1FRVbAQ47EDnDSvmKsqg2",
  "7SKDog0fjKOeS1jeuq32a9vYPue2",
];
const productDetails = {
  Pencils: {
    d: "7 pencils",
    c: "Stationary",
    p: 2,
    url: "https://pyxis.nymag.com/v1/imgs/f70/b36/dafb7c55f8d7ea922ec70f6a02704b01e5-23-pencils-lede.rsocial.w1200.jpg",
  },
  "Python Book": {
    d: "python crash course",
    c: "Book",
    p: 10,
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwRcdBg-GCBqPwOLjD78QGItWTAtW_sLH9UmRZwbYo0aPZTF--CP4d1mLL-rCd62baU4k&usqp=CAU",
  },
  "Java Book": {
    d: "O'REILLY' - Java A Learner's Guide ...",
    c: "Book",
    p: 10,
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJrliVoUmqzPfOU1cfkILh3KK_BmxbFaTiozAhhz9tOWc6N185p7ruvS2XSRKQh0tRxlM&usqp=CAU",
  },
  Clothes: {
    d: "old clothes",
    c: "Clothing",
    p: 20,
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBcoBPjwy_iEjEcOfo60pFHgpYzBr9Ka-fSMGKBDbjfdTQt-06mPLLSYnbN0NRgmZwR0U&usqp=CAU",
  },
  "C++ Book": {
    d: "C++ for beginners",
    c: "Book",
    p: 13,
    url: "https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/41FQ-HlNyRL.jpg",
  },
  "Management Book": {
    d: "the making of a manager",
    c: "Book",
    p: 20,
    url: "https://www.monday.com/blog/wp-content/uploads/2018/02/The-Making-of-a-Manager-bookcover-min.jpg",
  },
  "Ruby Book": {
    d: "ruby programming for beginners",
    c: "Book",
    p: 8,
    url: "https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/61Ku7Vdu5oL._AC_UF1000,1000_QL80_.jpg",
  },
  "OS Book": {
    d: "OS principle",
    c: "Book",
    p: 13,
    url: "https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/81eF-RxjuaL._AC_UF1000,1000_QL80_.jpg",
  },
  "C# Book": {
    d: "3 in 1 C# books",
    c: "Book",
    p: 13,
    url: "https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/41AaTO7oW8L.jpg",
  },
  desk: {
    d: "used desk",
    c: "Furniture",
    p: 20,
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRuEyiK-ric-yatz27VQS1Vhrah_4HdI0YY1TFiYyRzQx3p38RrzHKjyqM0b43mZ2KVoU&usqp=CAU",
  },
  "MacBook Air": {
    d: "2016 model",
    c: "Electronics",
    p: 250,
    url: "https://www.stuff.tv/wp-content/uploads/sites/2/2021/08/macbook-aie-13-5.jpg",
  },
  Phone: {
    d: "iphone 6",
    c: "Electronics",
    p: 150,
    url: "https://images.squarespace-cdn.com/content/v1/52f810fee4b056ca2bfd83e4/1565900582647-3SKF8IIUJOTV80SICFA9/IMG_3270.jpeg?format=1000w",
  },
  "CSS Book": {
    d: "CSS book for beginners",
    c: "Book",
    p: 3,
    url: "https://m.media-amazon.com/images/I/51Gh1bFIMlL.jpg",
  },
  "TCP/IP Book": {
    d: "TCP/IP protocol suit",
    c: "Book",
    p: 15,
    url: "https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/71qjvHSamPL._AC_UF1000,1000_QL80_.jpg",
  },
  "AWS Book": {
    d: "AWS for Sys Admin",
    c: "Book",
    p: 30,
    url: "https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/61D+aXM2IzL._AC_UF1000,1000_QL80_.jpg",
  },
  "Algorithm Book": {
    d: "Intro to Algorithm",
    c: "Book",
    p: 10,
    url: "https://miro.medium.com/v2/resize:fit:1400/1*lY4N4t53Su3Yno74f3ERww.jpeg",
  },
  "Cloud Computing Book": {
    d: "Cloud Computing Principles",
    c: "Book",
    p: 10,
    url: "https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/614pDdD9RZL._AC_UF1000,1000_QL80_.jpg",
  },
  "AI Book": {
    d: "AI 3 in 1",
    c: "Book",
    p: 16,
    url: "https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/71hVs7-LyAL._AC_UF1000,1000_QL80_.jpg",
  },
  "Finance Book": {
    d: "deep finance",
    c: "Book",
    p: 25,
    url: "https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9781637350270/deep-finance-9781637350270_hr.jpg",
  },
};

let productList = [];

for (let key in productDetails) {
  const details = productDetails[key];
  const randomSeller = Math.floor(Math.random() * userIds.length);
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
    seller_id: userIds[randomSeller],
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

const postDetails = {
  "Textbook for CS554": {
    d: "Hi, anyone has the textbook for course 554 Web Programming II?",
    c: "Book",
  },
  Calculator: {
    d: "Need a calculator for my math exam! Thank you!",
    c: "Electronics",
  },
  Pen: {
    d: "EMERGENCY!!!! I have a test this afternoon and really need a black pen!!!!",
    c: "Stationary",
  },
  "Textbook for CS546": {
    d: "Hi, anyone has the textbook for course 546 Web Programming I?",
    c: "Book",
  },
  Desk: {
    d: "Hi, I'm a freshmen, really need a desk for my room.",
    c: "Furniture",
  },
  Chair: {
    d: "I have desks in my dorm, but no chairs...",
    c: "Furniture",
  },
  Cellphone: {
    d: "OMG!!! I just lost my phone, anyone got an old phone!!!",
    c: "Electronic",
  },
  PS5: {
    d: "To easy getting straight A's, need a PS5",
    c: "Electronic",
  },
  "Windows Laptop": {
    d: "The app I want to use only works on Windows laptops, anyone got one?",
    c: "Electronic",
  },
  "Textbook for CS561": {
    d: "Hi, anyone has the textbook for course 561 DBMS I?",
    c: "Book",
  },
};

let postList = [];
for (let key in postDetails) {
  const details = postDetails[key];
  const randomBuyer = Math.floor(Math.random() * userIds.length);
  const randomCondition = Math.floor(Math.random() * conditions.length);

  const post = {
    _id: new ObjectId(),
    buyer_id: userIds[randomBuyer],
    seller_id: null,
    item: key,
    category: details.c,
    price: Math.floor(Math.random() * 50),
    condition: conditions[randomCondition],
    date: new Date(
      `2023-${Math.floor(Math.random() * 11) + 1}-${
        Math.floor(Math.random() * 27) + 1
      }`
    ),
    description: details.d,
    status: "active",
    possible_sellers: [],
    completion_date: null,
  };

  postList.push(post);
}

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
