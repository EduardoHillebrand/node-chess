var express = require('express');
var app = express();

// app.js
var http = require('http'),
    fs = require('fs'),
    express = require('express'),
    bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

var chess = require("./chess");

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
    response.send(chess.oppositeColor("white"));
})

app.post('/get-move', function(request, response) {
    console.log(request.body.board);
    var board = chess.getBoardFromHash(request.param('board'));
    var turn = request.param('turn');
    var move = chess.getBestMove(turn, board);

    response.send(move);
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
