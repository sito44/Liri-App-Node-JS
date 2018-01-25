
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
		inquirer.prompt([{
			type: 'input',
			message: 'Enter your Twitter Screen Name',
			name: 'screen_name'
		}]).then(function (screenName) {
			let params = screenName;
			params.count = '20';


			client.get('statuses/user_timeline', params, function (error, tweets, response) {
				if (error) {
					console.log(error);
				}
				for (var i = 0; i < tweets.length; i++) {
					console.log(tweets[i].text);
					console.log(tweets[i].created_at);
				}

			});

		});
		break;
	case 'spotify-this-song':
		inquirer.prompt([{
			type: 'input',
			message: 'Enter a song name for details',
			name: 'query'
		}]).then(function (song) {
			let params = song;
			params.type = 'track';
			params.limit = '1';
			console.log(params);
			if (params.query === '') {
				params.query = 'The Sign';
			}

			spotify.search(params, function (err, data) {
				if (err) {
					return console.log('Error occurred: ' + err);
				}

				let song = JSON.stringify(data).split(',');
				console.log(data);

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
		break;
	case 'movie-this':
		inquirer.prompt([{
			type: 'input',
			message: 'Enter a movie for details',
			name: 't'
		}]).then(function (movie) {
			let params = movie;
			console.log(params);
			if (params.t === '') {
				params.t = 'Mr Nobody';
			}
			request('http://www.omdbapi.com/?apikey=trilogy&t=' + params.t, function (error, response, body) {
				if (error) {throw error;}
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

});