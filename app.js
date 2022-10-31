const { response } = require("express");
const http = require("http");
const PORT = 8080;

// a function whcih handles request and sends response
const requestHandler = ( request, response ) => {
  console.log("In requestHandler");
  const responseText = `${request.url} ${request.method}`;
  
  switch (responseText) {
    case 'GET /':
      response.end("Welcome to the home page");
      break;
    case 'GET /urls':
      response.end(request.url)
      break;
    default:
      response.end(`${response.statusCode} Page Not Found`);
  }
};

// creates server
const server = http.createServer(requestHandler);
console.log("Server created");

// notify that the server is ready to listen
server.listen(PORT, () => {
  console.log(`Server listening on: http://localhost:${PORT}`);
});

console.log("Last line (after .listen call)");