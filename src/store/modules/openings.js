import * as fb from '../../firebase'
import firebase from 'firebase/app'
import { ToastProgrammatic as Toast } from 'buefy'

// initial state
const state = () => ({
  openings: [
    {
      name: 'e4e5',
      sequence: ['e4', 'e5']
    },
    {
      name: "King's Indian",
      sequence: ["d4", "Nf6", "c4", "g6", "Nc3", "Bg7", "e4", "O-O", "Nf3", "d6", "Be2", "e5", "O-O", "Nc6", "d5", "Ne7"]
    },
  ],
  userOpenings: [],
})

// getters
const getters = {
  openingNames: state => state.openings.map(o => o.name),
  openingFromName: state => name => state.openings.find(o => name == o.name),
}

// actions
const actions = {
  addOpening({ commit }, { name, sequence }) {
    commit('addOpening', { name, sequence })
  },
  removeOpening({ commit }, { name, sequence }) {
    commit('removeOpening', name)
  },

  async saveNewOpening({ commit }, opening) {
    await fb.openingsCollection.add({
      createdOn: new Date(),
      name: opening.name,
      sequence: opening.sequence,
      userId: fb.auth.currentUser.uid,
    }).then((resp) => {
      console.log('saved opening response')
      let currentUserID = fb.auth.currentUser.uid
      fb.usersCollection.doc(currentUserID).update({
        openings: firebase.firestore.FieldValue.arrayUnion(resp.id)
      })
      Toast.open('Opening saved!')
      dispatchEvent('getUserOpenings')
    })
  },

  async getUserOpenings({ commit, rootState }) {

    // If no user logged in, set an empty list.
    if (!rootState.auth.isLoggedIn) {
      commit('userOpenings', [])
      return;
    }

    // get current user, then get the list of IDs for their openings
    let currentUserID = fb.auth.currentUser.uid
    fb.usersCollection.doc(currentUserID)
      .get()

      // user the list of ids to get the actual openings
      .then(response => {
        fb.getFirebaseDocs(response.data().openings,
          fb.openingsCollection,

          // save the list of openings
          (openings) => {
            commit('userOpenings', openings)
          })
      })
  }

}


// mutations
const mutations = {
  addOpening(state, opening) { state.openings.push(opening) },
  removeOpening(state, openingName) {
    const openingIndex = state.openings.findIndex(
      o => o.name == openingName)
    state.openings.splice(openingIndex, 1)
  },
  userOpenings(state, userOpenings) { state.userOpenings = userOpenings }

}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}