import { initializeApp } from 'firebase'

const fb = initializeApp ({
    apiKey: "AIzaSyBhoDL945kABiXBBNgP-aCuGUG_W1PzUak",
    authDomain: "masterbrewer-4d3f9.firebaseapp.com",
    databaseURL: "https://masterbrewer-4d3f9.firebaseio.com",
    projectId: "masterbrewer-4d3f9",
    storageBucket: "",
    messagingSenderId: "645651800246"
  })

export const db = fb.database()
export const breweries = db.ref('breweries')
export const beers = db.ref('beers')
