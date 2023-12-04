const checkName = (str) => {
  if (str === undefined) throw new Error("Must provide a string");
  if (typeof str !== "string") throw new Error("Input must be a string");
  if (str.trim().length == 0) throw new Error("should not be just space");
  if (str.length < 1)
    throw new Error("The string should have at least 1 character.");
  //   let pattern = new RegExp("^[A-Za-z]+$");
  //   if (!pattern.test(str)) throw new Error("Name should only contain letters.");
  return str;
};

const checkId = (str) => {
  if (!str) throw new Error("Must provide an id");
  return str;
};

export { checkId, checkName };
