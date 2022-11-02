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

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// a route for /urls
app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase, 
    username: req.cookies["username"]
  };
  res.render("urls_index", templateVars);
});

// adds a new route(page) to submit long url
app.get("/urls/new", (req, res) => {
  const templateVars = {
    username: req.cookies["username"]
  };
  res.render("urls_new", templateVars);
});

// cookie
app.post("/login", (req, res) => {
  res.cookie('username', req.body.username)
  res.redirect("/urls");
})

// using POST request to handle the "submit" button
app.post("/urls", (req, res) => {
  // log the POST request body to the console
  console.log(req.body);
  // response after a submit button
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});

// added a another route for /urls/:id; ":" tells that id is a route parameter
app.get("/urls/:id", (req, res) => {
  const templateVars = { 
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
    username: req.cookies["username"]
    };
  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

// edits the short URL using POST
app.post("/urls/:id", (req, res) =>{
  const id = req.params.id;
  urlDatabase[id] = req.body.longURL;
  res.redirect(`/urls/${id}`);
});

// deletes the URL using POST
app.post("/urls/:id/delete", (req, res) =>{
  const id = req.params.id;
  delete urlDatabase[id];
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("username", req.body.username)
  res.redirect("/urls")
})

const generateRandomString  = () => {
  let randomString = "";
  for (let i = 0; i < 6; i++) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
    randomString += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return randomString;
};

