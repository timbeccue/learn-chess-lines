
import _ from 'lodash'
import Chess from 'chess.js'
import {Chessground} from 'chessground'
import { numberedMovesArray } from '@/utils/notationHelpers'
export default {
    name: "Board", 
    props: {
        fen: {
            type: String,
            default: '',
        },
        free: { // delete me?
            type: Boolean,
            default: false,
        },
        onPromotion: {
            type: Function,
            default: () => 'q',
        },
    },
    data() {
        return {
            game: new Chess(),
            board: null,
            promoteTo: 'q',

            currentFen: '',

            // Tracks the total number of piece moves
            halfMoveIndex: 0,

            orientation: 'white',

            pgn: '',
        }
    },
    watch: {
        fen: function (newFen) {
            this.fen = newFen
            this.updatePosition()
        },
        halfMoveIndex() {
            this.pgn = numberedMovesArray(this.game.history())
                .join('  ')
        },
    },
    methods: {

        loadPGN(pgn) {
            const pgnLoadSuccess = this.game.load_pgn(pgn, {sloppy: true})
            if (!pgnLoadSuccess) {
                this.$buefy.toast.open({
                    type: "is-danger",
                    message: "Failed to load PGN."
                })
            }
            this.updatePosition()
        },

        resize() {
            const parentEl = this.$refs.board.parentElement
            const parentWidth = parentEl.clientWidth

            // prevent board from being larger than the screen height
            const vh = Math.max(document.documentElement.clientHeight || 0, 
                    window.innerHeight || 0)
            const maxBoardHeight = 0.7 * vh

            const boardWidth = Math.min(parentWidth, maxBoardHeight)

            // Apply sizes to the elements
            parentEl.style.minHeight = boardWidth + 'px';
            this.$refs.board.style.width = boardWidth + 'px';
            this.$refs.board.style.height = boardWidth + 'px';
            this.board.redrawAll()
        },

        getTurnColor() {
            return (this.game.turn() === 'w') ? 'white' : 'black'
        },

        getChessgroundConfig() {
            return {
                fen: this.game.fen(),
                turnColor: this.getTurnColor(),
                resizable: true,
                movable: {
                    color: this.getTurnColor(),
                    dests: this.possibleMoves(),
                },
                orientation: this.orientation,
            }
        },

        possibleMoves () {
            const dests = {}
            this.game.SQUARES.forEach(s => {
                const ms = this.game.moves({square: s, verbose: true})
                if (ms.length) dests[s] = ms.map(m => m.to)
            })
            return dests
        },

        // This provides the function that runs at the next user input.
        changeTurn () {
            return (orig, dest) => {
                this.game.move({
                    from: orig, 
                    to: dest, 
                    promotion: this.onPromotion()
                }) // promote to queen for simplicity
                this.halfMoveIndex += 1
                let config = this.getChessgroundConfig()
                this.board.set(config)

                this.emitInfo()
            }
        },
        emitInfo() {
            this.currentFen = this.game.fen()
            let info = {
                fen: this.currentFen,
                history: this.game.history()
            }
            this.$emit('onMove', info)
        },

        flipOrientation() {
            this.orientation = this.orientation == 'white' ? 'black' : 'white'; 
            this.updatePosition()
        },

        undoMove() {
            this.game.undo()
            this.halfMoveIndex -= 1
            this.updatePosition()
        },
        resetBoard() {
            this.game.reset()
            this.halfMoveIndex = 0
            this.updatePosition()
        },
        updatePosition() { 
            let config = this.getChessgroundConfig()
            this.board = Chessground(this.$refs.board, config)
            this.board.set({
                movable: { events: { after: this.changeTurn() } },
            })
            this.emitInfo()
        },
    },

    mounted() {
        window.addEventListener('resize', this.resize)
    },

    beforeDestroy() {
        window.removeEventListener('resize', this.resize)
    },
}