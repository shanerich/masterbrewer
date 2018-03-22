import { initializeApp } from 'firebase'

const fb = initializeApp ({
    apiKey: "AIzaSyBhoDL945kABiXBBNgP-aCuGUG_W1PzUak",
    authDomain: "masterbrewer-4d3f9.firebaseapp.com",
    databaseURL: "https://masterbrewer-4d3f9.firebaseio.com",
    projectId: "masterbrewer-4d3f9",
    storageBucket: "gs://masterbrewer-4d3f9.appspot.com",
    messagingSenderId: "645651800246"
  })

export const db = fb.database()
export const gs = fb.storage()
export const auth = fb.auth()
export const breweries = db.ref('breweries')
export const beers = db.ref('beers')
