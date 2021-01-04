<template>
        <div class="flex">
            <div class="blue merida">
                <div ref="board" class="cg-board-wrap"></div> <br>
                <div class="board-buttons">
                    <b-button @click="undoMove">undo</b-button>
                    <b-button @click="resetBoard">reset</b-button>
                    <b-button @click="flipOrientation">flip board</b-button>
                    <div style="flex: 1;"/>
                    <opening-select @openingSelected="changeActiveOpening" />
                </div>
            </div>
            <div class="moves">
                <div 
                    class="has-text-weight-bold has-text-centered is-size-3"
                    >{{openingName}}</div>
                <div>correct sequence: {{openingSequence}}</div>
                <div>mistakes: {{Array.from(mistakes)}}</div>
                <div>training state: {{trainingState}}</div>
                <div>half move index: {{halfMoveIndex}}</div>
                <div>next piece: {{nextPieceToMove}}</div>
                <div>next square: {{nextDestination}}</div>
            </div>
        </div>
</template>

<script>
import boardLogic from './boardLogic'
import openingSelect from '@/components/OpeningSelect'

import { pieceFromMove, destFromMove } from '@/utils/notationHelpers'

export default {
    name: "TrainingBoard",
    mixins: [boardLogic],
    components: {
        openingSelect,
    },
    data() {
        return {

            // can be 'ready', 'started', 'retryMove', 'finished'
            trainingState: 'ready',

            // Track the halfMoveIndex of any mistakes
            // The index points to the failed move.
            mistakes: new Set(),

            // The opening that we are training
            openingName: '',
            openingSequence: [],

            currentFen: '',
        }
    },

    mounted () {
        this.init()
    },

    watch: {

        trainingState () {
            console.log(`training state: ${this.trainingState}`)
            if (this.trainingState == "ready") {
                this.board.set({ viewOnly: true })
            }
            if (this.trainingState == "started") {
                this.board.set({ viewOnly: false })
            }
            if (this.trainingState == "retryMove") {
                this.board.set({ viewOnly: false })
            }
            if (this.trainingState == "finished") {
                this.board.set({ viewOnly: true })
                this.$buefy.toast.open('Finished, nice!')
            }
        }

    },

    methods: {

        changeActiveOpening (opening) {
            console.log(opening)
            this.openingName = opening.name
            this.openingSequence = opening.sequence
            this.resetBoard()
            this.trainingState = 'started'
        },

        resetBoard() {
            this.game.reset()
            this.updatePosition()
            this.board.set({ viewOnly: true })
            this.mistakes = new Set()
            this.halfMoveIndex = 0
            this.trainingState = 'ready'

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



        changeTurn () {
            return (orig, dest) => {
                console.log('training board move: ', orig, dest)

                // Make the move (but not on the board)
                let lastMove = this.game.move({
                    from: orig,
                    to: dest,
                    promotion: this.onPromotion()
                })

                // Don't do anything if the last registered move was invalid.
                if (lastMove == null) { 
                    //this.game.undo()
                    let config = this.getChessgroundConfig()
                    config['lastMove'] = [] // don't highlight the mistake move
                    this.board.set(config)
                    console.log('invalid move')
                    return }

                // If the move is correct, display it. 
                // Otherwise, keep the current config and do hint routine.
                if (this.isLastMoveCorrect()) {
                    console.log('correct')
                    let config = this.getChessgroundConfig()
                    this.board.set(config)
                    this.emitInfo()
                    this.halfMoveIndex += 1
                }
                else {
                    console.log('incorrect') 
                    this.game.undo()
                    this.mistakes.add(this.halfMoveIndex)
                    let config = this.getChessgroundConfig()
                    config['lastMove'] = [] // don't highlight the mistake move
                    this.board.set(config)
                    this.emitInfo()
                }
                

                // If this was the last move in the opening, do success routine.
                if (this.checkOpeningFinished()) {
                    console.log('success!')

                    if (this.mistakes.length > 0) {
                        console.log('entering redo sequence')
                    }
                    else {
                        this.trainingState = 'finished'
                    }
                    // TODO: retrain on missed spots, if applicable. 
                    // TODO: somehow indicate subsequent moves are not in the opening.
                }

            }
        },

        isLastMoveCorrect() {
            let currentMoves = this.game.history()
            let lastMove =  currentMoves[currentMoves.length - 1]
            let correctMove = this.openingSequence[currentMoves.length - 1]
            return (lastMove == correctMove)
        },

        // Return true if we've made as many moves as the opening expects.
        checkOpeningFinished () {
            let currentMoveCount = this.game.history().length
            let openingMoveCount = this.openingSequence.length
            return (currentMoveCount >= openingMoveCount)
        },

        // Define this as its own method because components that extend
        // this may want a different starting procedure.
        init() {
            this.updatePosition()
            this.resize()
            this.resetBoard()
        }
    },

    computed: {

        openingIsLoaded () {
            return this.openingSequence != [] && this.openingName != ''
        },

        nextMove() {
            if (!this.openingIsLoaded || this.trainingState == 'finished') {
                 return '-' 
            }
            return this.openingSequence[this.halfMoveIndex]
        },
        
        nextPieceToMove() {
            if (!this.openingIsLoaded || this.trainingState == 'finished') {
                 return '-' 
            }
            return pieceFromMove(this.nextMove)
        },

        nextDestination() {
            if (!this.openingIsLoaded || this.trainingState == 'finished') {
                 return '-' 
            }
            return destFromMove(this.openingSequence, this.halfMoveIndex)
        },
    }

    
}
</script>

<style scoped>

.flex {
    display: flex;
    flex-direction: column;
    margin: 1em;
}
.blue.merida {
    flex-grow: 1;
}
.board-buttons {
    width: 100%;
    display: flex;
    margin-bottom: 1em;
}
.board-buttons > *:not(:last-child) {
    margin-right: 10px;
    margin-bottom: 10px;
}

.moves {
    height: 100%;
    padding: 1em;
}
.moves > * {
    margin-bottom: 5px;
}


</style>