const express = require("express");
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080;

// after submitting the POST request, the data is sent as a buffer.
// This line is to read that data.
// if req.body is undefined, this line might be wrong.
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//tells the express app to use EJS as its templating engine
app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  user1RandomID: {
    id: "user1RandomID",
    email: "user@example.com",
    password: "123",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

app.get("/", (req, res) => {
  return res.send("Hello!");
});

// sends a message to conosle that server is running
app.listen(PORT, () => {
  return console.log(`Example app listening on port${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  return res.json(urlDatabase);
});

// a route for /urls
app.get("/urls", (req, res) => {
  const foundUserInfo = findUsersByID(req.cookies["user_id"]);
  // find the block of object
  const templateVars = {
    user: foundUserInfo,
    urls: urlDatabase
  };
  return res.render("urls_index", templateVars);
});

// adds a new route(page) to submit long url
app.get("/urls/new", (req, res) => {
  const foundUserInfo = findUsersByID(req.cookies["user_id"]);
  // find the block of object
  const templateVars = {
    user: foundUserInfo
  };
  if (!templateVars.user) {
    return res.redirect("/login");
    }
  return res.render("urls_new", templateVars);
});

// added a another route for /urls/:id; ":" tells that id is a route parameter
app.get("/urls/:id", (req, res) => {
  const foundUserInfo = findUsersByID(req.cookies["user_id"]);
  // find the block of object
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
    user: foundUserInfo,
    urls: urlDatabase
  };
  return res.render("urls_show", templateVars);
});

// redirects to the longURL page when clicked
app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id;
  const longURL = urlDatabase[shortURL];
  if (shortURL && longURL) {
    return res.redirect(longURL);
  }
  return res.end(`The ${shortURL} does not exist`);
});

// register route
app.get("/register", (req, res) => {
  const templateVars = {
    user: req.cookies["user_id"]
  };
    // if the user is logged in, go to /urls otherwise to /register
  if (templateVars.user) {
    return res.redirect("/urls");
    }    
  return res.render("register", templateVars);
});

// a login route
app.get("/login", (req, res) => {
  const templateVars = {
    user: req.cookies["user_id"]
  };
  // if the user is logged in, go to /urls otherwise to /login
  if (templateVars.user) {
    return res.redirect("/urls");
    }    
  return res.render("login_page", templateVars);
});

// signs in using a cookie
app.post("/login", (req, res) => {
  const foundUser = findUsers(req.body.email);
  const inputUserPass = req.body.inputPassword;
  // if user and password is in database, reutrn url otherwise, error
  if (foundUser && foundUser.password === inputUserPass) {
    const userID = foundUser.id;
    res.cookie('user_id', userID);
    return res.redirect("/urls");
  }
  return res.end('<html><head><title>403: Forbidden</title></head><body><h1>403: Forbidden</h1></body></html>');
});

// using POST request to handle the "submit" button
app.post("/urls", (req, res) => {
  console.log("this:",req.cookies["user_id"])
  if (!req.cookies["user_id"]) {
    return res.end('You cannot create new shortened URL if you are not logged in.');
  }   

  // response after a submit button
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  return res.redirect(`/urls/${shortURL}`);
});

// edits the short URL using POST
app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  urlDatabase[id] = req.body.longURL;
  return res.redirect(`/urls/${id}`);
});

// deletes the URL using POST
app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  delete urlDatabase[id];
  return res.redirect("/urls");
});

// logout request
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  return res.redirect("/login");
});
/////////////////////////////////////
// app.post("/login", (req, res) => {
//   const foundUser = findUsers(req.body.email);
//   const inputUserPass = req.body.inputPassword;
//   if (foundUser && foundUser.password === inputUserPass) {
//     const userID = foundUser.id;
//     res.cookie('user_id', userID);
//     return res.redirect("/urls");
//   }
//   return res.end('<html><head><title>403: Forbidden</title></head><body><h1>403: Forbidden</h1></body></html>');
// });

app.post("/register", (req, res) => {
  const randomUserID = generateRandomString();
  const newUserEmail = req.body.newUserEmail;
  const newUserPassword = req.body.inputPassword;
  const newUserInfo = {
    id: randomUserID,
    email: newUserEmail,
    password: newUserPassword
  };
  getUserByEmail(newUserInfo, res);

  if (!findUsers(newUserEmail)) {
    users[randomUserID] = newUserInfo;
  }
  res.cookie('user_id', randomUserID);
  return res.redirect("/urls");
});

const generateRandomString = () => {
  let randomString = "";
  for (let i = 0; i < 6; i++) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
    randomString += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return randomString;
};

const findUsers = (newUserEmail) => {
  for (const [key, value] of Object.entries(users)) {
    const usersToCheck = value["email"];
    if (usersToCheck === newUserEmail) {
      return value;
    }
  }
  return;
};

const findUsersByID = (userID) => {
  return users[userID];
};

const getUserByEmail = (inputInfo, res) => {
  if (!inputInfo.email || !inputInfo.password || findUsers(inputInfo.email)) {
    return res.end('<html><head><title>403: Forbidden</title></head><body><h1>403: Forbidden</h1></body></html>');
  }
  return;
};

