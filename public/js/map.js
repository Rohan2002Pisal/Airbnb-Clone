
mapboxgl.accessToken = MapToken;  // access from show.ejs and show.ejs ko access mila from .env se.
  const map = new mapboxgl.Map({
      container: 'map', // container ID
      style : "mapbox://styles/mapbox/streets-v12",  //you can change::->  (1. "satellite-streets-v12"  2. "dark-v11"  3. "light-v11"  4. "street-v12"  5. "outdoors-v12")
      center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90 (Taken from show.ejs and show.ejs ko mila from (listing.geometry.coordinates) )
      zoom: 9 // starting zoom you can change it to-> [2 , 8, 9 ,10]
  });

// For locationmarker:
  const marker = new mapboxgl.Marker({color :"light-pink"})
  .setLngLat(listing.geometry.coordinates) // hamre location ke anusar:(lnglat -> lognitude and latitude)
   .setPopup(
    new mapboxgl.Popup({offset : 25}).setHTML(
      `<h4> ${listing.Location} </h4> 
      <p> Exact location will be there after booking!. </p>`
    )
   )                                                         
  .addTo(map); // hamre show.ejs me <id ="map"> hai vaha

