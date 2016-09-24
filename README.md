# Liri-Node-App

This node.js app receives input from the command line and fetches data from the specified API. 

Node packages used:
- Node.js Twitter API Wrapper
- Node.js Spotify API Wrapper
- Node.js Request to get data from OMDB 

All command line inputs and data logged to the console are stored in a text file using fs.appendFile.

Command line inputs include:
- my-tweets - which grabs up to 20 of my last tweets
- spotify-this-song - which grabs info on the song title entered 
- movie-this - which gets info from OMDB on the movie title entered
- do-what-it-says - which uses fs.readFile to read a text file for the command and selection to be used

Every case has a default title to use if the user forgets to enter one.
