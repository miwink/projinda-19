var http = require("http");
var fs = require("fs");

function onRequest(req, res) {
  console.log("A user made a request" + req.url);
  if (req.method == "GET" && req.url == "/") {
    res.writeHead(200, { "content-type": "text/html" });
    fs.createReadStream("./index.html").pipe(res);
  } else {
    send404Response(res);
  }
}

function send404Response(res) {
  res.writeHead(404, { "content-type": "text/plain" });
  res.write("Error 404, Page not found");
  res.end();
}

http.createServer(onRequest).listen(8000);
console.log("Server is running on a port over 8000");
