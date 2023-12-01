import { items } from "../../lib/mongoDB/mongoCollections";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const itemCollection = await items();
    const itemList = await itemCollection.find({}).toArray();

    return res.status(200).json(itemList);
  }
}
