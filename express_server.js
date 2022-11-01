const express = require("express");
const app = express();
const PORT = 8080;

// after submitting the POST request, the data is sent as a buffer.
// This line is to read that data.
// if req.body is undefined, this line might be wrong.
app.use(express.urlencoded({ extended: true }));

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

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// a route for /urls
app.get("/urls", (req, res) => {
  const templateVars = {urls: urlDatabase };
  res.render("urls_index", templateVars);
});

// adds a new route(page) to submit long url 
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// using POST request to handle the "submit" button
app.post("/urls", (req, res) => {
  // log the POST request body to the console
  console.log(req.body);
  // response after a submit button
  res.send(generateRandomString())
});

// added a another route for /urls/:id; ":" tells that id is a route parameter
app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);
});

const generateRandomString  = () => {
  let randomString = "";
  for (let i = 0; i < 6; i++) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890"
    randomString += alphabet[Math.floor(Math.random() * alphabet.length)]
  }
  return randomString;
}

