import Vue from 'vue'
import Vuex from 'vuex'
import * as fb from '../../firebase'
import router from '../../routes'

const state = {
    userProfile: {},
    isLoggedIn: false,
    foo: 'bar',
}

const getters = {}

const mutations = {
    setUserProfile(state, val) {
        state.userProfile = val
        state.isLoggedIn = true
    },
    logout(state) {
        state.userProfile = {}
        state.isLoggedIn = false
    }
}
  
const actions = {
    async login({ dispatch }, form) {
        // sign user in
        const { user } = await fb.auth.signInWithEmailAndPassword(
            form.email, form.password)
        console.log('login returned: ', user)
        console.log('current user: ', fb.auth.currentUser)

        // fetch user profile and set in state
        dispatch('fetchUserProfile', user)
    },
    async signup({ dispatch }, form) {
        // sign user up
        const { user } = await fb.auth.createUserWithEmailAndPassword(form.email, form.password)
        console.log('created user on signup: ', user)
      
        // create user profile object in userCollections
        await fb.usersCollection.doc(user.uid).set({
            name: form.name,
            email: form.email,
            openings: [],
        })
      
        // fetch user profile and set in state
        dispatch('fetchUserProfile', user)
    },
    async fetchUserProfile({ commit, dispatch }, user) {
        // fetch user profile
        const userProfile = await fb.usersCollection.doc(user.uid).get()
        console.log('fetchUserProfile: ', userProfile)

        // set user profile in state
        commit('setUserProfile', userProfile.data())

        dispatch('openings/getUserOpenings', null, {root: true})
        
    },
    async logout({ commit, dispatch }) {
        fb.auth.signOut().then(() => {
            console.log('logout successful')
            commit('logout')
            dispatch('openings/getUserOpenings', null, {root: true})
        }, (error) => {
            console.log("Problem signing out: ", error)
        })
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
