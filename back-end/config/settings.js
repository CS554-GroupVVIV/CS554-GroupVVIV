/* This is localhost*/
export const mongoConfig = {
  // serverUrl: "mongodb://localhost:27017/",
  serverUrl: "mongodb://127.0.0.1",
  database: "CS554-VVIV",
};
const mongoDBUrl = process.env.MONGODB_URL || "mongodb://localhost:27017";


/* This is docker container */
// export const mongoConfig = {
//   serverUrl: mongoDBUrl,
//   database: "CS554-VVIV",
// };
