
<template>
  <div>
    <div class="board-wrapper">
      <b-field label="Mode">
        <b-radio-button v-model="viewMode" native-value="Add Opening">
          Add Opening
        </b-radio-button>

        <b-radio-button v-model="viewMode" native-value="Train Opening">
          Train Opening
        </b-radio-button>
      </b-field>

      <add-opening-board
        v-if="viewMode == 'Add Opening'"
        class="board"
        :class="{ 'hide-board1': viewMode != 'Add Opening' }"
        :fen="currentBoard"
        @onMove="addOpeningOnMove"
        ref="addopeningboard"
      />

      <training-board
        v-if="viewMode == 'Train Opening'"
        class="board"
        :class="{ 'hide-board1': viewMode != 'Train Opening' }"
        :fen="startingFen"
        @onMove="addOpeningOnMove"
        ref="trainingboard"
      />
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar";
import TrainingBoard from "@/components/Boards/TrainingBoard";
import AddOpeningBoard from "@/components/Boards/AddOpeningBoard";

import Chess from "chess.js";

const startingFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export default {
  name: "HomePage",
  components: {
    Navbar,
    AddOpeningBoard,
    TrainingBoard,
  },
  data() {
    return {
      startingFen: startingFen,

      viewMode: "Add Opening",
      positionInfo: "",
      currentBoard: "",

      addOpeningBoard: {
        history: [],
        fen: "",
      },
      newOpeningName: "",

      openings: [
        {
          name: "King's Indian",
          moves: [
            "d4",
            "Nf6",
            "c4",
            "g6",
            "Nc3",
            "Bg7",
            "e4",
            "O-O",
            "Nf3",
            "d6",
            "Be2",
            "e5",
            "O-O",
            "Nc6",
            "d5",
            "Ne7",
          ],
        },
        {
          name: "Kings Pawn",
          moves: ["e4", "e5"],
        },
      ],
    };
  },

  methods: {
    resize() {
      this.$refs.addopeningboard.resize();
      this.$refs.trainingboard.resize();
    },

    addOpeningOnMove(data) {
      this.addOpeningBoard = data;
    },

    showInfo(data) {
      this.positionInfo = data;
      this.fen = data.fen;
    },

    fenFromMoves(moves) {
      let game = new Chess();
      for (let i = 0; i < moves.length; i++) {
        game.move(moves[i]);
      }
      return game.fen();
    },

    loadGame(moves) {
      //console.log(moves)
      this.currentBoard = this.fenFromMoves(moves);
    },
  },
};
</script>

<style lang="scss" scoped>
.spacer {
  margin-bottom: 1em;
}
.board-wrapper {
  //display: inline-block;
  position: relative;
  width: 100%;
  padding: 1em;
}
.hide-board {
  // Only display the active board
  height: 0;
  width: 0;
  pointer-events: none;
  overflow: hidden;
  margin: 0;
}
</style>
