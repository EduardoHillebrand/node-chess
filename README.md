# Node.js Chess Server

A barebones Node.js app using [Express 4](http://expressjs.com/).

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) and the [Heroku Toolbelt](https://toolbelt.heroku.com/) installed.

```sh
$ git clone git@github.com:heroku/node-js-getting-started.git # or clone your own fork
$ cd node-js-getting-started
$ npm install
$ npm start
```

Your app should now be running on [localhost:5000](http://localhost:5000/).

## Deploying to Heroku

```
$ heroku create
$ git push heroku master
$ heroku open
```

## Documentation

This is a Node.js chess server for Sean Scofield, Frank Lu, and Arthur Jeng's Berkeley EE149 Final Project. It provides a basic REST api service for getting the best move from a given chess board configuration.

In order to get the best possible move for a given chess board configuration (assuming this server is running on a url titled \<url\>) one can send a post request to "\<url\>/get-move" with something like the following information:

  {"board": "RNBKQBNR\nPPPPPPPq\n\ \ \ \ \ \ \ \ \n\ \ \ \ \ \ \ \ \n\ \ \ \ \ \ \ \ \n\ \ \ \ \ \ \ \ \npppppppp\nrnbkqbnr",
   "turn": "white"}
   
The response from the server will look like this:

  {"move": "H1H2"}
