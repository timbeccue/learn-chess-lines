import Vue from 'vue'
import VueRouter from 'vue-router'
import router from './routes.js'
import store from './store'
import App from './App.vue'
import Buefy from 'buefy'
import './style/buefy-styles.scss'
import { auth } from "./firebase";


Vue.use(VueRouter)
Vue.use(Buefy)

Vue.config.productionTip = false

// Ensure firebase is initialized before loading app when
// a user refreshes the page. 
let app
auth.onAuthStateChanged(user => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
  if (user) {
    store.dispatch('auth/fetchUserProfile', user)
  }
})
