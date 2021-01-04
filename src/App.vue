<template>
  <div id="app">
    <navbar class="page-nav" />
    <router-view class="page-main"></router-view>
    <site-footer class="page-footer" />
  </div>
</template>

<script>
import Navbar from '@/components/Navbar'
import SiteFooter from '@/components/SiteFooter'
//import AddOpeningBoard from '@/components/AddOpeningBoard'
//import TrainSpecificBoard from '@/components/TrainSpecificBoard'

//import {chessboard} from 'vue-chessboard'
import Chess from 'chess.js'

export default {
  name: 'App',
  components: {
    Navbar,
    SiteFooter,
  },
  data() {
    return {
    }
  },

  methods: {
  },
}
</script>

<style>
html, body {
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  display:flex;
  min-height: 100vh;
  flex-direction: column;
}
.page-footer {
  margin-top: auto;
}
</style>
