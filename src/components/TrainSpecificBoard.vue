
<script>
    import { chessboard }  from 'vue-chessboard'
    export default {
        name: 'TrainSpecificBoard',
        extends: chessboard,
        props: {
            trainingLine: {
                type: Object,
                default: [],
            }
        },
        methods: {
            makeMove() {
                return (orig, dest) => {
                    console.log(orig, dest)
                    if (this.isPromotion(orig, dest)) {
                        this.promoteTo = this.onPromotion()
                    }
                    this.game.move({from: orig, to: dest, promotion: this.promoteTo}) // promote to queen for simplicity
                    this.board.set({
                        fen: this.game.fen(),
                        movable: {
                            color: this.toColor(),
                            dests: this.possibleMoves(),
                        }
                    })
                    this.calculatePromotions()
                    this.afterMove()

                };
            },

            afterMove() {
                let info = {
                    fen: this.game.fen(),
                    history: this.game.history()
                }
                this.$emit('onMove', info)
            },

            undo() {
                this.game.undo()
                this.board.set({
                    fen: this.game.fen(),
                    movable: {
                        color: this.toColor(),
                        dests: this.possibleMoves(),
                    }
                })
                this.calculatePromotions()
                this.loadPosition()
                this.board.set({
                    movable: { events: { after: this.makeMove() } }
                })
                this.afterMove()
            },


        },
        mounted() {
            this.board.set({
                movable: { events: { after: this.makeMove()} },
            })
        }
    }
</script>
