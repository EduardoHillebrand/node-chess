// var fs = require("fs");
// var vm = require('vm');

// vm.runInThisContext(fs.readFileSync("chess.js"));

/** Returns a list of all possible moves that a pawn on square SQUARE
  * on the BOARD for player with color COLOR. */
function genPawnMoves(square, color, board) {
    var possibleMoves = [],
        legalMoves = [],
        pos = getPosFromSquare(square),
        i = pos[0],
        j = pos[1];

    if (color == "black" && colorOfSquare(square, board) == "black") {
        // move forward one square
        if (colorOfPiece(board[i - 1][j]) == null) {
            possibleMoves.push(square + getSquareFromPos([i - 1, j]));
        }

        // move forward two squares
        if (i == 6 && colorOfPiece(board[i - 2][j]) == null) {
            possibleMoves.push(square + getSquareFromPos([i - 2, j]));
        }

        // see if we can capture pieces
        if (colorOfSquare(getSquareFromPos([i - 1, j + 1]), board) == "white") {
            possibleMoves.push(square + getSquareFromPos([i - 1, j + 1]));
        }
        if (colorOfSquare(getSquareFromPos([i - 1, j - 1]), board) == "white") {
            possibleMoves.push(square + getSquareFromPos([i - 1, j - 1]));
        }
    } else if (color == "white" && colorOfSquare(square, board) == "white") {
        // move forward one square
        if (colorOfPiece(board[i + 1][j]) == null) {
            possibleMoves.push(square + getSquareFromPos([i + 1, j]));
        }

        // move forward two squares
        if (i == 1 && colorOfPiece(board[i + 1][j]) == null) {
            possibleMoves.push(square + getSquareFromPos([i + 2, j]));
        }

        // see if we can capture pieces
        if (colorOfSquare(getSquareFromPos([i + 1, j + 1]), board) == "black") {
            possibleMoves.push(square + getSquareFromPos([i + 1, j + 1]));
        }
        if (colorOfSquare(getSquareFromPos([i + 1, j - 1]), board) == "black") {
            possibleMoves.push(square + getSquareFromPos([i + 1, j - 1]));
        }
    }

    for (i = 0; i < possibleMoves.length; i += 1) {
        if (isLegal(possibleMoves[i], color, board)) {
            legalMoves.push(possibleMoves[i]);
        }
    }

    return legalMoves;
}

/** Returns a list of all possible moves that a knight on square SQUARE
  * on the BOARD for player with color COLOR. */
function genKnightMoves(square, color, board) {
    var possibleMoves = [],
        legalMoves = [],
        pos = getPosFromSquare(square),
        i = pos[0],
        j = pos[1];

    possibleMoves.push(square + getSquareFromPos([i + 1, j + 2]));
    possibleMoves.push(square + getSquareFromPos([i + 1, j - 2]));
    possibleMoves.push(square + getSquareFromPos([i - 1, j + 2]));
    possibleMoves.push(square + getSquareFromPos([i - 1, j - 2]));

    possibleMoves.push(square + getSquareFromPos([i + 2, j + 1]));
    possibleMoves.push(square + getSquareFromPos([i + 2, j - 1]));
    possibleMoves.push(square + getSquareFromPos([i - 2, j + 1]));
    possibleMoves.push(square + getSquareFromPos([i - 2, j - 1]));

    for (i = 0; i < possibleMoves.length; i += 1) {
        if (isLegal(possibleMoves[i], color, board)) {
            legalMoves.push(possibleMoves[i]);
        }
    }

    return legalMoves;
}

/** Returns a list of all possible moves that a bishop on square SQUARE
  * on the BOARD for player with color COLOR. */
function genBishopMoves(square, color, board) {
    var possibleMoves = [],
        legalMoves = [],
        pos = getPosFromSquare(square),
        i = pos[0],
        j = pos[1];

    for (var x = 1; (i+x < 8) && (j+x < 8); x += 1) {
        possibleMoves.push(square + getSquareFromPos([i + x, j + x]));
        if (getPieceType(board[i+x][j+x]) != null) {
            break;
        }
    }
    for (var x = 1; (i+x < 8) && (j-x >= 0); x += 1) {
        possibleMoves.push(square + getSquareFromPos([i + x, j - x]));
        if (getPieceType(board[i+x][j-x]) != null) {
            break;
        }
    }
    for (var x = 1; (i-x >= 0) && (j+x < 8); x += 1) {
        possibleMoves.push(square + getSquareFromPos([i - x, j + x]));
        if (getPieceType(board[i-x][j+x]) != null) {
            break;
        }
    }
    for (var x = 1; (i-x >= 0) && (j-x >= 0); x += 1) {
        possibleMoves.push(square + getSquareFromPos([i - x, j - x]));
        if (getPieceType(board[i-x][j-x]) != null) {
            break;
        }
    }

    for (i = 0; i < possibleMoves.length; i += 1) {
        if (isLegal(possibleMoves[i], color, board)) {
            legalMoves.push(possibleMoves[i]);
        }
    }

    return legalMoves;
}

/** Returns a list of all possible moves that a rook on square SQUARE
  * on the BOARD for player with color COLOR. */
function genRookMoves(square, color, board) {
    var possibleMoves = [],
        legalMoves = [],
        pos = getPosFromSquare(square),
        i = pos[0],
        j = pos[1];

    for (var x = 1; (i+x < 8); x += 1) {
        possibleMoves.push(square + getSquareFromPos([i + x, j]));
        if (getPieceType(board[i+x][j]) != null) {
            break;
        }
    }
    for (var x = 1; (i-x >= 0); x += 1) {
        possibleMoves.push(square + getSquareFromPos([i - x, j]));
        if (getPieceType(board[i-x][j]) != null) {
            break;
        }
    }
    for (var x = 1; (j+x < 8); x += 1) {
        possibleMoves.push(square + getSquareFromPos([i, j + x]));
        if (getPieceType(board[i][j+x]) != null) {
            break;
        }
    }
    for (var x = 1; (j-x >= 0); x += 1) {
        possibleMoves.push(square + getSquareFromPos([i, j - x]));
        if (getPieceType(board[i][j-x]) != null) {
            break;
        }
    }

    for (i = 0; i < possibleMoves.length; i += 1) {
        if (isLegal(possibleMoves[i], color, board)) {
            legalMoves.push(possibleMoves[i]);
        }
    }

    return legalMoves;
}

/** Returns a list of all possible moves that a queen on square SQUARE
  * on the BOARD for player with color COLOR. */
function genQueenMoves(square, color, board) {
    var legalMoves = genRookMoves(square, color, board);
    legalMoves.extend(genBishopMoves(square, color, board));
    return legalMoves;
}

/** Returns a list of all possible moves that a king on square SQUARE
  * on the BOARD for player with color COLOR. */
function genKingMoves(square, color, board) {
    var possibleMoves = [],
        legalMoves = [],
        pos = getPosFromSquare(square),
        i = pos[0],
        j = pos[1];

    possibleMoves.push(square + getSquareFromPos([i + 1, j]));
    possibleMoves.push(square + getSquareFromPos([i + 1, j - 1]));
    possibleMoves.push(square + getSquareFromPos([i + 1, j + 1]));
    possibleMoves.push(square + getSquareFromPos([i - 1, j]));
    possibleMoves.push(square + getSquareFromPos([i - 1, j - 1]));
    possibleMoves.push(square + getSquareFromPos([i - 1, j + 1]));
    possibleMoves.push(square + getSquareFromPos([i, j - 1]));
    possibleMoves.push(square + getSquareFromPos([i, j + 1]));
    for (i = 0; i < possibleMoves.length; i += 1) {
        if (isLegal(possibleMoves[i], color, board)) {
            legalMoves.push(possibleMoves[i]);
        }
    }
    return legalMoves;
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

/** Returns the color of the piece on square SQUARE (i.e. "white"). */
function colorOfSquare(square, board) {
    var pos = getPosFromSquare(square);
    var i = pos[0];
    var j = pos[1];
    if (i < 0 || i > 7 || j < 0 || j > 7) {
        return null;
    }
    return colorOfPiece(board[i][j]);
}

/** Returns the color of the piece as a string. */
function colorOfPiece(piece) {
    if (piece == " ") {
        return null;
    } else if (piece.charCodeAt(0) < 97) {
        return "white";
    } else {
        return "black";
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

/** Returns true if move (i.e. "A6B6") is legal for player with COLOR. Returns
  * false otherwise. */
function isLegal(move, color, board) {
    var sliced = move.slice(1);
    var indexOfSecondLetter = sliced.search("\\w") + 2;
    var newSquare = move.slice(indexOfSecondLetter);
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