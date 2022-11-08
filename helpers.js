
const generateRandomString = () => {
  let randomString = "";
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const numbers = "1234567890";
  const alphaNumbers = alphabet + numbers;
  randomString += alphabet[Math.floor(Math.random() * alphabet.length)];
  for (let i = 0; i < 5; i++) {
    randomString += alphaNumbers[Math.floor(Math.random() * alphaNumbers.length)];
  }
  return randomString;
};

const getUserByEmail = (inputEmail, database) => {
  for (const [key, value] of Object.entries(database)) {
    const usersToCheck = value["email"];
    if (usersToCheck === inputEmail) {
      return value;
    }
  }
  return false;
};

const findUsersByID = (userData, userID) => {
  return userData[userID];
};

const urlsForUser = (urlData,userID) => {
  const filteredURL = {};
  for (const shortURL in urlData) {
    if (urlData[shortURL]["userID"] === userID) {
      filteredURL[shortURL] = urlData[shortURL];
    }
  }
  return filteredURL;
};

const equalShortURL = (urlData, shortURL) => {
  for (const shortURLs in urlData) {
    if (urlData[shortURLs] === shortURL) {
      return true;
    }
  }
  return false;
};


module.exports = { getUserByEmail, findUsersByID, urlsForUser, equalShortURL, generateRandomString }