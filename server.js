// Required NPM dependicies
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");


var PORT = process.env.PORT || 8080;

// Initalize Express
var app = express();

// Use morgan for loggin requests
app.use(logger("dev"));

// Make the public folder static
app.use(express.static("public"));

// Parse request body as JSON
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

// Initalize Handlebars
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");


app.get("/", function(req, res) {
    res.render("index", { });
  });

  var db = require("./models");
//   Connect to the Mongo DB

// mongoose.connect("mongodb://localhost/newsScraperrrrr", { useNewUrlParser: true });



var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadliners66";

mongoose.connect(MONGODB_URI,{ useNewUrlParser: true });
// mongoose.connect(config.DB,{ useNewUrlParser: true }));



// Routes

// A GET route for scraping NPRs website
app.get("/scrape", function(req, res) {

    // Grab the body of the html with axios
    axios.get("https://www.npr.org/sections/news/").then(function(response) {

      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
  
      // Now, we grab every div iwth an item-info class, and do the following:
      $("div.item-info").each(function(i, element) {
    
        var result = {};
        
        result.summary = $(element).children("p.teaser").children("a").text();
        console.log(result.summary);
        
        result.title = $(this)
        .children("h2.title")
        .children("a")
        .text();
        result.link = $(this)
        .children("h2.title")
        .children("a")
        .attr("href");
        result.summary = $(this)
        .children("p.teaser")
        .children("a")
        .text();

        console.log(result.title);
        console.log(result.link);
        console.log(result.summary);

        // // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function(dbArticle) {
            //   Console log it in the console becuase YAY
            console.log(dbArticle);
          })
          .catch(function(err) {
            // If an error occurred, log it
            console.log(err);
          });
      });
  
      // Send a message to the client that they done scraped
      res.send("Scrape Complete");
    });
  });
  
  // Route for getting all Articles from the db
  app.get("/articles", function(req, res) {
    
    db.Article.find({})
      .then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  
  // Route for grabbing a specific Article by id
  app.get("/articles/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
      .then(function(dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  
  
  // Start the server
  app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
  
