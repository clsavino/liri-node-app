//Set default messages
var movieDefaultMsg = "\nYou forgot to enter a movie. Let me suggest 'Mr. Nobody.' \nCheck it out at IMDB: http://www.imdb.com/title/tt0485947/ It's on Netflix too!";
var songDefaultMsg = 'Since no song title was supplied, let me tell you about "The Sign" by Ace of Base.';

// Store all of the arguments in an array 
var nodeArgs = process.argv;
var apiChoice = process.argv[2];
var fs = require('fs');

//console.log(nodeArgs);
	fs.appendFile('log.txt',(nodeArgs).join(' '));

// Determines the input to switch on
switch (apiChoice) {
	case "my-tweets":
		twitter();
		break;

	case "spotify-this-song":
		if (!nodeArgs[3]) {
			//set default to "The Sign" if no song entered
			var song = 'The Sign';
			console.log(songDefaultMsg);
			fs.appendFile('log.txt',songDefaultMsg);
		} else {
			var song = nodeArgs.slice(3).join(' ');	
		}
		spotify(song);
		break;

	case "movie-this":
		if (nodeArgs[3]) { 
			// // Create an empty variable for holding the movie name
			var movieName = "";
			// Loop through all the words in the node argument
			// And add "+"s between words of the title for the url query
			for (var i=3; i < nodeArgs.length; i++){
				if (i>3 && i < nodeArgs.length){
					movieName = movieName + "+" + nodeArgs[i];
				}
				else {
					//this is a single word title
					movieName = movieName + nodeArgs[i];
				}
			}		
		} else {
			//set default to "Mr. Nobody" if no movie entered
			movieName = 'Mr. Nobody';			
			console.log(movieDefaultMsg);
			fs.appendFile('log.txt',movieDefaultMsg);
		}
		omdb(movieName);
		break;

	case "do-what-it-says":
		fileCommand();
		break;
}
function twitter() {
	// Using the require keyword to access all of the exports 
	// in the keys.js file

	var keys = require('./keys.js');

	var Twitter = require('twitter');

	var params = {screen_name: 'ChristiSavino'};

	var client = new Twitter({
	  consumer_key: keys.twitterKeys.consumer_key,
	  consumer_secret: keys.twitterKeys.consumer_secret,
	  access_token_key: keys.twitterKeys.access_token_key,
	  access_token_secret: keys.twitterKeys.access_token_secret
	});

	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		if (!error) {
		    //onsole.log(tweets);
		    console.log("My tweets:");
		    console.log("------------------------------------------------------------------");

		    fs.appendFile('log.txt',"\nMy tweets:");

		    for (var i= 1; i < tweets.length; i++) {
		    console.log(tweets[i].text);
		    console.log('Tweeted: ', tweets[i].created_at);
		    console.log("------------------------------------------------------------------");

		    fs.appendFile('log.txt', '\n' + tweets[i].text);
		    fs.appendFile('log.txt','Tweeted: ' + tweets[i].created_at);
			}

	    }
	}); //end of client
} // end of twitter()

function spotify(song) {
	// Include the spotify npm package (Don't forget to run "npm install spotify" in this folder first!)
	var spotify = require('spotify');

	spotify.search({ type: 'track', query: song }, function(err, data) {
		//console.log(JSON.stringify(data,null,2));
	    if ( err ) {
	        console.log('Error occurred: ' + err);
	        fs.appendFile('log.txt','Error occurred: ' + err);
	        return;
	    }
	    // items is a giant array with all the data we need
	    var dataArr = data.tracks.items;
	    console.log( '\nHere are the top results for ' + song);
	    fs.appendFile('log.txt','\nHere are the top results for ' + song);
	    //Do something with 'data'     
	    for ( var i = 0; i < 10; i++) {
	    	console.log('\nResult #:', i+1);
		    console.log('\nArtist name: '+ dataArr[i].artists[0].name);
		    console.log('Song title: '+ dataArr[i].name);
		    console.log('Preview link: '+ dataArr[i].preview_url);
		    console.log('Album: '+ dataArr[i].album.name);

		    fs.appendFile('log.txt','\nArtist name: '+ dataArr[i].artists[0].name);
		    fs.appendFile('log.txt','\nSong title: '+ dataArr[i].name);
		    fs.appendFile('log.txt','\nPreview link: '+ dataArr[i].preview_url);
		    fs.appendFile('log.txt','\nAlbum: '+ dataArr[i].album.name)
		}
        
	}); //end of spotify.search	
}

function omdb(movieName) {
	// Get a move title with multiple words (ex: Forrest Gump) as a Node argument and retrive the year it was created. 
	var request = require('request');	

	// Then run a request to the OMDB API with the movie specified and tomatoes=true to get rotten tomatoes rating
	var queryUrl = 'http://www.omdbapi.com/?t=' + movieName +'&y=&plot=short&tomatoes=true&r=json';

	// This line is just to help us debug against the actual URL.  
	//console.log(queryUrl);

	request(queryUrl, function (error, response, body) {
		var parser = JSON.parse(body);
		// If the request is successful (i.e. if the response status code is 200)
		if (!error && response.statusCode == 200) {

			console.log("\nMovie title: " + parser["Title"]);
			console.log("Release Year: " + parser["Year"]);
			console.log("IMDB rating: " + parser["imdbRating"]);
			console.log("Country: " + parser["Country"]);
			console.log("Language: " + parser["Language"]);
			console.log("Plot: " + parser["Plot"]);
			console.log("Actors: " + parser["Actors"]);
			console.log("Rotten Tomatoes Rating: " + parser["tomatoRating"]);
			console.log("Rotten Tomatoes URL: " + parser["tomatoURL"]);
			console.log("-----------------------------------");


			fs.appendFile('log.txt', "\nMovie title: " + parser["Title"]);
			fs.appendFile('log.txt', "\nRelease Year: " + parser["Year"]);
			fs.appendFile('log.txt', "\nIMDB rating: " + parser["imdbRating"]);
			fs.appendFile('log.txt', "\nCountry: " + parser["Country"]);
			fs.appendFile('log.txt', "\nLanguage: " + parser["Language"]);
			fs.appendFile('log.txt', "\nPlot: " + parser["Plot"]);
			fs.appendFile('log.txt', "\nActors: " + parser["Actors"]);
			fs.appendFile('log.txt', "\nRotten Tomatoes Rating: " + parser["tomatoRating"]);
			fs.appendFile('log.txt', "\nRotten Tomatoes URL: " + parser["tomatoURL"]);


		}
	}); //end of request

} //end of omdb

function fileCommand() {
	fs.readFile('random.txt','utf8',function(err,data) {
		//split the string of items separated by commas into an array of items
		fileTxtArr = data.split(',');

		switch (fileTxtArr[0]) {
			case "my-tweets":
				twitter();
				break;

			case "spotify-this-song":
				if (fileTxtArr[1]) {
				var song = fileTxtArr[1];				
				} else {
				var song = 'The Sign';
				console.log(songDefaultMsg);
				fs.appendFile('log.txt',songDefaultMsg);
				}
				spotify(song);	
			break;

			case "movie-this":
				if(fileTxtArr[1]) {
					var movie = fileTxtArr[1];
				} else {
					var movie = 'Mr.Nobody';
					console.log(movieDefaultMsg);
					fs.appendFile('log.txt',movieDefaultMsg);
				}
				omdb(movie);
			break;
		}
		
	}); //end of fs.readFile
} //end of command

// test cases for fileCommand()
// spotify-this-song,"I Want it That Way"
// spotify-this-song
// movie-this,"Jaws"
// movie-this
// my-tweets