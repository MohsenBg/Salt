const sha256 = require("sha256");
const words = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  0,
  "q",
  "w",
  "e",
  "r",
  "t",
  "y",
  "u",
  "i",
  "u",
  "o",
  "p",
  "{",
  "}",
  "[",
  "]",
  "a",
  "s",
  "d",
  "f",
  "g",
  "h",
  "j",
  "k",
  "l",
  ";",
  '"',
  "'",
  "z",
  "x",
  "c",
  "v",
  "b",
  "n",
  "m",
  ",",
  "/",
  "!",
  "@",
  "$",
  "%",
  "^",
  "&",
  "*",
  "(",
  ")",
  "_",
  "+",
  "=",
  "-",
];
const charCode = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  0,
  "q",
  "w",
  "e",
  "r",
  "t",
  "y",
  "u",
  "i",
  "u",
  "o",
  "p",
  "a",
  "s",
  "d",
  "f",
  "g",
  "h",
  "j",
  "k",
  "l",
  "z",
  "x",
  "c",
  "v",
  "b",
  "n",
  "m",
];

const MakeSalt = () => {
  let salt: string = "";
  for (let i = 0; i <= 30; i++) {
    let RandomIndex = Math.floor(Math.random() * words.length);
    salt += words[RandomIndex];
  }
  return salt;
};

const MakeCode = () => {
  let code = "";
  for (let i = 0; i <= 50; i++) {
    let RandomIndex = Math.floor(Math.random() * charCode.length);
    code += charCode[RandomIndex];
  }
  return sha256(code);
};

const convertPasswordToHash = (password: string, salt: string) => {
  let passwordWithSlat = "";
  for (let i = 0; i < password.length; i++) {
    if (i <= 5) {
      passwordWithSlat += password[i] + salt.substring(i, (i + 1) * 5);
    } else {
      passwordWithSlat += password[i];
    }
  }

  let hash = sha256(passwordWithSlat);
  return {
    salt,
    hash,
  };
};

module.exports = { convertPasswordToHash, MakeSalt, MakeCode };
