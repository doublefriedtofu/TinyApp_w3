const getUserByEmail = (inputEmail, database) => {
  for (const [key, value] of Object.entries(database)) {
    const usersToCheck = value["email"];
    if (usersToCheck === inputEmail) {
      return value;
    }
  }
  return false;
};

module.exports = { getUserByEmail }