// When the "scrape new" button is clicked on
$(document).on("click", ".scrape-new", function () {
  $("#welcome").empty();

    // Empty the articles from the articles section
    $("#articles").empty();

    // Make an ajax call to scrape NPR
    $.ajax({
            method: "GET",
            url: "/scrape/"
        })
        .then(function (data) {
            $.getJSON("/articles", function (data) {
                // Loop through the articles backwards to display the newest 30 articles first
                for (var i = data.length - 1; i >= 0; i--) {
                    var emptyDiv = $("<div class=stuff'>")
                    var title = $("<h3" + "'class='title' ><a href='" + data[i].link +"'target='_blank'>" + data[i].title + "</a></h3>");
                    var summary = $("<p data-id='" + data[i]._id + "'>" + data[i].summary + "</p>")
                    
                    emptyDiv.append(title);
                    emptyDiv.append(summary);
                    
                    $("#articles").append(emptyDiv);
                }
            });
        })
})



// Whenever someone clicks a p tag
$(document).on("click", "p", function() {
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");
  
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the note information to the page
      .then(function(data) {
        console.log(data);
        // The title of the article
        $("#notes").append("<h6>" + data.title + "</h6>");
        // An input to enter a new title
        $("#notes").append("<input id='titleinput' name='title' placeholder='Your Name'>");
        // A textarea to add a new note body
        $("#notes").append("<textarea id='bodyinput' name='body' placeholder='Leave a note about the article here.'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        $("#notes").append("<button class='btn' data-id='" + data._id + "' id='savenote'>Save Note</button>");
  
        // If there's a note in the article
        if (data.note) {
          // Place the title of the note in the title input
          $("#titleinput").val(data.note.title);
          // Place the body of the note in the body textarea
          $("#bodyinput").val(data.note.body);
        }
      });
  });
  
  // When you click the savenote button
  $(document).on("click", "#savenote", function() {
    // Grab the id associated with the article from the submit button
    event.preventDefault();
    var thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });
  