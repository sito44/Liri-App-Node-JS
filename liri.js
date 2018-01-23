'use strict';
const dotEnv = require('dotenv').config();
const appKeys = require('./keys.js');
const rQ = require('request');
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
}, ]).then(function(userInput) {

    switch (userInput.command) {
        case 'my-tweets':
            inquirer.prompt([{
                type: 'input',
                message: 'Enter your Twitter Screen Name',
                name: 'screen_name'
            }]).then(function(screenName) {
                let params = screenName;
                params.count = '20';


                client.get('statuses/user_timeline', params, function(error, tweets, response) {
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
            }]).then(function(song) {
                let params = song;
                params.type = 'track';
                params.limit = '1';

                spotify.search(params , function(err, data) {
                    if (err) {
                        return console.log('Error occurred: ' + err);
                    }

                    console.log(JSON.stringify(data).split(','));

                });
            });
            break;



    }

});