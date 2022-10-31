const http = require("http");
const PORT = 8080;

// a function whcih handles request and sends response
const requestHandler = ( request, response ) => {  
  if (request.url === "/") {
    response.end("Welcome to the home page!");
  } else if (request.url === "/urls") {
    response.end("www.lighthouselabs.ca\nwww.google.com");
  } else {
    response.statusCode = 404;
    response.end("404 Page Not Found");
  }
};

// creates server
const server = http.createServer(requestHandler);
console.log("Server created");

// notify that the server is ready to listen
server.listen(PORT, () => {
  console.log(`Server listening on: http://localhost:${PORT}`);
});