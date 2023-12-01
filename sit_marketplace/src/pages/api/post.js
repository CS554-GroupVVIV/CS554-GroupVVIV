import { posts } from "../../lib/mongoDB/mongoCollections";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const postCollection = await posts();
    const postList = await postCollection.find({}).toArray();

    return res.status(200).json(postList);
  }
}
