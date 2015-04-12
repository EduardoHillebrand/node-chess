# Node.js Chess Server

A Node.js app built using [Express 4](http://expressjs.com/).

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

This is a Node.js server that can provide hints for a player during a chess game. Sending a GET request to this server with the current configuration of a chess board and the color whose turn it is will cause the server to respond with a good move for that color.

*Formatting the request*
Assuming that this server is running on a url titled \<url\>, one can obtain a hint with a request in a format similar to the following:

  \<url\>/get-move?board=RNBQKBNR|PPPPPPPP|--------|--------|--------|--------|pppppppp|rnbqkbnr&color=white

The response from the server will look like this:

  H1H2

**Currently, this app is running at https://agile-chamber-7384.herokuapp.com/**, so you can try out the above request by clicking this link: https://agile-chamber-7384.herokuapp.com/get-move?board=RNBQKBNR|PPPPPPPP|--------|--------|--------|--------|pppppppp|rnbqkbnr&color=white
