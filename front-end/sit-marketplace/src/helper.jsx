// import { ObjectId } from "mongodb";

export const checkFirstNameAndLastName = (str, valStr) => {
  if (str === undefined) throw new Error(`${valStr} must provide a string`);
  console.log(str);
  if (typeof str !== "string") throw new Error(`${valStr} must be a string`);
  if (str.trim().length == 0)
    throw new Error(`${valStr} should not be just space`);
  if (str.length < 1)
    throw new Error(`${valStr} should have at least 1 character.`);
  const pattern = new RegExp(/^(?=.{1,50}$)[a-z]+(?:['_.\s][a-z]+)*$/i);
  if (!pattern.test(str))
    throw new Error(`${valStr} should only contain letters.`);
  str = str.charAt(0).toUpperCase() + str.slice(1);
  return str;
};

export const checkEmail = (email) => {
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

export const checkRating = (rating) => {
  if (!rating || typeof rating !== "number") {
    throw "Rating not valid";
  }
  if (!Number.isInteger(rating)) {
    throw "Rating not valid";
  }
  if (rating < 1 || rating > 5) {
    throw "Rating not valid";
  }
  return rating;
};

export const dateObjectToHTMLDate = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const HTMLDateToDateObject = (date) => {
  return new Date(date);
};

export const checkPassword = (password) => {
  password = password.toString().trim();
  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{6,}$/.test(password))
    throw new Error(
      "At least one uppercase letter, one lowercase, one special symbol, one number and more than 6 characters"
    );
  return password;
};

export const checkName = (name) => {
  if (!name || name.trim() === "") {
    throw new Error("Name cannot be empty.");
  }
  name = name.trim();
  if (name.length < 1 || name.length > 20) {
    throw new Error("Name must be between 1 and 20 characters.");
  }
  const alphanumericRegex = /^[a-zA-Z0-9 ]+$/;
  if (!alphanumericRegex.test(name)) {
    throw new Error("Name must only contain alphanumeric characters.");
  }
  return name;
};

export const checkPrice = (price) => {
  if (!price || price.trim() === "") {
    throw new Error("Price cannot be empty.");
  }
  price = price.trim();
  const value = parseFloat(price);
  if (Number.isNaN(value)) {
    throw new Error("Price must be a valid number.");
  }
  if (value < 0 || value > 100000) {
    throw new Error("Price must be between 0 and 100000.");
  }
  return value;
};

export const checkString = (str) => {
  if (str === undefined) throw new Error("Must provide a string");
  if (typeof str !== "string") throw new Error("str must be a string");
  if (str.trim().length == 0) throw new Error("should not be just space");
  str = str.trim();
  return str;
};

export const checkStatus = (status) =>{
  status = checkString(status);
  if(status.toLowerCase() != "active" && status.toLowerCase() != "inactive" && status.toLowerCase() != "completed"){
    throw new Error("Invalid Status. It must be active, inactive or completed");
  }
  return status;
}

export const checkCondition = (condition) => {
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
  return condition;
};

export const checkDescription = (description) => {
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

export const checkCategory = (category) => {
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
  return category;
};