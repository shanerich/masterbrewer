import { db } from 'src/util/firebase'

/*
breweries.on('child_added', function (snapshot) {
 var test = JSON.stringify(snapshot.val())
})

export default{
  data(){
      return{
          brewJson: brewers
      }
  }
}
*/


export default {
  firebase: {
    anObject: {
      source: db.ref('breweries'),
      // optionally bind as an object
      asObject: true,
      // optionally provide the cancelCallback
      cancelCallback: function () {},
      // this is called once the data has been retrieved from firebase
      readyCallback: function () {}
    }    
  }
}


    
/*
export default [
  { 
    "brewery_city": "Milton", 
    "brewery_description": "Dogfish Head started in June 1995 when Dogfish Head Brewings & Eats was established in the beach community of Rehoboth Beach, Delaware. Dogfish Head was the first brewpub of the state. The original plan to deliver great music, delicious food and fine beers to the community came to life when the first batch of Shelter Pale Ale beers were started. Soon, Dogfish Head engaged in brewing 12 gallons of beer batches to supply the restaurant’s need. Dogfish Head brewery quickly achieved popularity beyond the state and reaches to nearby areas like Philadelphia and Washington D.C. By 2000, Dogfish Head is selling over 20 types of beers in 30 states.", 
    "brewery_name": "Dogfish Head Craft Brewery", 
    "brewery_state": "Delaware", 
    "brewery_type": "Micro Brewery", 
    "brewery_verified": false, 
    "country_name": "United States", 
    ".key": "-L7LTB87p8qkRnaJTatL" 
  },
  { 
  "brewery_city": "Comstock", 
  "brewery_description": "Bell's Brewery, Inc. began in 1985 with a quest for better beer and a 15 gallon soup kettle. Since then, we've grown into a regional craft brewery that employs more than 500 people over an 31 state area (in addition to Washington DC and Puerto Rico). The dedication to brewing flavorful, unfiltered, quality craft beers that started in 1985 is still with us today. 100% family-owned and independent, we currently brew over 20 beers for distribution as well as many other small batch beers that are served at the Eccentric Cafe in downtown Kalamazoo.", 
  "brewery_name": "Bell's Brewery", 
  "brewery_state": "Michigan", 
  "brewery_type": "Micro Brewery", 
  "brewery_verified": false, 
  "country_name": "United States", 
  ".key": "-L7LTLByx_acdQUTCTD_" 
  }
]
*/
