/*
Example moves include:
    Na1
    e4
    Qh4xe1
    gxh8=Q#
 */

function isLowerCase(str) {
    return str == str.toLowerCase() && str != str.toUpperCase();
}

function isEven(number) {
    return number % 2 == 0;
}

// Note: this does not account for castling (O-O | O-O-O)
const moveRegex = [
    '([abcdefghNBRKQ])?',   // Starts with piece, or pawn file if capture   
    '[a-h]?[1-8]?',         // Disambiguate by piece location
    'x?',                   // Denotes capture
    '([a-h][1-8])',         // Destination square
    '=?[NBRQ]?',            // Promotion 
    '[+#]?'                 // Check or Checkmate
].join('')

export function pieceFromMove(move) {

    // Castling
    if (move in ['O-O', 'O-O-O']) { return 'King' }

    const firstLetter = move[0]

    // Pawn moves start with the lowercase file letter, like in move 'e5'
    if (isLowerCase(firstLetter)) { return 'Pawn' }

    if (firstLetter == 'N') { return 'Knight' }
    if (firstLetter == 'B') { return 'Bishop' }
    if (firstLetter == 'R') { return 'Rook' }
    if (firstLetter == 'Q') { return 'Queen' }
    if (firstLetter == 'K') { return 'King' }

    // Report errors
    console.warn('Could not determine piece from move ', move)
    
}

export function destFromMove(moveHistory, moveIndex) {

    const move = moveHistory[moveIndex]

    if (move in ['O-O', 'O-O-O']) {
        // Castling requires knowing which side is playing. 
        const castleRank = moveIndex % 2 == 0 ? 1 : 8
        const castleFile = move == 'O-O' ? 'g' : 'c'
        return castleRank + castleFile
    }
    console.log(move.match(moveRegex))

    let [_, piece, dest] = move.match(moveRegex)
    return dest

}

export function numberedMovesArray(moveHistory) {

    // Array to return. Each element is a pair of moves, like '1. e4 e5'
    let numberedMoves = []

    // Hold the temporary move we are building
    let nextMove = ''

    moveHistory.forEach((move, idx) => {

        // Add the turn number and the white move (ie. '1. e4')
        if (isEven(idx)) {
            nextMove = `${(idx + 2) / 2}. ${move}`

            // If white makes the last move, add before waiting for black.
            if (idx == moveHistory.length - 1) {
                numberedMoves.push(nextMove)
            }
        }

        // Add the black move and push to our array
        else {
            nextMove = `${nextMove} ${move}`
            numberedMoves.push(nextMove)
        }
    })

    return numberedMoves;
}