import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'


const firebaseConfig = {
  apiKey: "AIzaSyAHF-H-lG7YtAs3e_dB3jZMPcLoW8wf2WI",
  authDomain: "chess-openings-b7d86.firebaseapp.com",
  projectId: "chess-openings-b7d86",
  storageBucket: "chess-openings-b7d86.appspot.com",
  messagingSenderId: "687107327723",
  appId: "1:687107327723:web:767aa4f74c524a9ca2a0ae",
  measurementId: "G-KQLYXKEJ6S"
};
firebase.initializeApp(firebaseConfig)

// utils
const db = firebase.firestore()
const auth = firebase.auth()

// collection references
const usersCollection = db.collection('users')
const openingsCollection = db.collection('openings')
const commentsCollection = db.collection('comments')
const likesCollection = db.collection('likes')

// helper methods
/* Use a list of document ids to get from firebase collection */
const getFirebaseDocs = (item_ids, fb_collection, callback) => {
    let itemRefs = item_ids.map(id => {
        return fb_collection.doc(id).get();
    });
    Promise.all(itemRefs)
    .then(docs => {
        let items = docs.map(doc => doc.data());
        callback(items);
    })
    .catch(error => console.log(error))
}

// export utils/refs
export {
  db,
  auth,
  usersCollection,
  openingsCollection,
  commentsCollection,
  likesCollection,
  getFirebaseDocs,

}