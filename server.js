#!/usr/bin/env nodejs
const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");

const app = express();
const server = require("http").Server(app);

//Code to set up handlebars
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  layoutsDir: path.join(__dirname, 'views/layouts')
}));

app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));
//Handlebars setup ends here

/*
//Logs all requests
app.use((request, response, next) => {
  console.log(request.headers)
  next()
});
*/

//Home page
app.get("/", (req, res) => {
  res.render('index', {
    name: "Johanna & Michael"
  })
});

//The game
app.get("/game", (req, res) => {
    res.sendFile(path.join(__dirname, "/public", "index.html"));
});

//Used to server all static pages, from the public folder
app.use(express.static(__dirname + "/public"));

//404 Page not found error handler
app.use(function(req, res, next) {
    res.status(404);
    res.render('404', {
        page: req.url
    })
});

server.listen(8000, function() {
  console.log(`Listening on ${server.address().port}`);
});
