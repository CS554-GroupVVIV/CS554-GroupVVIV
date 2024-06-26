import { ObjectId } from "mongodb";
import moment from "moment";

// const checkName = (str) => {
//   if (str === undefined) throw new Error("Must provide a string");
//   if (typeof str !== "string") throw new Error("str must be a string");
//   if (str.trim().length == 0) throw new Error("should not be just space");
//   str = str.trim();
//   // if (str.length < 1)
//   //   throw new Error("The string should have at least 1 character.");
//   //   let pattern = new RegExp("^[A-Za-z]+$");
//   //   if (!pattern.test(str)) throw new Error("Name should only contain letters.");
//   return str;
// };

const checkString = (str) => {
  if (str === undefined) throw new Error("Must provide a string");
  if (typeof str !== "string") throw new Error("str must be a string");
  if (str.trim().length == 0) throw new Error("should not be just space");
  // if (str.length < 1)
  //   throw new Error("The string should have at least 1 character.");
  str = str.trim();
  return str;
};

const checkId = (str) => {
  if (!str) throw new Error("Must provide an id");
  if (typeof str !== "string") throw new Error("Id must be a string");
  str = str.trim();
  if (!ObjectId.isValid(str)) throw new Error("Invalid id");
  return str;
};

const checkName = (str) => {
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

const checkCategory = (category) => {
  if (!category || category.trim() == "") {
    throw new Error("Must provide a category");
  }
  category = category.trim();
  let categoryLower = category.toLowerCase();
  if (
    categoryLower != "book" &&
    categoryLower != "other" &&
    categoryLower != "electronics" &&
    categoryLower != "clothing" &&
    categoryLower != "furniture" &&
    categoryLower != "stationary"
  ) {
    throw new Error("Invalid Category");
  }

  return categoryLower;
};

function capitalizeFirstLetter(string) {
  if (string && string.length > 1) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  } else if (string && string.length === 1) {
    return string.toUpperCase();
  } else {
    return string;
  }
}

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

const checkPriceMinMax = (min, max) => {
  checkPrice(min);
  checkPrice(max);
  if (min < 0 || max < 0)
    throw new Error("Values must be greater than or equal to 0");
  if (max <= min) throw new Error("Max must be greater than min");
  return min, max;
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
    throw new Error("Invalid Condition");
  }
  return conditionLower;
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

// const checkDate = (date) => {
//   if (!date || date.trim() == "") {
//     throw new Error("Must provide a date");
//   }
//   date = date.trim();
//   console.log("date", date);
//   if (!moment(date).isValid()) {
//     throw new Error("Invalid Date");
//   }
//   return date;
// };

const checkUrl = (url) => {
  if (!url) throw new Error("You must provide a URL to search for");
  if (typeof url !== "string") throw new Error("URL must be a string");
  if (url.trim().length === 0)
    throw new Error("URL cannot be an empty string or just spaces");
  url = url.trim();
  // const regex = new RegExp(
  //   /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/
  // );
  // if (!regex.test(url)) throw new Error("You must provide a valid URL");

  return url;
};

const checkEmail = (email) => {
  const regex = new RegExp(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(stevens.edu)$/i
  );
  email = email.trim().toLowerCase();
  if (!email) throw new Error("You must provide a user email to search for");
  if (typeof email !== "string") throw new Error("User email must be a string");
  if (email.length === 0)
    throw new Error("User email cannot be an empty string or just spaces");
  if (!regex.test(email))
    throw new Error(`You must provide a valid Stevens' email address`);
  return email;
};

// export const checkUserAndChatId = (id) => {
//   if (!id) throw "You must provide an id to search for";
//   if (typeof id !== "string" && typeof id !== "object")
//     throw "Id must be a string or ObjectId";
//   id = id.trim();
//   if (id.length === 0) throw "id cannot be an empty string or just spaces";
//   return id;
// };

const checkFirstNameAndLastName = (str, valStr) => {
  if (str === undefined) throw new Error(`${valStr} must provide a string`);
  if (typeof str !== "string") throw new Error(`${valStr} must be a string`);
  str = str.trim();
  if (str.length === 0) throw new Error(`${valStr} should not be just space`);
  if (str.length < 1)
    throw new Error(`${valStr} should have at least 1 character.`);
  let pattern = new RegExp(/^(?=.{1,50}$)[a-z]+(?:['_.\s][a-z]+)*$/i);
  if (!pattern.test(str))
    throw new Error(`${valStr} should only contain letters.`);
  str = str.charAt(0).toUpperCase() + str.slice(1);
  return str;
};

const capitalizeName = (name) => {
  name = checkString(name);
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}; // reference from stackoverflow

// const checkNotEmpty = (str) => {
//   if (!str | (str.trim() === "")) {
//     throw "Input is empty";
//   }
//   return str;
// };

const checkRating = (rating) => {
  if (!rating || typeof rating !== "number") {
    throw new Error("Rating not valid");
  }
  if (!Number.isInteger(rating)) {
    throw new Error("Rating not valid");
  }
  if (rating < 1 || rating > 5) {
    throw new Error("Rating not valid");
  }
  return rating;
};

const dateObjectToHTMLDate = (date) => {
  // date is a Date() object
  if (!date || !(date instanceof Date)) {
    throw new Error("Invalid Date Format");
  }
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const checkStatus = (status) => {
  status = checkString(status);
  if (
    status.toLowerCase() != "active" &&
    status.toLowerCase() != "inactive" &&
    status.toLowerCase() != "pending" &&
    status.toLowerCase() != "completed"
  ) {
    throw new Error("Invalid Status");
  }
  return status;
};

// const HTMLDateToDateObject = (date) => {
//   date = checkString(date);
//   return new Date(date);
// };

export {
  checkString,
  checkId,
  checkName,
  // checkItem,
  checkCategory,
  checkPrice,
  checkPriceMinMax,
  checkCondition,
  checkDescription,
  // checkDate,
  // checkNotEmpty,
  checkRating,
  checkUrl,
  checkEmail,
  checkFirstNameAndLastName,
  capitalizeName,
  dateObjectToHTMLDate,
  checkStatus,

  // HTMLDateToDateObject,
};
