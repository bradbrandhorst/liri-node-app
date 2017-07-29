//variables for reuquired packages and files
var keys = require("./keys.js");
var reqTwitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require("request");
var fs = require("fs");

//variables for command method and title to search
var input = process.argv[2];
var title = process.argv.slice(3);

//variable to authenticate twitter API
var authTwitter = new reqTwitter(keys);

//variable for twitter API paramaters 
var parameters = {
    q: 'BradBrandhorst',
    count: 20
};

//variable for my Spotify keys 
var spotify = new Spotify({
    id: "63e1ead9243d487c859c14c659350e72",
    secret: "5fa22bf42c544e59bd522e6868d78d52"
});

//twitter 
if (input === "my-tweets") {
    authTwitter.get('search/tweets', parameters, gotData);

    function gotData(err, data, response) {
        var tweets = data.statuses;
        for (var i = 0; i < tweets.length; i++) {
            console.log(tweets[i].text);
            console.log(tweets[i].created_at);
            console.log("---------------");
        }
    }
}

//Spotify
else if (input === "spotify-this-song") {
    
    //no idea why the console logging here doesn't work. Also tough to grab "The Sign" with the npm spotify search since it's not too robust..
    if (title === undefined) {
        console.log("No song entered! Here's some Ace of Base!");
    

    } else {
		
        spotify.search({
            type: 'track',
            query: title
        }, function(err, data) {
            if (err) {
                return console.log('An error occurred! ' + err);
            }
            console.log("Artist Name: " + data.tracks.items[0].album.artists[0].name);
            console.log("Song Title: " + data.tracks.items[0].name);
            console.log("Song Preview Link: " + data.tracks.items[0].preview_url);
            console.log("Album: " + data.tracks.items[0].album.name);
        });
    }
}

//omdb
else if (input === "movie-this") {
    if (title === undefined) {
		
            request("http://www.omdbapi.com/?t=Mr+Nobody&y=&plot=short&apikey=40e9cece", function(error, response, body) {
			
                if (!error && response.statusCode === 200) {
				console.log("Title: " + JSON.parse(body).Title);
                console.log("Year: " + JSON.parse(body).Year);
                console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
                console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
                console.log("Country: " + JSON.parse(body).Country);
                console.log("Language: " + JSON.parse(body).Language);
                console.log("Plot: " + JSON.parse(body).Plot);
                console.log("Actors: " + JSON.parse(body).Actors);
            }
        });
    } else {
        request("http://www.omdbapi.com/?t=" + title + "&y=&plot=short&apikey=40e9cece", function(error, response, body) {
			
            if (!error && response.statusCode === 200) {
			console.log("Title: " + JSON.parse(body).Title);
            console.log("Year: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
            console.log("Country: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
            console.log("OMDB");
            };
        })
    }
}

//do what it says txt
else if (input === "do-what-it-says") {
	fs.readFile("random.txt", "utf8", function(err, data) {
        if (err) {
            return console.log(err);
        }
        var output = data.split(",");
        title = (output[0]);
        var song = (output[1]);
        console.log(title);
        console.log(song);
		
        spotify.search({
            type: 'track',
            query: song
        }, function(err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
			
			console.log("Artist Name: " + data.tracks.items[0].album.artists[0].name);
            console.log("Song Title: " + data.tracks.items[0].name);
            console.log("Song Preview Link: " + data.tracks.items[0].preview_url);
            console.log("Album: " + data.tracks.items[0].album.name);
        });
    })
} else {
	
	//if the user doesn't enter a command or if they misspell, let them know what the valid commands are.
    console.log("Not a valid request. Please request using:\"my-tweets\", \"spotify-this-song\", \"movie-this\" or \"do-what-it-says\" ");
}