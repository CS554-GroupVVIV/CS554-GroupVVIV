import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import moment, { Moment } from "moment";
import { posts } from "../../lib/mongoDB/mongoCollections";

const helper = {
  checkUserId(input: string | undefined): string | null {
    if (!input || input.trim() == "") {
      return null;
    }
    input = input.trim();
    // check user Id
    return input;
  },

  checkItem(input: string | undefined): string | null {
    if (!input || input.trim() == "") {
      return null;
    }
    input = input.trim();
    if (input.length < 0 || input.length > 20) {
      return null;
    }
    const alphanumericRegex = /^[a-zA-Z0-9 ]+$/;
    if (!alphanumericRegex.test(input)) {
      return null;
    }
    return input;
  },

  checkQuantity(input: number | undefined): number | null {
    if (!input) {
      return null;
    }
    input = Math.round(input);
    if (input < 1 || input > 999) {
      return null;
    }
    return input;
  },

  checkPrice(input: number | undefined): number | null {
    if (!input) {
      return null;
    }
    input = parseFloat(input.toFixed(2));
    if (input < 0 || input > 100000) {
      return null;
    }
    return input;
  },

  checkCondition(input: string | undefined): string | null {
    if (!input || input.trim() == "") {
      return null;
    }
    input = input.trim();
    let conditionLower: string = input.toLowerCase();
    if (conditionLower == "brand new") {
      return "Brand New";
    }
    if (conditionLower == "like new") {
      return "Like New";
    }
    if (conditionLower == "gently used") {
      return "Gently Used";
    }
    if (conditionLower == "functional") {
      return "Functional";
    }

    return null;
  },

  checkDate(input: string | undefined): string | null {
    if (!input || input.trim() == "") {
      return null;
    }
    input = input.trim();
    let dateFormatted: Moment = moment(input, "YYYY-MM-DD");
    if (!dateFormatted.isValid()) {
      return null;
    }
    let today: object = moment().startOf("day");
    if (dateFormatted < today) {
      return null;
    }
    return input;
  },

  checkAddition(input: string | undefined): string | null {
    if (input && input.trim() != "") {
      input = input.trim();
      if (input.length > 100) {
        return null;
      } else {
        return input;
      }
    }
    return "";
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const postCollection = await posts();
    const postList = await postCollection.find({}).toArray();
    return res.status(200).json(postList);
  }
  if (req.method == "POST") {
    let newItem = req.body.item;
    let userId: string | null = helper.checkUserId(newItem.userId);
    let item: string | null = helper.checkItem(newItem.item);
    let quantity: number | null = helper.checkQuantity(newItem.quantity);
    let price: number | null = helper.checkPrice(newItem.price);
    let condition: string | null = helper.checkCondition(newItem.condition);
    let beforeDate: string | null = helper.checkDate(newItem.beforeDate);
    let addition: string | null = helper.checkAddition(newItem.addition);

    console.log(userId, item, quantity, price, condition, beforeDate, addition);
    if (
      userId &&
      item &&
      quantity &&
      price &&
      condition &&
      beforeDate &&
      addition != null
    ) {
      console.log("pass");
      newItem = {
        _id: new ObjectId(),
        userId: userId,
        item: item,
        quantity: quantity,
        price: price,
        condition: condition,
        beforeDate: beforeDate,
        addition: addition,
        status: "Active",
      };
      const postCollection = await posts();
      const insert = await postCollection.insertOne(newItem);
      if (insert.acknowledged != true) {
        return res.status(500).json("Insertion failed");
      }
      return res.status(200).json("success");
    } else {
      return res.status(400).json("Invalid input");
    }
  }
}
