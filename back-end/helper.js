import { ObjectId } from "mongodb";
import moment from "moment";

const checkName = (str) => {
  if (str === undefined) throw new Error("Must provide a string");
  if (typeof str !== "string") throw new Error("str must be a string");
  if (str.trim().length == 0) throw new Error("should not be just space");
  if (str.length < 1)
    throw new Error("The string should have at least 1 character.");
  //   let pattern = new RegExp("^[A-Za-z]+$");
  //   if (!pattern.test(str)) throw new Error("Name should only contain letters.");
  return str;
};

const checkId = (str) => {
  if (!str) throw new Error("Must provide an id");
  if (typeof str !== "string") throw new Error("Id must be a string");
  if (!ObjectId.isValid(str)) throw new Error("Invalid id");
  return str;
};

const checkItem = (str) => {
  if (!str || str.trim() == "") {
    throw new Error("Must provide an item name");
  }
  str = str.trim();
  if (str.length < 0 || str.length > 20) {
    throw new Error("Item name should be within range of 1-20 characters");
  }
  const alphanumericRegex = /^[a-zA-Z0-9 ]+$/;
  if (!alphanumericRegex.test(str)) {
    throw new Error("Item name should only contain number and letters");
  }
  return str;
};

const checkCategory = (str) => {
  if (!str || str.trim() == "") {
    throw new Error("Must provide a category");
  }
  str = str.trim();
  return str;
};

const checkPrice = (price) => {
  if (!price) {
    throw new Error("Must provide a price");
  }
  if (typeof price !== "number") {
    throw new Error("Price should be a number");
  }
  price = parseFloat(price.toFixed(2));

  if (price < 0 || price > 100000) {
    throw new Error("Price should be in range from 0 to 100000");
  }
  return price;
};

const checkCondition = (condition) => {
  if (!condition || condition.trim() == "") {
    throw new Error("Must provide a condition");
  }
  condition = condition.trim();
  let conditionLower = condition.toLowerCase();
  if (
    conditionLower != "brand new" &&
    conditionLower != "like new" &&
    conditionLower != "gently used" &&
    conditionLower != "functional"
  ) {
    throw new Error("Invalid Category");
  }
  return condition;
};

const checkDescription = (description) => {
  if (description && description.trim() != "") {
    description = description.trim();
    if (description.length > 100) {
      throw new Error("Description should have length of 100 at most");
    } else {
      return description;
    }
  } else {
    return "";
  }
};

const checkDate = (date) => {
  if (!date || date.trim() == "") {
    throw new Error("Must provide a date");
  }
  date = date.trim();
  console.log("date", date);
  if (!moment(date).isValid()) {
    throw new Error("Invalid Date");
  }
  return date;
};

export const checkUrl = (url) => {
  if (!url) throw new Error("You must provide a URL to search for");
  if (typeof url !== "string") throw new Error("URL must be a string");
  if (url.trim().length === 0)
    throw new Error("URL cannot be an empty string or just spaces");

  const regex = new RegExp(
    /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/
  );
  if (!regex.test(url))
    throw new Error("You must provide a valid URL");

  return url;
};

export const checkEmail = (email) => {
  const regex = new RegExp(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(stevens.edu)$/i
  );
  email = email.trim().toLowerCase();
  if (!email) throw "You must provide a user email to search for";
  if (typeof email !== "string") throw "User email must be a string";
  if (email.length === 0)
    throw "User email cannot be an empty string or just spaces";
  if (!regex.test(email))
    throw `You must provide a valid Stevens' email address`;
  return email;
};

export const checkUserAndChatId = (id) => {
  if (!id) throw "You must provide an id to search for";
  if (typeof id !== "string" && typeof id !== "object")
    throw "Id must be a string or ObjectId";
  if (id.trim().length === 0)
    throw "id cannot be an empty string or just spaces";
  return id.trim();
};

export const checkFirstNameAndLastName = (str, valStr) => {
  if (str === undefined) throw new Error(`${valStr} must provide a string`);
  console.log(str);
  if (typeof str !== "string") throw new Error(`${valStr} must be a string`);
  if (str.trim().length == 0)
    throw new Error(`${valStr} should not be just space`);
  if (str.length < 1)
    throw new Error(`${valStr} should have at least 1 character.`);
  let pattern = new RegExp(/^(?=.{1,50}$)[a-z]+(?:['_.\s][a-z]+)*$/i);
  if (!pattern.test(str))
    throw new Error(`${valStr} should only contain letters.`);
  str = str.charAt(0).toUpperCase() + str.slice(1);
  return str;
};

export const capitalizeName = (name) => {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}; // reference from stackoverflow

export {
  checkId,
  checkName,
  checkItem,
  checkCategory,
  checkPrice,
  checkCondition,
  checkDescription,
  checkDate,
};
