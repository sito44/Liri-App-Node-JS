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
		}]).then((screenName) => {
			let params = screenName;
			params.count = '20';


			client.get('statuses/user_timeline', params, (error, tweets, response) => {
				if (error) throw error;
				let tweetsArray = [];
				for (var i = 0; i < tweets.length; i++) {

					let tweet =
						'\n' + '--------------------------------' + '\n' +
						tweets[i].text + '\n' +
						tweets[i].created_at + '\n' +
						'--------------------------------';
					console.log(tweet);
					tweetsArray.push(tweet);

				}

				let tweetLog = tweetsArray.join(',');
				logSearch(tweetLog);
			});

		});
	} else {
		let params = {
			screen_name: searchTerm,
			count: '20'
		};


		client.get('statuses/user_timeline', params, (error, tweets, response) => {
			if (error) throw error;
			let tweetsArray = [];
			for (var i = 0; i < tweets.length; i++) {

				let tweet =
					'--------------------------------' + '\n' +
					tweets[i].text + '\n' +
					tweets[i].created_at + '\n' +
					'--------------------------------' + '\n';
				console.log(tweet);
				tweetsArray.push(tweet);

			}

			let tweetLog = tweetsArray.join(',');
			logSearch(tweetLog);

		});
	}
}

function songSearch(searchTerm) {
	if (searchTerm === undefined) {
		inquirer.prompt([{
			type: 'input',
			message: 'Enter a song name for details',
			name: 'query'
		}]).then((song) => {
			let params = song;
			params.type = 'track';
			params.limit = '1';
			if (params.query === '') {
				params.query = 'The Sign';
			}

			spotify.search(params, (err, data) => {
				if (err) throw err;
				let songData =
					'Artist: ' + data.tracks.items[0].album.artists[0].name + '\n' +
					'Album Title: ' + data.tracks.items[0].album.name + '\n' +
					'Link: ' + data.tracks.items[0].album.href + '\n' +
					'Song Name: ' + data.tracks.items[0].name;
				console.log(songData);
				logSearch(songData);

			});
		});
	} else {
		let params = {
			query: searchTerm,
			type: 'track',
			limit: '1'
		};
		spotify.search(params, (err, data) => {
			if (err) throw err;
			let songData =
				'Artist: ' + data.tracks.items[0].album.artists[0].name + '\n' +
				'Album Title: ' + data.tracks.items[0].album.name + '\n' +
				'Link: ' + data.tracks.items[0].album.href + '\n' +
				'Song Name: ' + data.tracks.items[0].name;
			console.log(songData);
			logSearch(songData);

		});
	}
}

function movieSearch(searchTerm) {
	if (searchTerm === undefined) {
		inquirer.prompt([{
			type: 'input',
			message: 'Enter a movie for details',
			name: 't'
		}]).then((movie) => {
			let params = movie;
			if (params.t === '') {
				params.t = 'Mr Nobody';
			}
			request('http://www.omdbapi.com/?apikey=trilogy&t=' + params.t, (error, response, body) => {
				if (error) throw error;
				let movieData = JSON.parse(body);
				let movieString =
					'Title: ' + movieData.Title + '\n' +
					'Year: ' + movieData.Year + '\n' +
					'imdbRating: ' + movieData.imdbRating + '\n' +
					'RottenTomatoes: ' + movieData.Ratings[1].Value + '\n' +
					'Country of Production: ' + movieData.Country + '\n' +
					'Language: ' + movieData.Language + '\n' +
					'Plot: ' + movieData.Plot + '\n' +
					'Actors: ' + movieData.Actors;

				console.log(movieString);
				logSearch(movieString);
			});
		});
	} else {
		let params = {
			t: searchTerm
		};
		request('http://www.omdbapi.com/?apikey=trilogy&t=' + params.t, (error, response, body) => {
			if (error) throw error;
			let movieData = JSON.parse(body);
			let movieString =
				'Title: ' + movieData.Title + '\n' +
				'Year: ' + movieData.Year + '\n' +
				'imdbRating: ' + movieData.imdbRating + '\n' +
				'RottenTomatoes: ' + movieData.Ratings[1].Value + '\n' +
				'Country of Production: ' + movieData.Country + '\n' +
				'Language: ' + movieData.Language + '\n' +
				'Plot: ' + movieData.Plot + '\n' +
				'Actors: ' + movieData.Actors;

			console.log(movieString);
			logSearch(movieString);
		});
	}
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
		case 'my-tweets':
			tweetSearch(searchTerm);
			break;
		case 'spotify-this-song':
			songSearch(searchTerm);
			break;
		case 'movie-this':
			movieSearch(searchTerm);
			break;
		default:
			console.log('command not specified in random.txt');
			break;
		}
	});
}

function logSearch(searchData) {
	let logDate = new Date();
	fs.appendFile('log.txt','\n' + 'LOG DATE: ' + '{{{' + logDate + '}}}' + '\n' + searchData + '\n', (err) => {
		if (err) throw err;
		console.log('The search Data was appended to log.txt');
	});
}