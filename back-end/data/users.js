import { users } from "../config/mongoCollections.js";
import * as validation from "../validation/userValidtaion.js";

export const createUser = async (uid, email, firstName, lastName) => {
  const userCollection = await users();
  email = validation.validateEmail(email);
  let usernameDuplication = await userCollection.findOne({
    email: email,
  });
  if (usernameDuplication !== null) throw "Username already exists";
  const newUser = {
    _id: uid,
    email,
    firstName,
    lastName,
  };
  const newInsertInformation = await userCollection.insertOne(newUser);
  if (newInsertInformation.acknowledged != true) throw "Insert failed!";
  return await getUserById(newInsertInformation.insertedId);
};
