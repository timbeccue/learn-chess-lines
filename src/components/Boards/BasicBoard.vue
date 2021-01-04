<template>
  <div class="blue merida">
    <div ref="board" class="cg-board-wrap"></div>
    <br />
  </div>
</template>

<script>
import _ from "lodash";
import Chess from "chess.js";
import { Chessground } from "chessground";
import boardLogic from "./boardLogic";
export default {
  name: "BasicBoard",
  mixins: [boardLogic],
  methods: {
    resize() {
      let parentWidth = this.$refs.board.parentElement.clientWidth;
      console.log(parentWidth);
      this.$refs.board.style.width = parentWidth + "px";
      this.$refs.board.style.height = parentWidth + "px";
      this.board.redrawAll();
    },

    // Define this as its own method because components that extend
    // this may want a different starting procedure.
    init() {
      this.updatePosition();
      this.resize();
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style scoped>
.blue.merida {
  margin: 2em;
}
</style>