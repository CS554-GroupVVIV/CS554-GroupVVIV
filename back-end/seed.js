import { dbConnection, closeConnection } from "./config/mongoConnection.js";
import { users, products, posts, chats } from "./config/mongoCollections.js";
import { ObjectId } from "mongodb";
const userList = [
  {
    _id: "mRdeR8wDRzLVEbeer5PpbJY6TDE3",
    email: "lfu7@stevens.edu",
    firstname: "Luoyi",
    lastname: "Fu",
    favorite: [],
    favorite_post: [],
    comments: [],
  },
  {
    _id: "8C5bGSz1FRVbAQ47EDnDSvmKsqg2",
    email: "cwu34@stevens.edu",
    firstname: "Jason",
    lastname: "Wu",
    favorite: ["6584a667ff6d6e6b84730141", "6584b6619158ad1d1a74b89b"],
    favorite_post: ["6584ad8e36f3bfc519a59f10", "6584b6619158ad1d1a74b89c"],
    comments: [
      {
        _id: new ObjectId(),
        comment:
          "Bad guy! The product is very much worn out though said brand new",
        comment_id: "MakfosvJBSRugNO7tQbAPA8XsW82",
        firstname: "Lori",
        date: new Date("2023-12-01"),
        rating: 2,
      },
      {
        _id: new ObjectId(),
        comment: "Thank you!",
        comment_id: "WiICBEajMHVeQPxxFrpYaMyyRIt1",
        firstname: "Daniel",
        date: new Date("2023-12-21"),
        rating: 5,
      },
    ],
  },
  {
    _id: "7SKDog0fjKOeS1jeuq32a9vYPue2",
    email: "dchen30@stevens.edu",
    firstname: "Karol",
    lastname: "Chen",
    favorite: [],
    favorite_post: [],
    comments: [],
  },
  {
    _id: "MakfosvJBSRugNO7tQbAPA8XsW82",
    email: "luoyi@stevens.edu",
    firstname: "Lori",
    lastname: "Fu",
    favorite: ["6584a667ff6d6e6b84730140", "6584a667ff6d6e6b84730141"],
    favorite_post: ["6584ad8e36f3bfc519a59f0f", "6584ad8e36f3bfc519a59f10"],
    comments: [
      {
        _id: new ObjectId(),
        comment: "Great expereince!",
        comment_id: "8C5bGSz1FRVbAQ47EDnDSvmKsqg2",
        firstname: "Jason",
        date: new Date("2023-12-21"),
        rating: 5,
      },
    ],
  },
  {
    _id: "WiICBEajMHVeQPxxFrpYaMyyRIt1",
    email: "tlu14@stevens.edu",
    firstname: "Daniel",
    lastname: "Lu",
    favorite: [],
    favorite_post: [],
    comments: [],
  },
];

// products
const conditions = ["brand new", "like new", "gently used", "functional"];
const userIds = [
  "mRdeR8wDRzLVEbeer5PpbJY6TDE3",
  "8C5bGSz1FRVbAQ47EDnDSvmKsqg2",
  "7SKDog0fjKOeS1jeuq32a9vYPue2",
];
const userIds_2 = [
  "MakfosvJBSRugNO7tQbAPA8XsW82",
  "WiICBEajMHVeQPxxFrpYaMyyRIt1",
  null,
];
const productDetails = {
  Pencils: {
    d: "7 pencils",
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
  "CPP Book": {
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
    c: "Furniture",
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
  "Cloud Computing": {
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
  const randomSeller = Math.floor(Math.random() * userIds.length);
  const randomCondition = Math.floor(Math.random() * conditions.length);
  const randomBuyer = Math.floor(Math.random() * userIds_2.length);

  const activeProduct = {
    _id: new ObjectId(),
    name: key,
    price: details.p,
    date: new Date(
      `2023-${Math.floor(Math.random() * 10) + 1}-${
        Math.floor(Math.random() * 25) + 1
      }`
    ),
    description: details.d,
    condition: conditions[randomCondition],
    seller_id: userIds[randomSeller],
    buyer_id: null,
    image: details.url,
    category: details.c,
    status: "active",
    possible_buyers: userIds_2[randomBuyer] ? [userIds_2[randomBuyer]] : [],
    completion_date: null,
  };

  productList.push(activeProduct);
}

const activeFavProduct = {
  _id: new ObjectId("6584b6619158ad1d1a74b89b"),
  name: "Disney Plush",
  price: 30,
  date: new Date(`2023-12-21`),
  description: "Hate to say bye to my favorite Winnie Pooh!!",
  condition: "like new",
  seller_id: "MakfosvJBSRugNO7tQbAPA8XsW82",
  buyer_id: null,
  image:
    "https://cdn-ssl.s7.disneystore.com/is/image/DisneyShopping/1516041283894?fmt=webp&qlt=70&wid=1216&hei=1216",
  category: "other",
  status: "active",
  possible_buyers: [],
  completion_date: null,
};

productList.push(activeFavProduct);

const inactiveProducts = [
  {
    _id: new ObjectId(),
    name: "Stevens Hoodie",
    price: 500,
    date: new Date(
      `2023-${Math.floor(Math.random() * 10) + 1}-${
        Math.floor(Math.random() * 25) + 1
      }`
    ),
    description: "Stevens Hoodie - LIMITED EDITION",
    condition: "brand new",
    seller_id: "8C5bGSz1FRVbAQ47EDnDSvmKsqg2",
    buyer_id: null,
    image:
      "https://m.media-amazon.com/images/I/B1Wsm-8LxOS._CLa%7C2140%2C2000%7CB1nyqsQsIwL.png%7C0%2C0%2C2140%2C2000%2B0.0%2C0.0%2C2140.0%2C2000.0_AC_SX679_.png",
    category: "clothing",
    status: "inactive",
    possible_buyers: [],
    completion_date: null,
  },
  {
    _id: new ObjectId(),
    name: "Stevens Hoodie Red",
    price: 600,
    date: new Date(
      `2023-${Math.floor(Math.random() * 10) + 1}-${
        Math.floor(Math.random() * 25) + 1
      }`
    ),
    description: "Stevens Hoodie - LIMITED EDITION",
    condition: "brand new",
    seller_id: "8C5bGSz1FRVbAQ47EDnDSvmKsqg2",
    buyer_id: null,
    image:
      "https://cdn.spiritshop.com/DynamicImageHandler.ashx?width=1000&height=1000&did=76518&logo=null&pid=1386&cid=14273&view=1&ndz=1&tt=Stevens&bt=Ducks&cp1=%23181C33&cp2=%23EEEEEE&yt=2024&pset=4&tn=Your%20Name&tm=00&photo=0",
    category: "clothing",
    status: "inactive",
    possible_buyers: [],
    completion_date: null,
  },
];

inactiveProducts.map((inactiveProduct) => {
  productList.push(inactiveProduct);
});

const completedProducts = [
  {
    _id: new ObjectId("6584a667ff6d6e6b84730140"),
    name: "Earphone",
    price: 10,
    date: new Date(`2023-11-30`),
    description: "Beats earphone - real bargain",
    condition: "brand new",
    seller_id: "8C5bGSz1FRVbAQ47EDnDSvmKsqg2",
    buyer_id: "MakfosvJBSRugNO7tQbAPA8XsW82",
    image:
      "https://ss7.vzw.com/is/image/VerizonWireless/beats-studio-buds-true-wireless-noise-cancelling-earphones-white-mj4y3ll-a-a?wid=930&hei=930&fmt=webp",
    category: "electronics",
    status: "completed",
    possible_buyers: ["MakfosvJBSRugNO7tQbAPA8XsW82"],
    completion_date: new Date(`2023-11-31`),
  },
  {
    _id: new ObjectId("6584a667ff6d6e6b84730141"),
    name: "coffee machine",
    price: 30,
    date: new Date(`2023-11-11`),
    description: "second-hand coffee machine",
    condition: "functional",
    seller_id: "WiICBEajMHVeQPxxFrpYaMyyRIt1",
    buyer_id: "8C5bGSz1FRVbAQ47EDnDSvmKsqg2",
    image: "https://dam.delonghi.com/600x600/assets/215464",
    category: "electronics",
    status: "completed",
    possible_buyers: [
      "MakfosvJBSRugNO7tQbAPA8XsW82",
      "8C5bGSz1FRVbAQ47EDnDSvmKsqg2",
    ],
    completion_date: new Date(`2023-11-12`),
  },
];

completedProducts.map((completedProduct) => {
  productList.push(completedProduct);
});

// --------------------------------------------Post------------------------------------------------

const postDetails = {
  "Textbook for CS554": {
    d: "Hi, anyone has the textbook for course 554 Web Programming II?",
    c: "book",
  },
  Calculator: {
    d: "Need a calculator for my math exam! Thank you!",
    c: "electronics",
  },
  Pen: {
    d: "EMERGENCY!!!! I have a test this afternoon and really need a black pen!!!!",
    c: "stationary",
  },
  "Textbook for CS546": {
    d: "Hi, anyone has the textbook for course 546 Web Programming I?",
    c: "book",
  },
  Desk: {
    d: "Hi, I'm a freshmen, really need a desk for my room.",
    c: "furniture",
  },
  Chair: {
    d: "I have desks in my dorm, but no chairs...",
    c: "furniture",
  },
  Cellphone: {
    d: "OMG!!! I just lost my phone, anyone got an old phone!!!",
    c: "electronics",
  },
  PS5: {
    d: "To easy getting straight A's, need a PS5",
    c: "electronics",
  },
  "Windows Laptop": {
    d: "The app I want to use only works on Windows laptops, anyone got one?",
    c: "electronics",
  },
  "Textbook for CS561": {
    d: "Hi, anyone has the textbook for course 561 DBMS I?",
    c: "book",
  },
};
let postList = [];
for (let key in postDetails) {
  const details = postDetails[key];
  const randomBuyer = Math.floor(Math.random() * userIds.length);
  const randomSeller = Math.floor(Math.random() * userIds_2.length);

  const randomCondition = Math.floor(Math.random() * conditions.length);

  const activePost = {
    _id: new ObjectId(),
    buyer_id: userIds[randomBuyer],
    seller_id: null,
    item: key,
    category: details.c,
    price: Math.floor(Math.random() * 100),
    condition: conditions[randomCondition],
    date: new Date(
      `2023-${Math.floor(Math.random() * 10) + 1}-${
        Math.floor(Math.random() * 25) + 1
      }`
    ),
    description: details.d,
    status: "active",
    possible_sellers: userIds_2[randomSeller] ? [userIds_2[randomSeller]] : [],
    completion_date: null,
  };

  postList.push(activePost);
}

const activeFavPost = {
  _id: new ObjectId("6584b6619158ad1d1a74b89c"),
  buyer_id: "MakfosvJBSRugNO7tQbAPA8XsW82",
  seller_id: null,
  item: "Bottle water",
  category: "other",
  price: 0,
  condition: "brand new",
  date: new Date(`2023-12-20`),
  description: "for free",
  status: "active",
  possible_sellers: [],
  completion_date: null,
};

postList.push(activeFavPost);

const inactivePosts = [
  {
    _id: new ObjectId(),
    item: "Desk",
    price: 30,
    date: new Date(
      `2023-${Math.floor(Math.random() * 10) + 1}-${
        Math.floor(Math.random() * 25) + 1
      }`
    ),
    description: "I need a desk to place in my dorm",
    condition: "like new",
    seller_id: null,
    buyer_id: "8C5bGSz1FRVbAQ47EDnDSvmKsqg2",
    category: "furniture",
    status: "inactive",
    possible_sellers: [],
    completion_date: null,
  },
  {
    _id: new ObjectId(),
    item: "Camera",
    price: 100,
    date: new Date(
      `2023-${Math.floor(Math.random() * 10) + 1}-${
        Math.floor(Math.random() * 25) + 1
      }`
    ),
    description: "",
    condition: "gently used",
    seller_id: null,
    buyer_id: "8C5bGSz1FRVbAQ47EDnDSvmKsqg2",
    category: "electronics",
    status: "inactive",
    possible_sellers: [],
    completion_date: null,
  },
];

inactivePosts.map((inactivePost) => {
  postList.push(inactivePost);
});

const completedPosts = [
  {
    _id: new ObjectId("6584ad8e36f3bfc519a59f0f"),
    item: "Calculator",
    price: 10,
    date: new Date(`2023-11-20`),
    description: "I need a calculator for my Math test tomorrow",
    condition: "functional",
    seller_id: "MakfosvJBSRugNO7tQbAPA8XsW82",
    buyer_id: "8C5bGSz1FRVbAQ47EDnDSvmKsqg2",
    category: "electronics",
    status: "completed",
    possible_sellers: ["MakfosvJBSRugNO7tQbAPA8XsW82"],
    completion_date: new Date(`2023-11-21`),
  },
  {
    _id: new ObjectId("6584ad8e36f3bfc519a59f10"),
    item: "backpack",
    price: 30,
    date: new Date(`2023-11-12`),
    description: "Anything that can hold a laptap will do",
    condition: "functional",
    seller_id: "8C5bGSz1FRVbAQ47EDnDSvmKsqg2",
    buyer_id: "WiICBEajMHVeQPxxFrpYaMyyRIt1",
    category: "stationary",
    status: "completed",
    possible_sellers: [
      "MakfosvJBSRugNO7tQbAPA8XsW82",
      "8C5bGSz1FRVbAQ47EDnDSvmKsqg2",
    ],
    completion_date: new Date(`2023-11-30`),
  },
];

completedPosts.map((completedPost) => {
  postList.push(completedPost);
});

// --------------------------------------------Chat------------------------------------------------

const chatList = [
  {
    _id: new ObjectId(),
    participants: [
      "8C5bGSz1FRVbAQ47EDnDSvmKsqg2",
      "MakfosvJBSRugNO7tQbAPA8XsW82",
    ],
    messages: [
      {
        sender: "MakfosvJBSRugNO7tQbAPA8XsW82",
        date: new Date("2023-11-30T13:24:00"),
        message: "hi! I want this earphone!!",
      },
      {
        sender: "8C5bGSz1FRVbAQ47EDnDSvmKsqg2",
        date: new Date("2023-11-30T13:26:00"),
        message: "hi! Ok, I'm on my way to school. Can meet you at 5",
      },
      {
        sender: "MakfosvJBSRugNO7tQbAPA8XsW82",
        date: new Date("2023-11-30T13:30:00"),
        message: "np",
      },
    ],
  },
  {
    _id: new ObjectId(),
    participants: [
      "8C5bGSz1FRVbAQ47EDnDSvmKsqg2",
      "7SKDog0fjKOeS1jeuq32a9vYPue2",
    ],
    messages: [
      {
        sender: "7SKDog0fjKOeS1jeuq32a9vYPue2",
        date: new Date("2023-10-30T03:20:00"),
        message: "Just want to say hi. I'm boring",
      },
      {
        sender: "8C5bGSz1FRVbAQ47EDnDSvmKsqg2",
        date: new Date("2023-11-01T10:26:00"),
        message: "Go to bed early. for the sake of your health. Take care",
      },
    ],
  },
];

const main = async () => {
  const db = await dbConnection();
  await db.dropDatabase();
  const userCollection = await users();
  const productCollection = await products();
  const postCollection = await posts();
  const chatCollection = await chats();

  await userCollection.insertMany(userList);
  await productCollection.insertMany(productList);
  await postCollection.insertMany(postList);
  await chatCollection.insertMany(chatList);

  console.log("Done seeding database");
  await closeConnection();
};

main().catch(console.log);
