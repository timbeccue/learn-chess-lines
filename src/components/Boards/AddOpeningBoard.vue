<template>
    <div class="blue merida">
        <div ref="board" class="cg-board-wrap"></div> <br>
        <div class="board-buttons">
            <b-button @click="undoMove">undo</b-button>
            <b-button @click="resetBoard">reset</b-button>
            <b-button @click="flipOrientation">flip board</b-button>
            <div style="flex: 1;"/>
        </div>

        <b-input 
            placeholder="PGN..."
            style="margin-bottom: 1em;"
            type="textarea" 
            v-model="pgn"></b-input>

        <div class="board-buttons">
            <b-button @click="loadPGN(pgn)">Load PGN to Board</b-button>
            <div style="flex: 1;"/>
            <b-field>
                <b-input placeholder="name..." v-model="newOpeningName"></b-input>
                <p class="control">
                    <button class="button" @click="saveCurrentOpening">
                    Save PGN as Opening
                    </button>
                </p>
            </b-field>
        </div>
        <hr>
        <opening-table />
    </div>
</template>

<script>
import _ from 'lodash'
import Chess from 'chess.js'
import {Chessground} from 'chessground'
import boardLogic from './boardLogic'
import OpeningTable from '@/components/OpeningTable'
export default {
    name: "AddOpeningBoard", 
    components: {
        OpeningTable,
    },
    mixins: [boardLogic],
    data() {
        return {
            newOpeningName: '',
        }
    },
    methods: {
        saveCurrentOpening() {
            let newOpening = new Chess()
            let loadSuccess = newOpening.load_pgn(this.pgn)
            if (!loadSuccess) {
                this.$buefy.toast.open({
                    type: "is-danger",
                    message: "Failed to load PGN."
                })
                return;
            }
            this.$store.dispatch('openings/addOpening', {
                name: this.newOpeningName,
                sequence: newOpening.history()
            })
            this.$store.dispatch('openings/saveNewOpening', {
                name: this.newOpeningName,
                sequence: newOpening.history()
            })
        },

        // Define this as its own method because components that extend
        // this may want a different starting procedure.
        init() {
            this.updatePosition()
            this.resize()
        }
    },
    mounted () {
        this.init()
    },
}
</script>

<style lang="scss" scoped>
.blue.merida {
    margin: 1em;
}
.board-buttons {
    width: 100%;
    display: flex;
    margin-bottom: 1em;
    flex-wrap: wrap;
}
.board-buttons > *:not(:last-child) {
    margin-right: 10px;
    margin-bottom: 10px;
    //&:last-child {
        //margin: 0;
    //}
}
</style>