// When the "scrape new" button is clicked on
$(document).on("click", ".scrape-new", function () {

    // Empty the articles from the articles section
    $("#articles").empty();

    // Make an ajax call to scrape NPR
    $.ajax({
            method: "GET",
            url: "/scrape/"
        })
        .then(function (data) {
            $.getJSON("/articles", function (data) {
                // For each one
                for (var i = 0; i < data.length; i++) {
                    
                    // Display the information on the page
                    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
                }
            });
        })
})