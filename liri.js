
var inquirer = require('./keys.js');
var fs = require('fs'); 
var twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');


var ArtistName = function(artist) {
  return artist.name;
};


var findSongs = function(songName) {
  //If you cant find song:
  if (songName === undefined) {
    songName = 'The Black Parade'; //choosing another song to play 
  };

  spotify.search({ type: 'track', query: songName }, function(err, data) {
    if (err) {
      console.log('Error has been found:' + err);
      return;
    }

    var song = data.tracks.items;
    var data = []; //have to keep empty 

    for (var i = 0; i < song.length; i++) {
      data.push({
        'artist(s)': song[i].artists.map(getArtistNames),
        'album: ': song[i].album.name,
        'song name: ': song[i].name,
        'preview: ': song[i].preview_url,
      });
    }
    console.log(data);
    writeToLog(data);
  });
};


var Tweets = function() {
  var client = new twitter(dataKeys.twitterKeys);

  var name = { screen_name: 'harikarcb', count: 20 };

  client.get('statuses/user_timeline', name, function(error, tweets, response) {

    if (!error) {
      var data = []; //empty array to hold data
      for (var i = 0; i < tweets.length; i++) {
        data.push({
            'Created at: ' : tweets[i].created_at,
            'Tweets: ' : tweets[i].text,
        });
      }
      console.log(data);
      writeToLog(data);
    }
  });
};

var findMovie = function(movieName) {

  if (movieName === undefined) {
    movieName = 'Home Alone';
  }

  var urlMovie = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&r=json";

  request(urlMovie, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var data = [];
      var jsonData = JSON.parse(body);

      data.push({
      'Title: ' : jsonData.Title,
      'Year: ' : jsonData.Year,
      'Actors: ' : jsonData.Actors,
      'Language: ' : jsonData.Language,
      'Rated: ' : jsonData.Rated,
      'IMDB Rating: ' : jsonData.imdbRating,
      'Country: ' : jsonData.Country,
      'Plot: ' : jsonData.Plot,
      'Rotten Tomatoes Rating: ' : jsonData.tomatoRating,
      'Rotton Tomatoes URL: ' : jsonData.tomatoURL,
  });
      console.log(data);
      writeToLog(data);
}
  });

}

var doWhatItSays = function() {
  fs.doWhatItSays("random.txt", "utf8", function(error, data) {
    console.log(data);
    writeToLog(data);
    var dataArr = data.split(',')

    if (dataArr.length == 2) {
      pick(dataArr[0], dataArr[1]);
    } else if (dataArr.length == 1) {
      pick(dataArr[0]);
    }

  });
}
//use switch case to pick a choice 
var pick = function(caseData, functionData) {
  switch (caseData) {
    case 'my-tweets':
      getTweets();
      break;
    case 'spotify-this-song':
      findSong(functionData);
      break;
    case 'movie-this':
      findMovie(functionData);
      break;
    case 'do-what-it-says':
      dowhatitsays();
      break;
    default:
      console.log('Error');
  }
}


var runThis= function(argOne, argTwo) {
  pick(argOne, argTwo);
};

runThis(process.argv[2], process.argv[3]);