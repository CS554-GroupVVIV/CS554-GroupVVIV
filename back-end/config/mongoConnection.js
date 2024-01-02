import { MongoClient, ServerApiVersion } from "mongodb";
import { mongoConfig } from "./settings.js";

let _connection = undefined;
let _db = undefined;

const client = new MongoClient(mongoConfig.serverUrl, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const dbConnection = async () => {
  if (!_connection) {
    // _connection = await MongoClient.connect(mongoConfig.serverUrl);
    _connection = await client.connect();
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
    _db = _connection.db(mongoConfig.database);
  }
  return _db;
};
const closeConnection = async () => {
  await _connection.close();
};

export { dbConnection, closeConnection };
