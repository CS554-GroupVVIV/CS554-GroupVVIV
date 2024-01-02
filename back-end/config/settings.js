// export const mongoConfig = {
//   // serverUrl: "mongodb://localhost:27017/",
//   serverUrl: "mongodb://127.0.0.1",
//   database: "CS554-VVIV",
// };

const mongoURL =
  process.env.MONGO_URL ||
  "mongodb+srv://luoyifu25:JIKZw3kKi3u8Fvci@cluster0.6xrhizb.mongodb.net/?retryWrites=true&w=majority";

// /* This is docker container */
export const mongoConfig = {
  serverUrl: mongoURL,
  database: "CS554-VVIV",
};
