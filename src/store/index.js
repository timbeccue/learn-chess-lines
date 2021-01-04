import Vue from 'vue'
import Vuex from 'vuex'
import openings from './modules/openings'
import auth from './modules/auth'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        openings,
        auth,
    },
})