require("dotenv").config();

const keys = require("./keys.js");
const fs = require("fs");
const request = require("request");
var moment = require('moment');


// Spotify
const Spotify = require('node-spotify-api');
let spotify = new Spotify(keys.spotify);

//calling liriReturn[2] and userSearch[3]
let liriReturn = process.argv[2];
let userSearch = process.argv[3];

//Liri-Bot switches/cases
switch (liriReturn) {
    case "movie-this":
    movieThis();
    break;
    case "concert-this":
        bandsInTown();
        break;
    case "spotify-this":
        spotifyThisSong();
        break;

    case "do-what-it-says":
        doWhatItSays();
        break;

    default: console.log(
        "\n"
        + "type one of the following commands AFTER node liri.js" + "\n"
        + "concert-this 'name of band'" + "\n"
        + "spotify-this 'song title'" + "\n"
        + "movie-this 'title'" + "\n"
        + "do-what-it-says" + "\n");
};


// Movie 
function movieThis() {

    //using movieName from var list at top
    var queryUrl = "http://www.omdbapi.com/?t=" + userSearch + "&y=&plot=short&apikey=babcdc33";

    request(queryUrl, function (error, response, body) {

        // If the request is successful
        if (!error && response.statusCode === 200) {

            //pull requested data in readable format
            var myMovieData = JSON.parse(body);
            var queryUrlResults =
                "Title: " + myMovieData.Title + "\n" +
                "Year: " + myMovieData.Year + "\n" +
                "IMDB Rating: " + myMovieData.Ratings[0].Value + "\n" +
                "Rotten Tomatoes Rating: " + myMovieData.Ratings[0].Value + "\n" +
                "Origin Country: " + myMovieData.Country + "\n" +
                "Language: " + myMovieData.Language + "\n" +
                "Plot: " + myMovieData.Plot + "\n" +
                "Actors: " + myMovieData.Actors + "\n"
            console.log(queryUrlResults);
            console.log("------------END-------------- ")
        } else {
            console.log("error: " + err);
            return;
        };
    });
};
//------------- Movie ends------------------------//


//concert-this bandsInTown 
function bandsInTown() {

    var queryURL = "https://rest.bandsintown.com/artists/" + userSearch + "/events?app_id=smubootcamp"
    request(queryURL, function (error, response, body) {
        //If no error and response is a success
        if (!error && response.statusCode === 200) {
            //Parse the json response
            var data = JSON.parse(body);
            //console.log(data);
            //Loop through array
            // for (var i = 0; i < data.length; i++) 
            {
                 //slip the date and time
                // var dataCommand = data[0].datetime;
                // var newTime = dataCommand.split('T');
                // var dataDate = newTime[0];       

                console.log(" ");
                console.log("-----------START-------------");
                console.log(" ");
               // console.log(dataDate);
                console.log(`\n
                Name: ${data[0].venue.name}
                City:  ${data[0].venue.city}
                Country: ${data[0].venue.country}
                Date:  ${data[0].venue.datetime}
                Lineup: ${data[0].lineup}`);
            };
        }
    });
            console.log("------------END-------------- ")
    
};
//------------- bandsInTown ends----------------------//


// spotify-this
function spotifyThisSong() {

    if (!userSearch) { userSearch = 'The Sign Ace of Base' };
    spotify.search({ type: "track", query: userSearch, limit: 1 },
        function (err, data) {
            // If the request is successful
            if (err) { return console.log('Error occurred: ' + err); } else {
                let spotifyArr = data.tracks.items;
                //console.log(spotifyArr);
                for (i = 0; i < spotifyArr.length; i++) {
                    console.log("-----------START-------------");
                    console.log(`\n
                   Song: ${data.tracks.items[i].name}
                   Artist(s): ${data.tracks.items[i].artists[0].name}
                   Album: ${data.tracks.items[i].album.name}
                   Preview Link: ${data.tracks.items[i].external_urls.spotify}`)
                    console.log(" ");
                    console.log("------------END-------------- ")
                }
            }
        })
};
//------------- Spotify ends----------------------//


// do-what-it-says funtion
function doWhatItSays() {
    fs.readFile('random.txt', 'utf8', function (error, data) {
        if (error) {
            console.log(error);
        } else {
            var dataArray = data.split(',');
            var dataCommand = dataArray[0];
            var dataInput = dataArray[1];
            console.log(dataCommand);
            //console.log(dataInput);
            switch (dataCommand) {
                case 'spotify-this':
                    userSearch = dataInput;
                    spotifyThisSong();
                    break;
                case 'movie-this':
                    userSearch = dataInput;
                    // console.log();
                    movieThis();
                    break;
                case 'concert-this':
                    userSearch = dataInput;
                    bandsInTown();
                    break;
                default:
                    console.log(`Please Check your Random.txt!`)
            }
        }
    })
};
//------------- doWhatItSays ends----------------------//