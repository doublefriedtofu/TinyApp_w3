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
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

// sends a message to conosle that server is running
app.listen(PORT, () => {
  console.log(`Example app listening on port${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// a route for /urls
app.get("/urls", (req, res) => {
  const foundUserInfo = findUsers(req.cookies["user"]);
  // find the block of object
  const templateVars = {
    user: foundUserInfo,
    urls: urlDatabase
  };
  res.render("urls_index", templateVars);
});

// adds a new route(page) to submit long url
app.get("/urls/new", (req, res) => {
  const foundUserInfo = findUsers(req.cookies["user"]);
  // find the block of object
  const templateVars = {
    user: foundUserInfo
  };
  res.render("urls_new", templateVars);
});

// added a another route for /urls/:id; ":" tells that id is a route parameter
app.get("/urls/:id", (req, res) => {
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
    user: req.cookies["username"]
  };
  res.render("urls_show", templateVars);
});

// redirects to the longURL page when clicked
app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

// register route
app.get("/register", (req, res) => {
  const templateVars = {
    user: req.cookies["username"]
  };
  res.render("register", templateVars);
});

// a login route
app.get("/login", (req, res) => {
  const templateVars = {
    user: req.cookies["username"]
  };  res.render("login_page", templateVars)
})

// signs in using a cookie
app.post("/login", (req, res) => {
  res.cookie('user', req.body.email);
  res.redirect("/urls");
});

// using POST request to handle the "submit" button
app.post("/urls", (req, res) => {
  // log the POST request body to the console
  console.log(req.body);
  // response after a submit button
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});

// edits the short URL using POST
app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  urlDatabase[id] = req.body.longURL;
  res.redirect(`/urls/${id}`);
});

// deletes the URL using POST
app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  delete urlDatabase[id];
  res.redirect("/urls");
});

// logout request
app.post("/logout", (req, res) => {
  res.clearCookie("user");
  res.redirect("/urls");
});

app.post("/register", (req, res) => {
  const randomUserID = generateRandomString();
  const newUserEmail = req.body.newUserEmail;
  const newUserPassword = req.body.inputPassword;
  const newUserInfo = {
    id: randomUserID,
    email: newUserEmail,
    password: newUserPassword
  };
  getUserByEmail(newUserInfo, res)

  if (!findUsers(newUserEmail)) {
    users.randomUserID = newUserInfo;
  }
  res.cookie('randomUserID', randomUserID);
  res.redirect("/urls");
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

const getUserByEmail = (inputInfo, res) => {
  if (!inputInfo.email || !inputInfo.password) {
  return res.end('<html><head><title>404: Page Not Found</title></head><body><h1>404: Page Not Found</h1></body></html>');
  }
  if (findUsers(inputInfo.email)) {
  return res.end('<html><head><title>404: Page Not Found</title></head><body><h1>404: Page Not Found</h1></body></html>');
  }
}