'use strict';
const dotEnv = require('dotenv').config();
const fs = require('fs');
const request = require('request');
const inquirer = require('inquirer');
const Twitter = require('twitter');
const Spotify = require('node-spotify-api');

const spotify = new Spotify({
	id: process.env.SPOTIFY_ID,
	secret: process.env.SPOTIFY_SECRET
});
const client = new Twitter({
	consumer_key: process.env.TWITTER_CONSUMER_KEY,
	consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
	access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
	access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

inquirer.prompt([{
	type: 'list',
	message: 'Choose a Command',
	choices: ['my-tweets', 'spotify-this-song', 'movie-this', 'do-what-it-says'],
	name: 'command'
}, ]).then(function (userInput) {

	switch (userInput.command) {
	case 'my-tweets':
		tweetSearch();
		break;
	case 'spotify-this-song':
		songSearch();
		break;
	case 'movie-this':
		movieSearch();
		break;
	case 'do-what-it-says':
		textFileRead();
		break;
	}

});

function tweetSearch(searchTerm) {
	
	if (searchTerm === undefined) {
		inquirer.prompt([{
			type: 'input',
			message: 'Enter your Twitter Screen Name',
			name: 'screen_name'
		}]).then(function (screenName) {
			let params = screenName;
			params.count = '20';


			client.get('statuses/user_timeline', params, function (error, tweets, response) {
				if (error) throw error;
				for (var i = 0; i < tweets.length; i++) {
					console.log(tweets[i].text);
					console.log(tweets[i].created_at);
				}

			});

		});
	} else {
		let params = {
			screen_name: searchTerm,
			count: '20'
		};


		client.get('statuses/user_timeline', params, function (error, tweets, response) {
			if (error) throw error;
			for (var i = 0; i < tweets.length; i++) {
				console.log(tweets[i].text);
				console.log(tweets[i].created_at);
			}

		});
	}
}

function songSearch() {
	inquirer.prompt([{
		type: 'input',
		message: 'Enter a song name for details',
		name: 'query'
	}]).then(function (song) {
		let params = song;
		params.type = 'track';
		params.limit = '1';
		if (params.query === '') {
			params.query = 'The Sign';
		}

		spotify.search(params, function (err, data) {
			if (err) throw err;

			// artist name
			console.log('Artist: ' + data.tracks.items[0].album.artists[0].name);
			// album name
			console.log('Album Title: ' + data.tracks.items[0].album.name);
			// Link
			console.log('Link: ' + data.tracks.items[0].album.href);
			// track name
			console.log('Song Name: ' + data.tracks.items[0].name);

		});
	});
}

function movieSearch() {
	inquirer.prompt([{
		type: 'input',
		message: 'Enter a movie for details',
		name: 't'
	}]).then(function (movie) {
		let params = movie;
		if (params.t === '') {
			params.t = 'Mr Nobody';
		}
		request('http://www.omdbapi.com/?apikey=trilogy&t=' + params.t, function (error, response, body) {
			if (error) throw error;
			//console.log(JSON.stringify(response).split(','));
			let movieData = JSON.parse(body);
			console.log(
				'Title: ' + movieData.Title + '\n' +
                'Year: ' + movieData.Year + '\n' +
                'imdbRating: ' + movieData.imdbRating + '\n' +
                'RottenTomatoes: ' + movieData.Ratings[1].Value + '\n' +
                'Country of Production: ' + movieData.Country + '\n' +
                'Language: ' + movieData.Language + '\n' +
                'Plot: ' + movieData.Plot + '\n' +
                'Actors: ' + movieData.Actors
			);
		});
	});
}

function textFileRead() {
	fs.readFile('random.txt', (err, data) => {
		if (err) throw err;
		console.log(data.toString().indexOf('"'));
		let txtData = data.toString();
		let command = txtData.slice(0, txtData.indexOf(','));
		console.log(command);
		let searchTerm = txtData.slice(txtData.indexOf('"') + 1, txtData.lastIndexOf('"'));
		switch (command) {
		case "my-tweets":
			tweetSearch(searchTerm);
			break;
        
		default:
			break;
		}
	});
}

