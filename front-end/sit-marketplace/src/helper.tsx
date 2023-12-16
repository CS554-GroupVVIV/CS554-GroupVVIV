// import { ObjectId } from "mongodb";

export const checkFirstNameAndLastName = (str: string, valStr: string) => {
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

export const checkEmail = (email: string) => {
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

export const dateObjectToHTMLDate = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const HTMLDateToDateObject = (date: string) => {
  return new Date(date);
}
