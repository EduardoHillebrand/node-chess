var fs = require("fs");
var vm = require('vm');
var prompt = require("prompt");

vm.runInThisContext(fs.readFileSync("tools.js"));
vm.runInThisContext(fs.readFileSync("pieceMovements.js"));

// stores who's turn it is ("white" or "black")
var turn = "white";

// a stack of boards; used for undoing moves
var stack = [];

function getBoardFromHash(hash) {
    board = hash.split("\n");
    for (var i = 0; i < board.length; i += 1) {
        board[i] = board[i].split("");
    }
    return board;
}

/** Generates the chess board. */
function generateBoard() {
    return [["R", "N", "B", "K", "Q", "B", "N", "R"],
            ["P", "P", "P", "P", "P", "P", "P", "P"],
            [" ", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", " ", " "],
            ["p", "p", "p", "p", "p", "p", "p", "p"],
            ["r", "n", "b", "k", "q", "b", "n", "r"]];
}

/** Prints BOARD to the standard output */
function printBoard(board) {
    var boardPrintout = "   ---------------------------------\n";
    for (var i = board.length - 1; i >= 0; i -= 1) {
        boardPrintout += " " + (i + 1) + " |";
        for (var j = 0; j < board[i].length; j += 1) {
            boardPrintout += " " + board[i][j] + " |";
        }
        boardPrintout += "\n   ---------------------------------\n";
    }
    boardPrintout += "     A   B   C   D   E   F   G   H  ";
    console.log(boardPrintout);
    console.log("\n");
}

function boardAsString(board) {
    var boardPrintout = "   ---------------------------------\n";
    for (var i = board.length - 1; i >= 0; i -= 1) {
        boardPrintout += " " + (i + 1) + " |";
        for (var j = 0; j < board[i].length; j += 1) {
            boardPrintout += " " + board[i][j] + " |";
        }
        boardPrintout += "\n   ---------------------------------\n";
    }
    boardPrintout += "     A   B   C   D   E   F   G   H  \n";
}

function oppositeColor(color) {
        if (color == "white") {
            return "black";
        } else {
            return "white";
        }
}

/** Returns the color of the piece on square SQUARE (i.e. "white"). */
function colorOfSquare(square, board) {
    var pos = getPosFromSquare(square);
    var i = pos[0];
    var j = pos[1];
    if (i < 0 || i > 7 || j < 0 || j > 7) {
        return null;
    }
    return pieceColor(board[i][j]);
}

/** Returns the color of the piece as a string. */
function pieceColor(piece) {
    if (piece == " ") {
        return null;
    } else if (piece.charCodeAt(0) < 97) {
        return "white";
    } else {
        return "black";
    }
}

/** Returns the number of points PIECE is worth. */
function valOfPiece(piece) {
    if (piece == "P" || piece == "p") {
        return 1;
    } else if (piece == "N" || piece == "n") {
        return 3;
    } else if (piece == "R" || piece == "r") {
        return 5;
    } else if (piece == "B" || piece == "b") {
        return 3;
    } else if (piece == "K" || piece == "k") {
        return 9;
    } else if (piece == "Q" || piece == "q") {
        return 9;
    } else {
        return 0;
    }
}

/** Returns the piece type of PIECE (i.e. if PIECE is "p", returns "pawn"). */
function getPieceType(piece) {
    if (piece == " ") {
        return null
    } else if (piece == "P" || piece == "p") {
        return "pawn";
    } else if (piece == "N" || piece == "n") {
        return "knight";
    } else if (piece == "R" || piece == "r") {
        return "rook";
    } else if (piece == "B" || piece == "b") {
        return "bishop";
    } else if (piece == "K" || piece == "k") {
        return "king";
    } else if (piece == "Q" || piece == "q") {
        return "queen";
    }
}

/** Given a square on the board (i.e. A6), returns the corresponding position
  * in the board array as an array [i, j]. */
function getPosFromSquare(square) {
    return [parseInt(square[1]) - 1, square[0].charCodeAt(0) - 65];
}

/** Given a position [i, j] in the board array (i.e. board[i][j]), returns the
  * corresponding square on the board (i.e. A6). */
function getSquareFromPos(pos) {
    return String.fromCharCode(65 + pos[1]) + (Math.min(9, pos[0] + 1));
}

/** Returns true if move (i.e. "A6B6") is legal for player with COLOR. Returns
  * false otherwise. */
function isLegal(move, color, board) {
    var sliced = move.slice(1);
    var indOfSecondLetter = sliced.search("\\w") + 2;
    var newSquare = move.slice(indOfSecondLetter);
    var pos = getPosFromSquare(newSquare);
    var i = pos[0];
    var j = pos[1];

    // we cannot move off of the board
    if (isNaN(i) || isNaN(j) || i < 0 || i > 7 || j < 0 || j > 7) {
        return false;
    }

    // we cannot capture our own pieces
    if (colorOfSquare(newSquare, board) == color) {
        return false;
    }

    return true;
}

/** Returns as an array all the possible moves on the BOARD for the piece on
  * square SQUARE, given that it is COLOR's turn. */
function generateMovesForSquare(square, color, board) {
    var pos = getPosFromSquare(square);
    var i = pos[0];
    var j = pos[1];
    var piece = board[i][j];

    if (getPieceType(piece) == "pawn") {
        return genPawnMoves(square, color, board);
    } else if (getPieceType(piece) == "knight") {
        return genKnightMoves(square, color, board);
    } else if (getPieceType(piece) == "bishop") {
        return genBishopMoves(square, color, board);
    } else if (getPieceType(piece) == "rook") {
        return genRookMoves(square, color, board);
    } else if (getPieceType(piece) == "queen") {
        return genQueenMoves(square, color, board);
    } else if (getPieceType(piece) == "king") {
        return genKingMoves(square, color, board);
    } else {
        return [];
    }
}

/** Returns an array of all of the possible moves that COLOR can make. */
function generatePossibleMoves(color, board) {
    var moves = [];
    var curSquare;

    // iterate through each piece on the board.
    for (var i = 0; i < board.length; i += 1) {
        for (var j = 0; j < board[i].length; j += 1) {
            if (pieceColor(board[i][j]) == color) {
                curSquare = getSquareFromPos([i, j]);
                moves.extend(generateMovesForSquare(curSquare, color, board));
            }
        }
    }
    return moves;
}

/** Makes move MOVE, regardless of whether it is legal. */
function makeMove(move, board) {
    var sliced = move.slice(1);
    var indOfSecondLetter = sliced.search("\\w") + 2;

    var oldSquare = move.slice(0, indOfSecondLetter);
    var newSquare = move.slice(indOfSecondLetter);

    var pos_new = getPosFromSquare(newSquare);
    var pos_old = getPosFromSquare(oldSquare);

    var i_new = pos_new[0];
    var j_new = pos_new[1];
    var i_old = pos_old[0];
    var j_old = pos_old[1];

    // pushes a copy of this board to the stack
    stack.push(board.clone());

    var tmp = board[i_old][j_old];
    board[i_old][j_old] = " ";
    board[i_new][j_new] = tmp;

    return board;
}

/** Undoes the last move. */
function undoMove() {
    return stack.pop();
}

/** Returns a score for board state BOARD, given that it is COLOR's turn. */
function scoreBoard(board, color) {
    var pts = 0;
    for (var i = 0; i < board.length; i += 1) {
        for (var j = 0; j < board[i].length; j += 1) {
            if (pieceColor(board[i][j]) == color) {
                pts += valOfPiece(board[i][j]);
            } else if (pieceColor(board[i][j]) != null) {
                pts -= valOfPiece(board[i][j]);
            }
        }
    }
    return pts;
}

/** Returns the best move for player with COLOR on board BOARD. */
function getBestMove(color, board) {
    var moves = generatePossibleMoves(color, board);
    if (moves.length == 0) {
        console.log("NO MOVES");
        return null;
    }
    var best = moves[0];
    board = makeMove(best, board);
    var bestScore = alphabeta(board, 3, -999999, 999999, oppositeColor(color), true);
    board = undoMove();

    var curScore;
    for (var i = 1; i < moves.length; i += 1) {
        board = makeMove(moves[i], board);
        curScore = alphabeta(board, 3, -999999, 999999, oppositeColor(color), true);
        board = undoMove();
        if (curScore > bestScore || (curScore == bestScore && Math.random() > 0.5)) {
            bestScore = curScore;
            best = moves[i];
        }
    }
    return best;
}

function alphabeta(board, depth, alpha, beta, color, maximizingPlayer) {
    if (depth == 0) {
        return scoreBoard(board, color);
    }
    var moves = generatePossibleMoves(color, board);
    if (maximizingPlayer) {
        for (var i = 0; i < moves.length; i += 1) {
            board = makeMove(moves[i], board);
            alpha = Math.max(alpha, alphabeta(board, depth - 1, alpha, beta, oppositeColor(color), false));
            board = undoMove();
            if (beta <= alpha) {
                break;
            }
        }
        return alpha;
    } else {
        for (var i = 0; i < moves.length; i += 1) {
            board = makeMove(moves[i], board);
            beta = Math.min(beta, alphabeta(board, depth - 1, alpha, beta, oppositeColor(color), true));
            board = undoMove();
            if (beta <= alpha) {
                break;
            }
        }
        return beta;
    }
}

module.exports.generateBoard = generateBoard;
module.exports.printBoard = printBoard;
module.exports.boardAsString = boardAsString;
module.exports.oppositeColor = oppositeColor;
module.exports.colorOfSquare = colorOfSquare;
module.exports.pieceColor = pieceColor;
module.exports.valOfPiece = valOfPiece;
module.exports.getPieceType = getPieceType;

module.exports.getPosFromSquare = getPosFromSquare;
module.exports.getSquareFromPos = getSquareFromPos;
module.exports.isLegal = isLegal;
module.exports.generateMovesForSquare = generateMovesForSquare;

module.exports.generatePossibleMoves = generatePossibleMoves;
module.exports.makeMove = makeMove;
module.exports.undoMove = undoMove;
module.exports.scoreBoard = scoreBoard;

module.exports.getBestMove = getBestMove;
module.exports.alphabeta = alphabeta;
module.exports.getBoardFromHash = getBoardFromHash;
