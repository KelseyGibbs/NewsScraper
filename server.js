var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");


var PORT = process.env.PORT || 8080;

var app = express();

app.use(logger("dev"));

app.use(express.static("public"));

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");


app.get("/main", function(req, res) {
    res.render("index");
  });

app.listen(PORT, function () {
    console.log("Server listening on: http://localhost:" + PORT);
});